// START OF FILE: src/extension-ui.js
const vscode = require('vscode');
const core = require('./extension-core');
const formMacro = require('./extension-macros-form');
const purgeMacro = require('./extension-macros-purge');
const navMacro = require('./extension-navigation');

function activate(context) {
    let disposable = vscode.commands.registerCommand('ce-command-picker.show', async function (args) {
        if (!args || !Array.isArray(args)) {
            vscode.window.showWarningMessage('CE Command Picker requires an array argument of command IDs.');
            return;
        }
        renderPrimaryMenu(args);
    });
    context.subscriptions.push(disposable);
}

function renderPrimaryMenu(targetCommandIds) {
    const fullBindings = core.loadFullKeybindingsArray();
    const quickPick = vscode.window.createQuickPick();
    const pickerItems = [];
    
    pickerItems.push({
        label: core.getEditMode() ? '$(close) Exit Edit Mode' : '$(edit) Edit Mode Toggle',
        detail: core.getEditMode() ? 'Currently active. Click to swap to standard execution mode.' : 'Click to enable deep editing macro configurations.',
        isControlItem: true
    });

    targetCommandIds.forEach(cmdId => {
        let humanLabel = cmdId.replace(/^[\w-]+\./, '').replace(/([A-Z])/g, ' $1').replace(/[_-]/g, ' '); 
        humanLabel = humanLabel.charAt(0).toUpperCase() + humanLabel.slice(1);
        
        const matches = fullBindings.filter(b => b.command === cmdId && !b.command.startsWith('-'));
        const shorthand = matches.length > 0 ? matches.map(m => core.formatToCustomShorthand(m.key)).join(', ') : 'unassigned';

        pickerItems.push({
            label: humanLabel,
            detail: shorthand,
            commandId: cmdId
        });
    });

    quickPick.items = pickerItems;
    quickPick.placeholder = core.getEditMode() ? '[EDIT MODE IS ACTIVE] Select target to change configurations...' : 'Select a command to execute...';
    quickPick.title = core.getEditMode() ? 'CE Command Picker (Editing Framework)' : 'CE Command Picker';

    quickPick.onDidChangeActive((activeItems) => {
        if (activeItems && activeItems.length > 0 && !activeItems[0].isControlItem) {
            quickPick.title = activeItems[0].commandId;
        } else {
            quickPick.title = core.getEditMode() ? 'CE Command Picker (Editing Framework)' : 'CE Command Picker';
        }
    });

    quickPick.onDidAccept(() => {
        const selectedItems = quickPick.selectedItems;
        if (!selectedItems || selectedItems.length === 0) return;

        const selection = selectedItems[0];
        
        if (selection.isControlItem) {
            core.setEditMode(!core.getEditMode());
            quickPick.hide();
            quickPick.dispose();
            renderPrimaryMenu(targetCommandIds);
            return;
        }

        quickPick.hide();
        quickPick.dispose();

        if (core.getEditMode()) {
            showSecondaryActionMenu(selection, targetCommandIds);
        } else {
            vscode.commands.executeCommand(selection.commandId);
        }
    });

    quickPick.onDidHide(() => quickPick.dispose());
    quickPick.show();
}

function showSecondaryActionMenu(commandItem, originalArgs) {
    const secondaryQuickPick = vscode.window.createQuickPick();
    
    secondaryQuickPick.items = [
        { label: '$(arrow-left) Back', detail: 'Exit edit profile and return to main picker list', actionKey: 'BACK' },
        { label: 'Execute',            detail: `Run command: ${commandItem.commandId}`, actionKey: 'EXECUTE' },
        { label: 'Copy Command',       detail: 'Copy raw command ID string layout', actionKey: 'COPY_CMD' },
        { label: 'Copy Bindings',      detail: 'Copy full system JSON config structures', actionKey: 'COPY_BIND' },
        { label: 'Assign Key',         detail: 'Write a newly structured key map parameter', actionKey: 'ASSIGN_KEY' },
        { label: 'Edit Binding',       detail: 'Modify existing parameters matching this action ID', actionKey: 'EDIT_BINDING' },
        { label: 'Remove Key',         detail: 'Selectively purge structural mappings', actionKey: 'REMOVE_KEY' },
        { label: 'Goto Binding JSON',  detail: 'Locate structural code array within standard settings files', actionKey: 'GOTO_JSON' }
    ];
    
    secondaryQuickPick.title = `Action Plan: ${commandItem.label}`;
    secondaryQuickPick.placeholder = 'Select configuration script profile...';

    secondaryQuickPick.onDidAccept(async () => {
        const selectedActions = secondaryQuickPick.selectedItems;
        if (!selectedActions || selectedActions.length === 0) return;

        const action = selectedActions[0];
        secondaryQuickPick.hide();
        secondaryQuickPick.dispose();

        switch (action.actionKey) {
            case 'BACK':
                renderPrimaryMenu(originalArgs);
                break;
            case 'EXECUTE':
                vscode.commands.executeCommand(commandItem.commandId);
                break;
            case 'COPY_CMD':
                await vscode.env.clipboard.writeText(commandItem.commandId);
                vscode.window.showInformationMessage(`Copied: ${commandItem.commandId}`);
                renderPrimaryMenu(originalArgs);
                break;
            case 'COPY_BIND':
                const matches = core.loadFullKeybindingsArray().filter(b => b.command === commandItem.commandId);
                await vscode.env.clipboard.writeText(JSON.stringify(matches, null, 4));
                vscode.window.showInformationMessage(`Copied ${matches.length} layout block object profiles.`);
                renderPrimaryMenu(originalArgs);
                break;
            case 'ASSIGN_KEY':
                formMacro.promptAssignKey(commandItem, originalArgs, false);
                break;
            case 'EDIT_BINDING':
                formMacro.promptAssignKey(commandItem, originalArgs, true);
                break;
            case 'REMOVE_KEY':
                purgeMacro.promptRemoveKey(commandItem, originalArgs);
                break;
            case 'GOTO_JSON':
                navMacro.navigateToBindingJson(commandItem, originalArgs);
                break;
        }
    });

    secondaryQuickPick.onDidHide(() => secondaryQuickPick.dispose());
    secondaryQuickPick.show();
}

function deactivate() {}

module.exports = { activate, renderPrimaryMenu };
// END OF FILE: src/extension-ui.js
