// START OF FILE: src/extension-macros-form.js

const vscode = require('vscode');
const htmlTemplate = require('./extension-macros-html');

/**
 * Presents a side-by-side adaptive form layout panel.
 * Uses dynamic view type rotation to forcefully break service worker caching loops.
 */
async function promptAssignKey(context, commandItem, originalArgs, isEditMode) {
    const core = require('./extension-core');
    const ui = require('./extension-ui');

    let fullBindings = core.loadFullKeybindingsArray();
    const existingTargets = fullBindings.filter(b => b.command === commandItem.commandId);

    let targetToEdit = null;
    if (isEditMode) {
        if (existingTargets.length === 0) {
            vscode.window.showWarningMessage('No bindings exist to edit. Swapping to fresh Assignment Mode.');
        } else if (existingTargets.length === 1) {
            targetToEdit = existingTargets[0];
        } else {
            const choice = await vscode.window.showQuickPick(
                existingTargets.map(t => ({ label: t.key, detail: t.when || 'No context clause', raw: t })),
                { placeHolder: 'Select specific configuration signature row to modify:' }
            );
            if (!choice) { ui.renderPrimaryMenu(context, originalArgs); return; }
            targetToEdit = choice.raw;
        }
    }

    let derivedTitle = commandItem.label || commandItem.commandId || 'Unknown Command';

    let chord1Base = '';
    let chord1Flags = '';
    let chord2Base = '';
    let chord2Flags = '';
    let initialWhen = 'editorTextFocus';

    if (targetToEdit) {
        const fullShorthand = core.formatToCustomShorthand(targetToEdit.key);
        initialWhen = targetToEdit.when || 'editorTextFocus';
        
        const chords = fullShorthand.trim().split(/\s+/);
        if (chords.length >= 1 && chords[0]) {
            const match = chords[0].match(/(.*)\.([wcas]*)$/);
            if (match) {
                chord1Base = match[1];
                chord1Flags = match[2].replace(/[^cas]/g, '');
            } else {
                chord1Base = chords[0];
            }
        }
        if (chords.length >= 2 && chords[1]) {
            const match = chords[1].match(/(.*)\.([wcas]*)$/);
            if (match) {
                chord2Base = match[1];
                chord2Flags = match[2].replace(/[^cas]/g, '');
            } else {
                chord2Base = chords[1];
            }
        }
    }

    const currentKeysLabel = existingTargets.map(t => core.formatToCustomShorthand(t.key)).join(' ') || 'None';
    const currentWhenLabel = (targetToEdit ? targetToEdit.when : (existingTargets[0] ? existingTargets[0].when : 'editorTextFocus')) || 'editorTextFocus';

    const panelTitle = isEditMode ? `Edit Binding: ${derivedTitle}` : `Assign Key: ${derivedTitle}`;

    // Use a stable, static viewType string to avoid polluting service workers and causing controller-change mismatch errors.
    const viewType = 'ceCommandPickerForm';

    const panel = vscode.window.createWebviewPanel(
        viewType,
        panelTitle,
        vscode.ViewColumn.Beside,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    // Initialize HTML synchronously to establish the service worker scope cleanly in a single tick.
    panel.webview.html = htmlTemplate.getWebviewContent(
        commandItem.commandId || derivedTitle,
        chord1Base,
        chord1Flags,
        chord2Base,
        chord2Flags,
        initialWhen,
        currentKeysLabel,
        currentWhenLabel
    );

    panel.webview.onDidReceiveMessage(
        async (message) => {
            switch (message.command) {
                case 'validate':
                    const checkText = message.value.trim();
                    const validator = require('./extension-macros-validator');
                    const verification = validator.validateAndParseInput(checkText);

                    if (!verification.isValid) {
                        panel.webview.postMessage({ type: 'status', status: 'error', text: verification.errorReason });
                    } else {
                        const collisions = fullBindings.filter(b => b.key.toLowerCase() === verification.nativeKey.toLowerCase() && b.command !== commandItem.commandId);
                        if (collisions.length > 0) {
                            panel.webview.postMessage({ type: 'status', status: 'warning', text: `⚠️ Collision! Maps to: ${collisions.map(c => c.command).join(', ')}` });
                        } else {
                            panel.webview.postMessage({ type: 'status', status: 'success', text: `✓ Translates to native: "${verification.nativeKey}"`, nativeKey: verification.nativeKey });
                        }
                    }
                    break;

                case 'submit':
                    let currentBindings = core.loadFullKeybindingsArray();
                    const nativeKey = message.nativeKey;
                    const finalWhen = message.when.trim();
                    const actionType = message.actionType || 'save'; // 'save', 'clone', 'saveAndClone'

                    if (actionType === 'clone') {
                        // Clone mode: ALWAYS appends as a new binding, keeping the original intact
                        const freshMapping = { key: nativeKey, command: commandItem.commandId };
                        if (finalWhen) freshMapping.when = finalWhen;
                        currentBindings.push(freshMapping);
                    } else if (isEditMode && targetToEdit) {
                        currentBindings = currentBindings.map(b => {
                            if (b.key === targetToEdit.key && b.command === targetToEdit.command && b.when === targetToEdit.when) {
                                const freshObj = { key: nativeKey, command: commandItem.commandId };
                                if (finalWhen) freshObj.when = finalWhen;
                                return freshObj;
                            }
                            return b;
                        });
                    } else {
                        const freshMapping = { key: nativeKey, command: commandItem.commandId };
                        if (finalWhen) freshMapping.when = finalWhen;
                        currentBindings.push(freshMapping);
                    }

                    if (core.saveKeybindingsArray(currentBindings)) {
                        vscode.window.showInformationMessage(`Successfully saved key updates matching web form values (${actionType}).`);
                    }

                    if (actionType === 'saveAndClone') {
                        // Update fullBindings variable so that subsequent validations reflect the newly added bindings
                        fullBindings = core.loadFullKeybindingsArray();
                        const updatedExistingTargets = fullBindings.filter(b => b.command === commandItem.commandId);
                        const updatedKeysLabel = updatedExistingTargets.map(t => core.formatToCustomShorthand(t.key)).join(' ') || 'None';
                        const updatedWhenLabel = (targetToEdit ? targetToEdit.when : (updatedExistingTargets[0] ? updatedExistingTargets[0].when : 'editorTextFocus')) || 'editorTextFocus';
                        panel.webview.postMessage({
                            type: 'updateLabels',
                            currentKeys: updatedKeysLabel,
                            currentWhen: updatedWhenLabel
                        });
                    } else {
                        panel.dispose();
                        ui.renderPrimaryMenu(context, originalArgs);
                    }
                    break;

                case 'cancel':
                    panel.dispose();
                    ui.renderPrimaryMenu(context, originalArgs);
                    break;
            }
        },
        undefined,
        context.subscriptions
    );
}

module.exports = { promptAssignKey };

// END OF FILE: src/extension-macros-form.js
