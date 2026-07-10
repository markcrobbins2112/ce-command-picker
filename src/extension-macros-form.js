// START OF FILE: src/extension-macros-form.js

const vscode = require('vscode');
const htmlTemplate = require('./extension-macros-html');

/**
 * Presents a side-by-side adaptive form layout panel.
 * Extracts configuration segments synchronously to bypass webview message-passing locks.
 */
async function promptAssignKey(context, commandItem, originalArgs, isEditMode) {
    const core = require('./extension-core');
    const ui = require('./extension-ui');

    const fullBindings = core.loadFullKeybindingsArray();
    const existingTargets = fullBindings.filter(b => b.command === commandItem.commandId);

    let targetToEdit = null;
    if (isEditMode) {
        if (existingTargets.length === 0) {
            vscode.window.showWarningMessage('No bindings exist to edit. Swapping to fresh Assignment Mode.');
        } else if (existingTargets.length === 1) {
            targetToEdit = existingTargets;
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

    let initialBaseKey = '';
    let initialShorthand = '';
    let initialFlags = '';
    let initialWhen = 'editorTextFocus';

    if (targetToEdit) {
        initialShorthand = core.formatToCustomShorthand(targetToEdit.key);
        initialWhen = targetToEdit.when || 'editorTextFocus';
        
        // Greedy lookbehind matching pattern protects base keys containing literal periods (e.g. "..c")
        const match = initialShorthand.match(/(.*)\.([wcas]*)$/);
        if (match && match[1] !== undefined && match[2] !== undefined) {
            initialBaseKey = match[1];
            initialFlags = match[2];
        } else {
            initialBaseKey = initialShorthand;
        }
    }

    const panelTitle = isEditMode ? `Edit Binding: ${derivedTitle}` : `Assign Key: ${derivedTitle}`;

    const panel = vscode.window.createWebviewPanel(
        'ceCommandPickerForm',
        panelTitle,
        vscode.ViewColumn.Beside,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    // Pass data synchronously as direct string interpolation arguments
    panel.webview.html = htmlTemplate.getWebviewContent(
        commandItem.commandId || derivedTitle,
        initialBaseKey,
        initialShorthand,
        initialFlags,
        initialWhen
    );

    // Listen for runtime feedback events sent up by the Webview container form controls
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

                    if (isEditMode && targetToEdit) {
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
                        vscode.window.showInformationMessage('Successfully saved key updates matching web form values.');
                    }

                    panel.dispose();
                    ui.renderPrimaryMenu(context, originalArgs);
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
