// START OF FILE: src/extension-macros-form.js

const vscode = require('vscode');
const fs = require('fs');
const jsonc = require('jsonc-parser');
const htmlTemplate = require('./extension-macros-html');

function findGroupForNewInstance(targetType, configPath, panelViewColumn) {
    const allGroups = (vscode.window.tabGroups && vscode.window.tabGroups.all) || [];
    let maxCol = 1;
    for (const group of allGroups) {
        if (typeof group.viewColumn === 'number' && group.viewColumn > maxCol) {
            maxCol = group.viewColumn;
        }
    }
    let targetCol = maxCol + 1;
    if (targetCol === panelViewColumn) {
        targetCol++;
    }
    return targetCol;
}

function findGroupForReusing(targetType, configPath, panelViewColumn) {
    const allGroups = (vscode.window.tabGroups && vscode.window.tabGroups.all) || [];
    // 1. Try to find an existing instance in any group that is NOT the webview group.
    for (const group of allGroups) {
        if (group.viewColumn === panelViewColumn) continue;
        for (const tab of group.tabs) {
            if (targetType === 'json') {
                if (tab.input instanceof vscode.TabInputText && tab.input.uri.fsPath === configPath) {
                    return group.viewColumn;
                }
            } else {
                if (tab.label === 'Keyboard Shortcuts' || tab.label === 'keybindings' || (tab.input && tab.input.viewType === 'keybindings')) {
                    return group.viewColumn;
                }
            }
        }
    }
    // 2. If no existing instance, try to find any existing group that is NOT the webview group.
    for (const group of allGroups) {
        if (group.viewColumn !== panelViewColumn) {
            return group.viewColumn;
        }
    }
    // 3. Fallback: create a new group beside the webview.
    if (panelViewColumn === vscode.ViewColumn.One) {
        return vscode.ViewColumn.Two;
    } else {
        return vscode.ViewColumn.One;
    }
}

async function focusViewColumn(column) {
    if (column === vscode.ViewColumn.One) {
        await vscode.commands.executeCommand('workbench.action.focusFirstEditorGroup');
    } else if (column === vscode.ViewColumn.Two) {
        await vscode.commands.executeCommand('workbench.action.focusSecondEditorGroup');
    } else if (column === vscode.ViewColumn.Three) {
        await vscode.commands.executeCommand('workbench.action.focusThirdEditorGroup');
    } else if (column === vscode.ViewColumn.Four) {
        await vscode.commands.executeCommand('workbench.action.focusFourthEditorGroup');
    } else if (column === vscode.ViewColumn.Five) {
        await vscode.commands.executeCommand('workbench.action.focusFifthEditorGroup');
    } else {
        await vscode.commands.executeCommand('workbench.action.focusFirstEditorGroup');
    }
}

async function focusOrCreateViewColumn(targetCol, panelViewColumn) {
    const allGroups = (vscode.window.tabGroups && vscode.window.tabGroups.all) || [];
    const groupExists = allGroups.some(g => g.viewColumn === targetCol);
    if (!groupExists) {
        let maxExistingCol = 0;
        allGroups.forEach(g => {
            if (typeof g.viewColumn === 'number' && g.viewColumn > maxExistingCol) {
                maxExistingCol = g.viewColumn;
            }
        });
        if (maxExistingCol > 0) {
            await focusViewColumn(maxExistingCol);
        }
        await vscode.commands.executeCommand('workbench.action.newGroupRight');
    } else {
        await focusViewColumn(targetCol);
    }
}

/**
 * Presents a side-by-side adaptive form layout panel.
 * Uses dynamic view type rotation to forcefully break service worker caching loops.
 */
