// START OF FILE: src/extension-navigation.js
const vscode = require('vscode');
const fs = require('fs');
const jsonc = require('jsonc-parser');
const core = require('./extension-core');
const ui = require('./extension-ui');

async function navigateToBindingJson(commandItem, originalArgs) {
    const configPath = core.getKeybindingsFilePath();
    if (!fs.existsSync(configPath)) {
        vscode.window.showWarningMessage('keybindings.json file does not exist.');
        ui.renderPrimaryMenu(originalArgs);
        return;
    }

    try {
        const fileContent = fs.readFileSync(configPath, 'utf8');
        const rootNode = jsonc.parseTree(fileContent);
        
        if (!rootNode || !rootNode.children) {
            vscode.window.showWarningMessage('Could not parse valid JSON structural nodes.');
            ui.renderPrimaryMenu(originalArgs);
            return;
        }

        const validMatches = [];

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

                if (currentCmd === commandItem.commandId && !currentCmd.startsWith('-')) {
                    validMatches.push({
                        key: currentKey,
                        when: currentWhen || 'No context clause rules',
                        offset: commandNode ? commandNode.offset : itemNode.offset
                    });
                }
            }
        });

        if (validMatches.length === 0) {
            vscode.window.showWarningMessage('No matching JSON file objects found for this command ID.');
            ui.renderPrimaryMenu(originalArgs);
            return;
        }

        let selectedTarget = null;
        if (validMatches.length === 1) {
            selectedTarget = validMatches[0];
        } else {
            const choice = await vscode.window.showQuickPick(
                validMatches.map(m => ({
                    label: m.key,
                    detail: m.when,
                    rawMatch: m
                })),
                { placeHolder: 'Multiple matches found. Select target JSON node to find and view:' }
            );

            if (!choice) { ui.renderPrimaryMenu(originalArgs); return; }
            selectedTarget = choice.rawMatch;
        }

        const textDoc = await vscode.workspace.openTextDocument(configPath);
        const editor = await vscode.window.showTextDocument(textDoc);

        const targetPos = textDoc.positionAt(selectedTarget.offset);
        const nextSelection = new vscode.Selection(targetPos, targetPos);
        
        editor.selection = nextSelection;
        editor.revealRange(new vscode.Range(targetPos, targetPos), vscode.TextEditorRevealType.InCenter);

    } catch (error) {
        vscode.window.showErrorMessage(`Failed to perform deep-link cursor alignment: ${error.message}`);
        ui.renderPrimaryMenu(originalArgs);
    }
}

module.exports = { navigateToBindingJson };
// END OF FILE: src/extension-navigation.js
