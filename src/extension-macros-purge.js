// START OF FILE: src/extension-macros-purge.js
const vscode = require('vscode');
const core = require('./extension-core');
const ui = require('./extension-ui');

async function promptRemoveKey(commandItem, originalArgs) {
    const fullBindings = core.loadFullKeybindingsArray();
    const targetedMatches = fullBindings.filter(b => b.command === commandItem.commandId);

    if (targetedMatches.length === 0) {
        vscode.window.showWarningMessage('No active configuration maps registered to purge.');
        ui.renderPrimaryMenu(originalArgs);
        return;
    }

    const multiPick = vscode.window.createQuickPick();
    multiPick.canSelectMany = true;
    multiPick.title = `Purge Registries: ${commandItem.label}`;
    multiPick.placeholder = 'Check items to remove from user files, then click Enter...';
    
    multiPick.items = targetedMatches.map(m => ({
        label: m.key,
        detail: m.when || 'No target runtime when context constraint rules',
        rawObj: m
    }));

    multiPick.onDidAccept(() => {
        const toDelete = multiPick.selectedItems;
        if (!toDelete || toDelete.length === 0) { multiPick.hide(); ui.renderPrimaryMenu(originalArgs); return; }

        let bindingsWorkspace = core.loadFullKeybindingsArray();
        bindingsWorkspace = bindingsWorkspace.filter(b => 
            !toDelete.some(del => del.rawObj.key === b.key && del.rawObj.command === b.command && del.rawObj.when === b.when)
        );

        multiPick.hide();
        multiPick.dispose();

        if (core.saveKeybindingsArray(bindingsWorkspace)) {
            vscode.window.showInformationMessage(`Purged ${toDelete.length} active key targets successfully.`);
        }
        ui.renderPrimaryMenu(originalArgs);
    });

    multiPick.onDidHide(() => multiPick.dispose());
    multiPick.show();
}

module.exports = { promptRemoveKey };
// END OF FILE: src/extension-macros-purge.js
