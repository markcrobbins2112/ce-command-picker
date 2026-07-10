// START OF FILE: src/extension-macros-form.js
const vscode = require('vscode');
const core = require('./extension-core');
const validator = require('./extension-macros-validator');
const ui = require('./extension-ui');

async function promptAssignKey(commandItem, originalArgs, isEditMode) {
    const fullBindings = core.loadFullKeybindingsArray();
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
            if (!choice) { ui.renderPrimaryMenu(originalArgs); return; }
            targetToEdit = choice.raw;
        }
    }

    let initialBaseKey = '';
    let initialShorthand = '';
    if (targetToEdit) {
        initialShorthand = core.formatToCustomShorthand(targetToEdit.key);
        initialBaseKey = initialShorthand.split('.')[0] || '';
    }

    const baseKeyInput = await vscode.window.showInputBox({
        title: isEditMode ? `Step 1: Edit Character Base Key` : `Step 1: Assign Character Base Key`,
        placeHolder: "Type a single letter, number, or special label (e.g., X, F5, DOWN, ENTER)",
        value: initialBaseKey,
        validateInput: text => {
            if (!text.trim()) return 'Base key is required.';
            if (text.includes('+') || text.includes('.')) return 'Type only the main key here. No modifier prefixes or periods.';
            return null;
        }
    });

    if (!baseKeyInput) { ui.renderPrimaryMenu(originalArgs); return; }
    const validatedBase = baseKeyInput.trim().toUpperCase();

    const formQuickPick = vscode.window.createQuickPick();
    formQuickPick.title = `Step 2: Sync Modifiers & Shortcode for "${validatedBase}"`;
    formQuickPick.placeholder = "Type/Edit shortcode notation directly here...";
    formQuickPick.canSelectMany = true;

    const winItem   = { label: '$(device-desktop) Super / Windows Key Modifier', description: 'w', flag: 'w' };
    const ctrlItem  = { label: '$(terminal) Control / Command Key Modifier',   description: 'c', flag: 'c' };
    const altItem   = { label: '$(gear) Alt / Option Key Modifier',         description: 'a', flag: 'a' };
    const shiftItem = { label: '$(arrow-up) Shift Key Modifier',              description: 's', flag: 's' };

    formQuickPick.items = [winItem, ctrlItem, altItem, shiftItem];

    let activeFlags = '';
    if (targetToEdit && initialShorthand.includes('.')) {
        activeFlags = initialShorthand.split('.')[1] || '';
    }

    const syncUIFromFlags = (flagsStr) => {
        const selected = [];
        if (flagsStr.includes('w')) selected.push(winItem);
        if (flagsStr.includes('c')) selected.push(ctrlItem);
        if (flagsStr.includes('a')) selected.push(altItem);
        if (flagsStr.includes('s')) selected.push(shiftItem);
        
        isSynchronizing = true;
        formQuickPick.selectedItems = selected;
        isSynchronizing = false;
    };

    formQuickPick.value = activeFlags ? `${validatedBase}.${activeFlags}` : validatedBase;
    syncUIFromFlags(activeFlags);

    let isSynchronizing = false;
    let finalComputedNative = '';

    formQuickPick.onDidChangeValue(value => {
        if (isSynchronizing) return;
        const currentText = value.trim();

        if (!currentText) {
            formQuickPick.selectedItems = [];
            finalComputedNative = '';
            return;
        }

        const verification = validator.validateAndParseInput(currentText);
        if (!verification.isValid) {
            formQuickPick.title = `⚠️ Syntax Error: ${verification.errorReason}`;
            finalComputedNative = '';
            return;
        }

        finalComputedNative = verification.nativeKey;

        if (currentText.includes('.')) {
            const flagsPart = currentText.split('.')[1] || '';
            syncUIFromFlags(flagsPart);
        } else {
            isSynchronizing = true;
            formQuickPick.selectedItems = [];
            isSynchronizing = false;
        }

        const collisions = fullBindings.filter(b => b.key.toLowerCase() === finalComputedNative.toLowerCase() && b.command !== commandItem.commandId);
        if (collisions.length > 0) {
            formQuickPick.title = `⚠️ Collision! Maps to: ${collisions.map(c => c.command).join(', ')}`;
        } else {
            formQuickPick.title = `✓ Valid Native Translation: "${finalComputedNative}"`;
        }
    });

    formQuickPick.onDidChangeSelection(selectedItems => {
        if (isSynchronizing) return;

        let freshFlags = '';
        if (selectedItems.includes(winItem))   freshFlags += 'w';
        if (selectedItems.includes(ctrlItem))  freshFlags += 'c';
        if (selectedItems.includes(altItem))   freshFlags += 'a';
        if (selectedItems.includes(shiftItem)) freshFlags += 's';

        const updatedShorthandText = freshFlags ? `${validatedBase}.${freshFlags}` : validatedBase;

        isSynchronizing = true;
        formQuickPick.value = updatedShorthandText;
        isSynchronizing = false;

        const verification = validator.validateAndParseInput(updatedShorthandText);
        if (verification.isValid) {
            finalComputedNative = verification.nativeKey;
            const collisions = fullBindings.filter(b => b.key.toLowerCase() === finalComputedNative.toLowerCase() && b.command !== commandItem.commandId);
            if (collisions.length > 0) {
                formQuickPick.title = `⚠️ Collision! Maps to: ${collisions.map(c => c.command).join(', ')}`;
            } else {
                formQuickPick.title = `✓ Valid Native Translation: "${finalComputedNative}"`;
            }
        }
    });

    formQuickPick.onDidAccept(async () => {
        if (!finalComputedNative) {
            const currentText = formQuickPick.value.trim();
            const verification = validator.validateAndParseInput(currentText);
            if (verification.isValid) {
                finalComputedNative = verification.nativeKey;
            } else {
                vscode.window.showErrorMessage('Form validation failed: Please specify a clean key structure.');
                return;
            }
        }

        formQuickPick.hide();

        const finalWhen = await vscode.window.showInputBox({
            title: `Context Clause Parameter: ${commandItem.label}`,
            placeHolder: "Enter 'when' clause condition (e.g. editorTextFocus)",
            value: targetToEdit ? (targetToEdit.when || '') : 'editorTextFocus'
        });

        let currentBindings = core.loadFullKeybindingsArray();

        if (isEditMode && targetToEdit) {
            currentBindings = currentBindings.map(b => {
                if (b.key === targetToEdit.key && b.command === targetToEdit.command && b.when === targetToEdit.when) {
                    const freshObj = { key: finalComputedNative, command: commandItem.commandId };
                    if (finalWhen) freshObj.when = finalWhen;
                    return freshObj;
                }
                return b;
            });
        } else {
            const freshMapping = { key: finalComputedNative, command: commandItem.commandId };
            if (finalWhen) freshMapping.when = finalWhen;
            currentBindings.push(freshMapping);
        }

        if (core.saveKeybindingsArray(currentBindings)) {
            vscode.window.showInformationMessage('Successfully mapped key updates matching synchronized values.');
        }
        
        formQuickPick.dispose();
        ui.renderPrimaryMenu(originalArgs);
    });

    formQuickPick.onDidHide(() => formQuickPick.dispose());
    formQuickPick.show();
}

module.exports = { promptAssignKey };
// END OF FILE: src/extension-macros-form.js
