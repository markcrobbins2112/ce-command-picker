// START OF FILE: src/extension-macros-form.js

const vscode = require('vscode');
const fs = require('fs');
const jsonc = require('jsonc-parser');
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

    const sourceToFill = targetToEdit || existingTargets[0];

    if (sourceToFill) {
        const fullShorthand = core.formatToCustomShorthand(sourceToFill.key);
        initialWhen = sourceToFill.when !== undefined ? sourceToFill.when : '';
        
        const chords = fullShorthand.trim().split(/\s+/);
        if (chords.length >= 1 && chords[0]) {
            const match = chords[0].match(/(.*)\.([wcas]*)$/);
            if (match) {
                chord1Base = match[1];
                chord1Flags = match[2].replace(/[^wcas]/g, '');
            } else {
                chord1Base = chords[0];
            }
        }
        if (chords.length >= 2 && chords[1]) {
            const match = chords[1].match(/(.*)\.([wcas]*)$/);
            if (match) {
                chord2Base = match[1];
                chord2Flags = match[2].replace(/[^wcas]/g, '');
            } else {
                chord2Base = chords[1];
            }
        }
    }

    const currentKeysLabel = existingTargets.map(t => `${core.formatToCustomShorthand(t.key)} (${t.key})`).join('  |  ') || 'None';
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
        commandItem.commandId,
        commandItem.commandId || derivedTitle,
        chord1Base,
        chord1Flags,
        chord2Base,
        chord2Flags,
        initialWhen,
        currentKeysLabel,
        currentWhenLabel,
        sourceToFill ? sourceToFill.key : ''
    );

    panel.webview.onDidReceiveMessage(
        async (message) => {
            switch (message.command) {
                case 'executeCommand':
                    if (message.args) {
                        vscode.commands.executeCommand(message.commandName, ...message.args);
                    } else {
                        vscode.commands.executeCommand(message.commandName);
                    }
                    break;

                case 'validate':
                    const checkText = message.value.trim();
                    const validator = require('./extension-macros-validator');
                    const verification = validator.validateAndParseInput(checkText);

                    if (!verification.isValid) {
                        panel.webview.postMessage({ type: 'status', status: 'error', text: verification.errorReason });
                    } else {
                        const collisions = fullBindings.filter(b => b.key.toLowerCase() === verification.nativeKey.toLowerCase() && b.command !== commandItem.commandId);
                        if (collisions.length > 0) {
                            panel.webview.postMessage({ type: 'status', status: 'warning', text: `⚠️ Collision! Maps to: ${collisions.map(c => c.command).join(', ')}`, nativeKey: verification.nativeKey });
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
                        const updatedKeysLabel = updatedExistingTargets.map(t => `${core.formatToCustomShorthand(t.key)} (${t.key})`).join('  |  ') || 'None';
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

                case 'editJson':
                    try {
                        const currentTarget = targetToEdit || (existingTargets.length > 0 ? existingTargets[0] : null);
                        const checkKey = message.nativeKey || (currentTarget ? currentTarget.key : '');
                        const checkWhen = message.when !== undefined ? message.when.trim() : (currentTarget ? (currentTarget.when || '') : '');
                        
                        const configPath = core.getKeybindingsFilePath();
                        if (!fs.existsSync(configPath)) {
                            vscode.window.showWarningMessage('keybindings.json file does not exist.');
                            break;
                        }

                        const fileContent = fs.readFileSync(configPath, 'utf8');
                        const rootNode = jsonc.parseTree(fileContent);
                        
                        let bestMatchNode = null;
                        if (rootNode && rootNode.children) {
                            // First attempt: try to match command, key, and when clause
                            rootNode.children.forEach(itemNode => {
                                if (itemNode.type === 'object' && itemNode.children) {
                                    let currentCmd = '';
                                    let currentKey = '';
                                    let currentWhen = '';
                                    let commandNode = null;

                                    itemNode.children.forEach(propertyNode => {
                                        if (propertyNode.type === 'property' && propertyNode.children && propertyNode.children.length === 2) {
                                            const keyName = propertyNode.children[0].value;
                                            const valueNode = propertyNode.children[1];

                                            if (keyName === 'command') {
                                                currentCmd = valueNode.value;
                                                commandNode = valueNode;
                                            } else if (keyName === 'key') {
                                                currentKey = valueNode.value;
                                            } else if (keyName === 'when') {
                                                currentWhen = valueNode.value;
                                            }
                                        }
                                    });

                                    if (currentCmd === commandItem.commandId) {
                                        const normCheck = currentKey.replace(/\s+/g, '').toLowerCase();
                                        const normTarget = checkKey.replace(/\s+/g, '').toLowerCase();
                                        if (normCheck === normTarget) {
                                            const targetWhen = checkWhen;
                                            const actualWhen = (currentWhen || '').trim();
                                            if (targetWhen === actualWhen) {
                                                bestMatchNode = commandNode || itemNode;
                                            }
                                        }
                                    }
                                }
                            });

                            // Second attempt fallback: if no key matched, match just the command
                            if (!bestMatchNode) {
                                rootNode.children.forEach(itemNode => {
                                    if (itemNode.type === 'object' && itemNode.children) {
                                        let currentCmd = '';
                                        let commandNode = null;

                                        itemNode.children.forEach(propertyNode => {
                                            if (propertyNode.type === 'property' && propertyNode.children && propertyNode.children.length === 2) {
                                                const keyName = propertyNode.children[0].value;
                                                const valueNode = propertyNode.children[1];

                                                if (keyName === 'command') {
                                                    currentCmd = valueNode.value;
                                                    commandNode = valueNode;
                                                }
                                            }
                                        });

                                        if (currentCmd === commandItem.commandId) {
                                            bestMatchNode = commandNode || itemNode;
                                        }
                                    }
                                });
                            }
                        }

                        const doc = await vscode.workspace.openTextDocument(configPath);
                        const editor = await vscode.window.showTextDocument(doc);
                        
                        if (bestMatchNode) {
                            const targetPos = doc.positionAt(bestMatchNode.offset);
                            const nextSelection = new vscode.Selection(targetPos, targetPos);
                            editor.selection = nextSelection;
                            editor.revealRange(new vscode.Range(targetPos, targetPos), vscode.TextEditorRevealType.InCenter);
                            vscode.window.showInformationMessage('Opened keybindings.json at the current binding.');
                        } else {
                            vscode.window.showInformationMessage('Opened keybindings.json file.');
                        }
                    } catch (e) {
                        vscode.window.showErrorMessage(`Failed to open keybindings file: ${e.message}`);
                    }
                    break;

                case 'unbind':
                    const currentTargetUnbind = targetToEdit || (existingTargets.length > 0 ? existingTargets[0] : null);
                    const unbindKey = message.nativeKey || (currentTargetUnbind ? currentTargetUnbind.key : '');
                    const unbindWhen = message.when !== undefined ? message.when.trim() : (currentTargetUnbind ? (currentTargetUnbind.when || '') : '');
                    
                    if (unbindKey) {
                        let bindingsList = core.loadFullKeybindingsArray();
                        const initialLength = bindingsList.length;
                        bindingsList = bindingsList.filter(b => {
                            const normB = b.key.replace(/\s+/g, '').toLowerCase();
                            const normTarget = unbindKey.replace(/\s+/g, '').toLowerCase();
                            const matchesKey = normB === normTarget;
                            const matchesCmd = b.command === commandItem.commandId;
                            const matchesWhen = (b.when || '') === (unbindWhen || '');
                            return !(matchesKey && matchesCmd && matchesWhen);
                        });
                        if (bindingsList.length < initialLength) {
                            if (core.saveKeybindingsArray(bindingsList)) {
                                vscode.window.showInformationMessage(`Successfully removed keybinding mapping for: ${commandItem.commandId}`);
                            }
                        } else {
                            vscode.window.showWarningMessage('No matching keybinding found to unbind.');
                        }
                    } else {
                        vscode.window.showWarningMessage('No existing keybinding found to unbind.');
                    }
                    panel.dispose();
                    ui.renderPrimaryMenu(context, originalArgs);
                    break;

                case 'copyBinding':
                    if (message.value) {
                        await vscode.env.clipboard.writeText(message.value);
                        vscode.window.showInformationMessage('Copied keybinding JSON block to clipboard.');
                    }
                    break;

                case 'copyToClipboard':
                    if (message.value) {
                        await vscode.env.clipboard.writeText(message.value);
                        if (message.infoMsg) {
                            vscode.window.showInformationMessage(message.infoMsg);
                        }
                    }
                    break;

                case 'pasteBinding':
                    try {
                        const text = await vscode.env.clipboard.readText();
                        const parsed = JSON.parse(text.trim());
                        if (parsed && typeof parsed === 'object') {
                            if (parsed.key) {
                                const fullShorthand = core.formatToCustomShorthand(parsed.key);
                                const chords = fullShorthand.trim().split(/\s+/);
                                let c1Base = '';
                                let c1Flags = '';
                                let c2Base = '';
                                let c2Flags = '';
                                if (chords.length >= 1 && chords[0]) {
                                    const match = chords[0].match(/(.*)\.([wcas]*)$/);
                                    if (match) {
                                        c1Base = match[1];
                                        c1Flags = match[2];
                                    } else {
                                        c1Base = chords[0];
                                    }
                                }
                                if (chords.length >= 2 && chords[1]) {
                                    const match = chords[1].match(/(.*)\.([wcas]*)$/);
                                    if (match) {
                                        c2Base = match[1];
                                        c2Flags = match[2];
                                    } else {
                                        c2Base = chords[1];
                                    }
                                }
                                panel.webview.postMessage({
                                    type: 'pasteBindingData',
                                    chord1Base: c1Base,
                                    chord1Flags: c1Flags,
                                    chord2Base: c2Base,
                                    chord2Flags: c2Flags,
                                    when: parsed.when !== undefined ? parsed.when : ''
                                });
                                vscode.window.showInformationMessage('Successfully pasted keybinding JSON from clipboard.');
                            } else {
                                vscode.window.showErrorMessage('Invalid keybinding JSON: missing "key" property.');
                            }
                        } else {
                            vscode.window.showErrorMessage('Clipboard content is not a valid JSON object.');
                        }
                    } catch (e) {
                        vscode.window.showErrorMessage('Failed to parse clipboard text as JSON.');
                    }
                    break;
            }
        },
        undefined,
        context.subscriptions
    );
}

module.exports = { promptAssignKey };

// END OF FILE: src/extension-macros-form.js