async function promptAssignKey(context, commandItem, originalArgs, isEditMode) {
    const core = require('./extension-core');
    const ui = require('./extension-ui');

    let checkedOff = context.globalState.get('ce-command-picker.checkedOffCommands', []);
    if (!Array.isArray(checkedOff)) {
        checkedOff = [];
    }

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
        sourceToFill ? sourceToFill.key : '',
        originalArgs,
        checkedOff
    );

    panel.onDidChangeViewState(e => {
        if (panel.active) {
            panel.webview.postMessage({ type: 'viewstateChanged', active: true });
        }
    });

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

                case 'openKeybindings':
                    const panelViewCol = panel.viewColumn;
                    let targetCol;
                    if (message.newInstance) {
                        targetCol = findGroupForNewInstance('keybindings', null, panelViewCol);
                    } else {
                        targetCol = findGroupForReusing('keybindings', null, panelViewCol);
                    }
                    await focusOrCreateViewColumn(targetCol, panelViewCol);
                    if (message.args) {
                        await vscode.commands.executeCommand(message.commandName, ...message.args);
                    } else {
                        await vscode.commands.executeCommand(message.commandName);
                    }
                    break;

                case 'launchCollisionUI': {
                    const targetCmdId = message.commandId;
                    const cmdItem = { label: targetCmdId, commandId: targetCmdId };
                    promptAssignKey(context, cmdItem, [targetCmdId], true);
                    break;
                }

                case 'validate':
                    const checkText = message.value.trim();
                    const validator = require('./extension-macros-validator');
                    const verification = validator.validateAndParseInput(checkText);

                    if (!verification.isValid) {
                        panel.webview.postMessage({ type: 'status', status: 'error', text: verification.errorReason });
                    } else {
                        let shCode = '';
                        let natKey = verification.nativeKey;
                        try {
                            shCode = core.formatToCustomShorthand(natKey);
                        } catch (e) {
                            shCode = checkText;
                        }

                        const collisions = fullBindings.filter(b => b.key.toLowerCase() === natKey.toLowerCase() && b.command !== commandItem.commandId);
                        if (collisions.length > 0) {
                            const collisionCommands = [...new Set(collisions.map(c => c.command))];
                            panel.webview.postMessage({
                                type: 'status',
                                status: 'warning',
                                text: `⚠️ Collision! Maps to: ${collisionCommands.join(', ')}`,
                                nativeKey: natKey,
                                shortCode: shCode,
                                collisionCommands: collisionCommands
                            });
                        } else {
                            panel.webview.postMessage({ type: 'status', status: 'success', text: `✓ ${natKey}`, nativeKey: natKey, shortCode: shCode });
                        }
                    }
                    break;

                case 'submit': {
                    let currentBindings = core.loadFullKeybindingsArray();
                    const nativeKey = message.nativeKey;
                    const finalWhen = message.when.trim();
                    const actionType = message.actionType || 'save'; // 'save', 'clone', 'saveAndClone'

                    if (actionType === 'clone' || actionType === 'saveAndClone') {
                        // Clone/Add mode: ALWAYS appends as a new binding, keeping the original intact
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

                    fullBindings = core.loadFullKeybindingsArray();
                    const updatedExistingTargets = fullBindings.filter(b => b.command === commandItem.commandId);

                    if (actionType === 'save' && targetToEdit) {
                        const newlySaved = updatedExistingTargets.find(b => b.key === nativeKey && b.when === finalWhen);
                        if (newlySaved) {
                            targetToEdit = newlySaved;
                        }
                    }

                    const updatedKeysLabel = updatedExistingTargets.map(t => `${core.formatToCustomShorthand(t.key)} (${t.key})`).join('  |  ') || 'None';
                    const updatedWhenLabel = (targetToEdit ? targetToEdit.when : (updatedExistingTargets[0] ? updatedExistingTargets[0].when : 'editorTextFocus')) || 'editorTextFocus';

                    panel.webview.postMessage({
                        type: 'saveSuccess',
                        currentKeys: updatedKeysLabel,
                        currentWhen: updatedWhenLabel
                    });
                    break;
                }

                case 'cancel':
                    panel.dispose();
                    ui.renderPrimaryMenu(context, originalArgs);
                    break;

                case 'done':
                    if (message.modified) {
                        const choice = await vscode.window.showWarningMessage(
                            'You have unsaved changes in the keybindings form. Are you sure you want to close?',
                            { modal: true },
                            'Close Anyway',
                            'Keep Editing'
                        );
                        if (choice !== 'Close Anyway') {
                            break;
                        }
                    }
                    panel.dispose();
                    break;

                case 'editJson':
                    try {
                        const targetCmdId = message.commandId || commandItem.commandId;
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
                                    let currentArgs = null;
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
                                            } else if (keyName === 'args' && valueNode.type === 'array' && valueNode.children) {
                                                currentArgs = valueNode.children.map(c => c.value);
                                            }
                                        }
                                    });

                                    if (currentCmd === targetCmdId) {
                                        if (targetCmdId === 'ce-command-picker.show') {
                                            if (Array.isArray(currentArgs) && Array.isArray(originalArgs)) {
                                                const matchAll = currentArgs.length === originalArgs.length && 
                                                    currentArgs.every((val, idx) => val === originalArgs[idx]);
                                                if (matchAll) {
                                                    bestMatchNode = commandNode || itemNode;
                                                }
                                            }
                                        } else {
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

                                        if (currentCmd === targetCmdId) {
                                            bestMatchNode = commandNode || itemNode;
                                        }
                                    }
                                });
                            }
                        }

                        const doc = await vscode.workspace.openTextDocument(configPath);
                        
                        const pViewCol = panel.viewColumn;
                        let targetC;
                        if (message.newInstance) {
                            targetC = findGroupForNewInstance('json', configPath, pViewCol);
                        } else {
                            targetC = findGroupForReusing('json', configPath, pViewCol);
                        }
                        
                        await focusOrCreateViewColumn(targetC, pViewCol);
                        const editor = await vscode.window.showTextDocument(doc, targetC);
                        
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
                        let parsed = jsonc.parse(text.trim());
                        if (parsed && typeof parsed === 'object') {
                            if (Array.isArray(parsed)) {
                                parsed = parsed[0];
                            }
                            if (parsed && parsed.key) {
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

                case 'toggleCheckoff':
                    try {
                        let checkedList = context.globalState.get('ce-command-picker.checkedOffCommands', []);
                        if (!Array.isArray(checkedList)) {
                            checkedList = [];
                        }
                        const targetId = message.commandId;
                        if (message.checked) {
                            if (!checkedList.includes(targetId)) {
                                checkedList.push(targetId);
                            }
                        } else {
                            checkedList = checkedList.filter(id => id !== targetId);
                        }
                        await context.globalState.update('ce-command-picker.checkedOffCommands', checkedList);
                    } catch (e) {
                        vscode.window.showErrorMessage(`Failed to persist checkoff: ${e.message}`);
                    }
                    break;

                case 'pageToCommand':
                    try {
                        panel.dispose();
                        const targetCmdId = message.commandId;
                        const targetItem = {
                            commandId: targetCmdId,
                            label: targetCmdId.replace(/^[\w-]+\./, '').replace(/([A-Z])/g, ' $1').replace(/[_-]/g, ' '),
                        };
                        targetItem.label = targetItem.label.charAt(0).toUpperCase() + targetItem.label.slice(1);
                        promptAssignKey(context, targetItem, originalArgs, isEditMode);
                    } catch (e) {
                        vscode.window.showErrorMessage(`Failed to page to command: ${e.message}`);
                    }
                    break;

                case 'closeAllKbJson':
                    try {
                        const configPath = core.getKeybindingsFilePath();
                        const allGroups = (vscode.window.tabGroups && vscode.window.tabGroups.all) || [];
                        let closedCount = 0;
                        const tabsToClose = [];
                        for (const group of allGroups) {
                            for (const tab of group.tabs) {
                                const isKbJson = (tab.input && tab.input.uri && tab.input.uri.fsPath === configPath) || 
                                                 (tab.label && tab.label.toLowerCase() === 'keybindings.json');
                                if (isKbJson) {
                                    tabsToClose.push(tab);
                                }
                            }
                        }
                        for (const tab of tabsToClose) {
                            await vscode.window.tabGroups.close(tab);
                            closedCount++;
                        }
                        if (closedCount > 0) {
                            vscode.window.showInformationMessage(`Closed ${closedCount} keybindings.json file tab(s).`);
                        } else {
                            vscode.window.showInformationMessage('No keybindings.json file tabs open.');
                        }
                    } catch (e) {
                        vscode.window.showErrorMessage(`Error closing keybindings.json tabs: ${e.message}`);
                    }
                    break;

                case 'closeAllKbUi':
                    try {
                        const allGroups = (vscode.window.tabGroups && vscode.window.tabGroups.all) || [];
                        let closedCount = 0;
                        const tabsToClose = [];
                        for (const group of allGroups) {
                            for (const tab of group.tabs) {
                                if (tab.label === 'Keyboard Shortcuts' || tab.label === 'keybindings' || (tab.input && tab.input.viewType === 'keybindings')) {
                                    tabsToClose.push(tab);
                                }
                            }
                        }
                        for (const tab of tabsToClose) {
                            await vscode.window.tabGroups.close(tab);
                            closedCount++;
                        }
                        if (closedCount > 0) {
                            vscode.window.showInformationMessage(`Closed ${closedCount} Keyboard Shortcuts tab(s).`);
                        } else {
                            vscode.window.showInformationMessage('No Keyboard Shortcuts tabs open.');
                        }
                    } catch (e) {
                        vscode.window.showErrorMessage(`Error closing Keyboard Shortcuts tabs: ${e.message}`);
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
