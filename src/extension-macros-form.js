// START OF FILE: src/extension-macros-form.js

const vscode = require('vscode');
const fs = require('fs');
const jsonc = require('jsonc-parser');
const htmlTemplate = require('./extension-macros-html');

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

async function handleOpenHelper(targetType, configPath, panelViewCol, newInstance, preferredDirection, openAction) {
    const allGroups = (vscode.window.tabGroups && vscode.window.tabGroups.all) || [];

    let newGroupCommand = 'workbench.action.newGroupRight';
    if (preferredDirection === 'up') newGroupCommand = 'workbench.action.newGroupAbove';
    else if (preferredDirection === 'down') newGroupCommand = 'workbench.action.newGroupBelow';
    else if (preferredDirection === 'left') newGroupCommand = 'workbench.action.newGroupLeft';

    if (newInstance) {
        await vscode.commands.executeCommand(newGroupCommand);
        await new Promise(resolve => setTimeout(resolve, 100));
        await openAction(vscode.ViewColumn.Active);
    } else {
        let foundGroupCol = null;
        for (const group of allGroups) {
            if (group.viewColumn === panelViewCol) continue;
            for (const tab of group.tabs) {
                if (targetType === 'json') {
                    if (tab.input && tab.input.uri && tab.input.uri.fsPath === configPath) {
                        foundGroupCol = group.viewColumn;
                        break;
                    }
                } else {
                    if (tab.label === 'Keyboard Shortcuts' || tab.label === 'keybindings' || (tab.input && tab.input.viewType === 'keybindings')) {
                        foundGroupCol = group.viewColumn;
                        break;
                    }
                }
            }
            if (foundGroupCol !== null) break;
        }

        if (foundGroupCol !== null) {
            await focusViewColumn(foundGroupCol);
            await openAction(foundGroupCol);
        } else {
            const otherGroup = allGroups.find(g => g.viewColumn !== panelViewCol);
            if (!otherGroup) {
                await vscode.commands.executeCommand(newGroupCommand);
                await new Promise(resolve => setTimeout(resolve, 100));
                await openAction(vscode.ViewColumn.Active);
            } else {
                await focusViewColumn(otherGroup.viewColumn);
                await openAction(otherGroup.viewColumn);
            }
        }
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
    let existingTargets = fullBindings.filter(b => b.command === commandItem.commandId);

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
        commandItem.commandId,
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
                    await handleOpenHelper('keybindings', null, panel.viewColumn, message.newInstance, message.preferredDirection, async (vCol) => {
                        if (message.args) {
                            await vscode.commands.executeCommand(message.commandName, ...message.args);
                        } else {
                            await vscode.commands.executeCommand(message.commandName);
                        }
                    });
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

                        const firstChord = natKey.toLowerCase().trim().split(/\s+/)[0];
                        const standardPrefixes = [
                            'ctrl+k', 'ctrl+x', 'ctrl+y', 'ctrl+g', 'ctrl+e', 'ctrl+h', 'ctrl+m',
                            'cmd+k', 'cmd+x', 'cmd+y', 'cmd+g', 'cmd+e', 'cmd+h', 'cmd+m'
                        ];
                        const isPrefix = standardPrefixes.includes(firstChord) || fullBindings.some(b => {
                            const bKey = b.key.toLowerCase().trim();
                            return bKey.startsWith(firstChord + ' ');
                        });

                        const collisions = fullBindings.filter(b => b.key.toLowerCase() === natKey.toLowerCase() && b.command !== commandItem.commandId);
                        if (collisions.length > 0) {
                            const collisionCommands = [...new Set(collisions.map(c => c.command))];
                            let msg = `⚠️ Collision! Maps to: ${collisionCommands.join(', ')}`;
                            if (isPrefix) {
                                msg += ` (First key is a Prefix Key)`;
                            }
                            panel.webview.postMessage({
                                type: 'status',
                                status: 'warning',
                                text: msg,
                                nativeKey: natKey,
                                shortCode: shCode,
                                collisionCommands: collisionCommands,
                                isPrefix: isPrefix
                            });
                        } else {
                            let msg = `✓ ${natKey}`;
                            if (isPrefix) {
                                msg += ` (First key is a Prefix Key)`;
                            }
                            panel.webview.postMessage({
                                type: 'status',
                                status: 'success',
                                text: msg,
                                nativeKey: natKey,
                                shortCode: shCode,
                                isPrefix: isPrefix
                            });
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
                        await handleOpenHelper('json', configPath, panel.viewColumn, message.newInstance, message.preferredDirection, async (vCol) => {
                            const editor = await vscode.window.showTextDocument(doc, vCol);
                            if (bestMatchNode) {
                                const targetPos = doc.positionAt(bestMatchNode.offset);
                                const nextSelection = new vscode.Selection(targetPos, targetPos);
                                editor.selection = nextSelection;
                                editor.revealRange(new vscode.Range(targetPos, targetPos), vscode.TextEditorRevealType.InCenter);
                                vscode.window.showInformationMessage('Opened keybindings.json at the current binding.');
                            } else {
                                vscode.window.showInformationMessage('Opened keybindings.json file.');
                            }
                        });
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
                        const targetCmdId = message.commandId;
                        const targetItem = {
                            commandId: targetCmdId,
                            label: targetCmdId.replace(/^[\w-]+\./, '').replace(/([A-Z])/g, ' $1').replace(/[_-]/g, ' '),
                        };
                        targetItem.label = targetItem.label.charAt(0).toUpperCase() + targetItem.label.slice(1);

                        // Reload and update closure variables in-place
                        fullBindings = core.loadFullKeybindingsArray();
                        existingTargets = fullBindings.filter(b => b.command === targetCmdId);
                        commandItem = targetItem;

                        targetToEdit = null;
                        if (isEditMode) {
                            if (existingTargets.length === 1) {
                                targetToEdit = existingTargets[0];
                            } else if (existingTargets.length > 1) {
                                targetToEdit = existingTargets[0];
                            }
                        }

                        const derivedTitle = targetItem.label || targetItem.commandId || 'Unknown Command';
                        const panelTitle = isEditMode ? `Edit Binding: ${derivedTitle}` : `Assign Key: ${derivedTitle}`;
                        panel.title = panelTitle;

                        let targetChord1Base = '';
                        let targetChord1Flags = '';
                        let targetChord2Base = '';
                        let targetChord2Flags = '';
                        let targetInitialWhen = 'editorTextFocus';

                        const sourceToFill = targetToEdit || existingTargets[0];

                        if (sourceToFill) {
                            const fullShorthand = core.formatToCustomShorthand(sourceToFill.key);
                            targetInitialWhen = sourceToFill.when !== undefined ? sourceToFill.when : '';
                            
                            const chords = fullShorthand.trim().split(/\s+/);
                            if (chords.length >= 1 && chords[0]) {
                                const match = chords[0].match(/(.*)\.([wcas]*)$/);
                                if (match) {
                                    targetChord1Base = match[1];
                                    targetChord1Flags = match[2].replace(/[^wcas]/g, '');
                                } else {
                                    targetChord1Base = chords[0];
                                }
                            }
                            if (chords.length >= 2 && chords[1]) {
                                const match = chords[1].match(/(.*)\.([wcas]*)$/);
                                if (match) {
                                    targetChord2Base = match[1];
                                    targetChord2Flags = match[2].replace(/[^wcas]/g, '');
                                } else {
                                    targetChord2Base = chords[1];
                                }
                            }
                        }

                        const targetKeysLabel = existingTargets.map(t => `${core.formatToCustomShorthand(t.key)} (${t.key})`).join('  |  ') || 'None';
                        const targetWhenLabel = (targetToEdit ? targetToEdit.when : (existingTargets[0] ? existingTargets[0].when : 'editorTextFocus')) || 'editorTextFocus';

                        let updatedCheckedOff = context.globalState.get('ce-command-picker.checkedOffCommands', []);
                        if (!Array.isArray(updatedCheckedOff)) {
                            updatedCheckedOff = [];
                        }

                        panel.webview.postMessage({
                            type: 'updateItem',
                            commandId: targetCmdId,
                            title: targetCmdId,
                            chord1Base: targetChord1Base,
                            chord1Flags: targetChord1Flags,
                            chord2Base: targetChord2Base,
                            chord2Flags: targetChord2Flags,
                            whenClause: targetInitialWhen,
                            currentKeys: targetKeysLabel,
                            currentWhen: targetWhenLabel,
                            initialNativeKey: sourceToFill ? sourceToFill.key : '',
                            checkedOffCommands: updatedCheckedOff
                        });
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
                        if (tabsToClose.length > 0) {
                            await vscode.window.tabGroups.close(tabsToClose);
                            closedCount = tabsToClose.length;
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
                        if (tabsToClose.length > 0) {
                            await vscode.window.tabGroups.close(tabsToClose);
                            closedCount = tabsToClose.length;
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
