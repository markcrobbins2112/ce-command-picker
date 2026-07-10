// START OF FILE: src/extension-macros-html.js

/**
 * Returns lightweight HTML DOM structures using embedded script logic variables.
 * Automatically mirrors the theme's colors natively using CSS Workbench properties.
 */
function getWebviewContent(commandId, title, chord1Base, chord1Flags, chord2Base, chord2Flags, whenClause, currentKeys, currentWhen, initialNativeKey) {
    const escapeJS = (str) => {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\r/g, '\\r')
            .replace(/\n/g, '\\n');
    };

    const formatCurrentKeys = (keys) => {
        if (!keys || keys === 'None') {
            return `<div><span style="opacity: 0.7;">Binding:</span> <strong>None</strong></div>`;
        }
        const parts = keys.split('  |  ');
        let html = '';
        for (const part of parts) {
            const lastOpenParen = part.lastIndexOf(' (');
            if (lastOpenParen !== -1 && part.endsWith(')')) {
                const shorthand = part.substring(0, lastOpenParen).trim();
                const nativeKey = part.substring(lastOpenParen + 2, part.length - 1).trim();
                html += `<div><span style="opacity: 0.7;">Binding:</span> <strong>${shorthand}</strong></div>`;
                html += `<div><span style="opacity: 0.7;">Binding:</span> <strong>${nativeKey}</strong></div>`;
            } else {
                html += `<div><span style="opacity: 0.7;">Binding:</span> <strong>${part}</strong></div>`;
            }
        }
        return html;
    };

    // Isolated client browser synchronization controller logic string block
    const webviewJS = `
    const vscode = acquireVsCodeApi();

    const baseInput1 = document.getElementById('baseKey');
    const shortcodeInput1 = document.getElementById('shortcode');
    const checkboxes1 = {
        w: document.getElementById('modW'),
        c: document.getElementById('modC'),
        a: document.getElementById('modA'),
        s: document.getElementById('modS')
    };

    const baseInput2 = document.getElementById('baseKey2');
    const shortcodeInput2 = document.getElementById('shortcode2');
    const checkboxes2 = {
        w: document.getElementById('modW2'),
        c: document.getElementById('modC2'),
        a: document.getElementById('modA2'),
        s: document.getElementById('modS2')
    };

    const whenInput = document.getElementById('whenClause');
    const statusBox = document.getElementById('statusBox');
    
    const btnCancel = document.getElementById('btnCancel');
    const btnClone = document.getElementById('btnClone'); // Now Unbind
    const btnSaveClone = document.getElementById('btnSaveClone'); // Now Add
    const btnSubmit = document.getElementById('btnSubmit'); // Now Save

    const btnClear1 = document.getElementById('btnClear1');
    const btnClear2 = document.getElementById('btnClear2');
    const btnClear = document.getElementById('btnClear');
    const btnEditJson = document.getElementById('btnEditJson');
    const btnReset = document.getElementById('btnReset');
    const btnCopyBinding = document.getElementById('btnCopyBinding');
    const btnPasteBinding = document.getElementById('btnPasteBinding');

    const btnKbUi = document.getElementById('btnKbUi');
    const btnKbUiCmd = document.getElementById('btnKbUiCmd');
    const btnKbUiKey = document.getElementById('btnKbUiKey');
    const btnKbUiUser = document.getElementById('btnKbUiUser');
    const btnKbUiDefault = document.getElementById('btnKbUiDefault');
    const btnKbUiExtension = document.getElementById('btnKbUiExtension');
    const btnKbUiExt = document.getElementById('btnKbUiExt');
    const btnKbUiClear = document.getElementById('btnKbUiClear');

    const currentWhenClauseLabel = document.getElementById('currentWhenClauseLabel');

    let lastValidatedNativeKey = '';
    let isSynchronizing = false;

    function cleanBaseKeyInput(val) {
        if (!val) return '';
        let cleaned = val.toLowerCase()
            .replace(/(ctrl|alt|shift|win|cmd|meta)\\\\+/g, '')
            .replace(/\\\\.[casw]+/g, '')
            .replace(/\\\\+/g, '')
            .trim();
        if (cleaned === 'insert' || cleaned === 'ins') {
            return 'insert';
        }
        return cleaned.toUpperCase();
    }

    function cleanShortcodeInput(val) {
        if (!val) return '';
        let cleaned = val.toLowerCase().replace(/[^wcas]/g, '');
        let res = '';
        if (cleaned.includes('w')) res += 'w';
        if (cleaned.includes('c')) res += 'c';
        if (cleaned.includes('a')) res += 'a';
        if (cleaned.includes('s')) res += 's';
        return res;
    }

    function getFullShorthand() {
        const base1 = baseInput1.value.trim();
        const flags1 = shortcodeInput1.value.trim().toLowerCase();
        const part1 = flags1 ? base1 + '.' + flags1 : base1;

        const base2 = baseInput2.value.trim();
        const flags2 = shortcodeInput2.value.trim().toLowerCase();
        const part2 = base2 ? (flags2 ? base2 + '.' + flags2 : base2) : '';

        if (!base1) return '';
        return part2 ? part1 + ' ' + part2 : part1;
    }

    function formatCurrentKeysJS(keys) {
        if (!keys || keys === 'None') {
            return '<div><span style="opacity: 0.7;">Binding:</span> <strong>None</strong></div>';
        }
        const parts = keys.split('  |  ');
        let html = '';
        for (const part of parts) {
            const lastOpenParen = part.lastIndexOf(' (');
            if (lastOpenParen !== -1 && part.endsWith(')')) {
                const shorthand = part.substring(0, lastOpenParen).trim();
                const nativeKey = part.substring(lastOpenParen + 2, part.length - 1).trim();
                html += '<div><span style="opacity: 0.7;">Binding:</span> <strong>' + shorthand + '</strong></div>';
                html += '<div><span style="opacity: 0.7;">Binding:</span> <strong>' + nativeKey + '</strong></div>';
            } else {
                html += '<div><span style="opacity: 0.7;">Binding:</span> <strong>' + part + '</strong></div>';
            }
        }
        return html;
    }

    function hasBindingChanged() {
        if (!window.CE_INITIAL_STATE) return false;
        const initialB1 = (window.CE_INITIAL_STATE.chord1Base || '').toLowerCase().trim();
        const initialF1 = (window.CE_INITIAL_STATE.chord1Flags || '').toLowerCase().trim();
        const initialB2 = (window.CE_INITIAL_STATE.chord2Base || '').toLowerCase().trim();
        const initialF2 = (window.CE_INITIAL_STATE.chord2Flags || '').toLowerCase().trim();
        const initialWhen = (window.CE_INITIAL_STATE.whenClause || '').trim();

        const currentB1 = baseInput1.value.toLowerCase().trim();
        const currentF1 = shortcodeInput1.value.toLowerCase().trim();
        const currentB2 = baseInput2.value.toLowerCase().trim();
        const currentF2 = shortcodeInput2.value.toLowerCase().trim();
        const currentWhen = whenInput.value.trim();

        return (
            initialB1 !== currentB1 ||
            initialF1 !== currentF1 ||
            initialB2 !== currentB2 ||
            initialF2 !== currentF2 ||
            initialWhen !== currentWhen
        );
    }

    function updateButtonStates(isValid) {
        if (!isValid) {
            btnSubmit.disabled = true;
            btnSaveClone.disabled = true;
            btnClone.disabled = true;
        } else {
            const changed = hasBindingChanged();
            btnSubmit.disabled = !changed;
            btnSaveClone.disabled = !changed;
            btnClone.disabled = false;
        }
    }

    function validateBaseKeys() {
        const knownKeys = [
            'up', 'down', 'left', 'right', 'escape', 'esc', 'enter', 'tab', 'space',
            'backspace', 'delete', 'del', 'insert', 'ins', 'pageup', 'pgup', 'pagedown', 'pgdn',
            'home', 'end', 'capslock', 'caps'
        ];

        const isValidBaseKey = (k) => {
            const lower = k.toLowerCase().trim();
            if (!lower) return false;
            return /^[a-z0-9]$/.test(lower) || /^f\\\\d+$/.test(lower) || knownKeys.includes(lower);
        };

        const val1 = baseInput1.value.trim();
        if (val1 && !isValidBaseKey(val1)) {
            baseInput1.style.borderColor = '#f14c4c';
            baseInput1.style.outline = '1px solid #f14c4c';
            baseInput1.title = 'Syntax Error: Base Key is not recognized. (e.g. A-Z, 0-9, F1-F24, ENTER, LEFT)';
        } else {
            baseInput1.style.borderColor = '';
            baseInput1.style.outline = '';
            baseInput1.title = '';
        }

        const val2 = baseInput2.value.trim();
        if (val2 && !isValidBaseKey(val2)) {
            baseInput2.style.borderColor = '#f14c4c';
            baseInput2.style.outline = '1px solid #f14c4c';
            baseInput2.title = 'Syntax Error: Base Key is not recognized. (e.g. A-Z, 0-9, F1-F24, ENTER, LEFT)';
        } else {
            baseInput2.style.borderColor = '';
            baseInput2.style.outline = '';
            baseInput2.title = '';
        }
    }

    function triggerValidation() {
        validateBaseKeys();
        const textValue = getFullShorthand();
        if (!textValue) {
            statusBox.style.display = 'none';
            btnSubmit.disabled = true;
            btnClone.disabled = true;
            btnSaveClone.disabled = true;
            return;
        }
        vscode.postMessage({ command: 'validate', value: textValue });
    }

    function syncFromUIForm1() {
        if (isSynchronizing) return;
        isSynchronizing = true;

        let val = baseInput1.value.trim();
        let w = false, c = false, a = false, s = false;
        let hasModifiers = false;

        if (val.includes('+')) {
            const elements = val.toLowerCase().split('+');
            const newElements = [];
            elements.forEach(el => {
                const p = el.trim();
                if (p === 'win' || p === 'windows') { w = true; hasModifiers = true; }
                else if (p === 'ctrl' || p === 'control' || p === 'cmd' || p === 'meta') { c = true; hasModifiers = true; }
                else if (p === 'alt') { a = true; hasModifiers = true; }
                else if (p === 'shift') { s = true; hasModifiers = true; }
                else if (p) { newElements.push(p); }
            });
            val = newElements.join('+');
        }

        if (val.includes('.')) {
            const parts = val.toLowerCase().split('.');
            if (parts.length === 2) {
                val = parts[0].trim();
                const flags = parts[1].trim();
                if (flags.includes('w')) { w = true; hasModifiers = true; }
                if (flags.includes('c')) { c = true; hasModifiers = true; }
                if (flags.includes('a')) { a = true; hasModifiers = true; }
                if (flags.includes('s')) { s = true; hasModifiers = true; }
            }
        }

        if (hasModifiers) {
            checkboxes1.w.checked = w;
            checkboxes1.c.checked = c;
            checkboxes1.a.checked = a;
            checkboxes1.s.checked = s;
        }

        baseInput1.value = cleanBaseKeyInput(val);
        let f = '';
        if (checkboxes1.w.checked) f += 'w';
        if (checkboxes1.c.checked) f += 'c';
        if (checkboxes1.a.checked) f += 'a';
        if (checkboxes1.s.checked) f += 's';
        shortcodeInput1.value = f;

        isSynchronizing = false;
        triggerValidation();
    }

    function syncFromShortcode1() {
        if (isSynchronizing) return;
        isSynchronizing = true;

        shortcodeInput1.value = cleanShortcodeInput(shortcodeInput1.value);
        checkboxes1.w.checked = shortcodeInput1.value.includes('w');
        checkboxes1.c.checked = shortcodeInput1.value.includes('c');
        checkboxes1.a.checked = shortcodeInput1.value.includes('a');
        checkboxes1.s.checked = shortcodeInput1.value.includes('s');

        isSynchronizing = false;
        triggerValidation();
    }

    function syncFromUIForm2() {
        if (isSynchronizing) return;
        isSynchronizing = true;

        let val = baseInput2.value.trim();
        let w = false, c = false, a = false, s = false;
        let hasModifiers = false;

        if (val.includes('+')) {
            const elements = val.toLowerCase().split('+');
            const newElements = [];
            elements.forEach(el => {
                const p = el.trim();
                if (p === 'win' || p === 'windows') { w = true; hasModifiers = true; }
                else if (p === 'ctrl' || p === 'control' || p === 'cmd' || p === 'meta') { c = true; hasModifiers = true; }
                else if (p === 'alt') { a = true; hasModifiers = true; }
                else if (p === 'shift') { s = true; hasModifiers = true; }
                else if (p) { newElements.push(p); }
            });
            val = newElements.join('+');
        }

        if (val.includes('.')) {
            const parts = val.toLowerCase().split('.');
            if (parts.length === 2) {
                val = parts[0].trim();
                const flags = parts[1].trim();
                if (flags.includes('w')) { w = true; hasModifiers = true; }
                if (flags.includes('c')) { c = true; hasModifiers = true; }
                if (flags.includes('a')) { a = true; hasModifiers = true; }
                if (flags.includes('s')) { s = true; hasModifiers = true; }
            }
        }

        if (hasModifiers) {
            checkboxes2.w.checked = w;
            checkboxes2.c.checked = c;
            checkboxes2.a.checked = a;
            checkboxes2.s.checked = s;
        }

        baseInput2.value = cleanBaseKeyInput(val);
        let f = '';
        if (checkboxes2.w.checked) f += 'w';
        if (checkboxes2.c.checked) f += 'c';
        if (checkboxes2.a.checked) f += 'a';
        if (checkboxes2.s.checked) f += 's';
        shortcodeInput2.value = f;

        isSynchronizing = false;
        triggerValidation();
    }

    function syncFromShortcode2() {
        if (isSynchronizing) return;
        isSynchronizing = true;

        shortcodeInput2.value = cleanShortcodeInput(shortcodeInput2.value);
        checkboxes2.w.checked = shortcodeInput2.value.includes('w');
        checkboxes2.c.checked = shortcodeInput2.value.includes('c');
        checkboxes2.a.checked = shortcodeInput2.value.includes('a');
        checkboxes2.s.checked = shortcodeInput2.value.includes('s');

        isSynchronizing = false;
        triggerValidation();
    }

    baseInput1.addEventListener('input', syncFromUIForm1);
    Object.values(checkboxes1).forEach(cb => {
        cb.addEventListener('change', syncFromUIForm1);
        cb.addEventListener('click', syncFromUIForm1);
    });
    shortcodeInput1.addEventListener('input', syncFromShortcode1);
    shortcodeInput1.addEventListener('change', syncFromShortcode1);
    shortcodeInput1.addEventListener('keyup', syncFromShortcode1);

    baseInput2.addEventListener('input', syncFromUIForm2);
    Object.values(checkboxes2).forEach(cb => {
        cb.addEventListener('change', syncFromUIForm2);
        cb.addEventListener('click', syncFromUIForm2);
    });
    shortcodeInput2.addEventListener('input', syncFromShortcode2);
    shortcodeInput2.addEventListener('change', syncFromShortcode2);
    shortcodeInput2.addEventListener('keyup', syncFromShortcode2);

    if (btnClear1) {
        btnClear1.addEventListener('click', () => {
            isSynchronizing = true;
            baseInput1.value = '';
            checkboxes1.w.checked = false;
            checkboxes1.c.checked = false;
            checkboxes1.a.checked = false;
            checkboxes1.s.checked = false;
            shortcodeInput1.value = '';
            isSynchronizing = false;
            triggerValidation();
        });
    }

    if (btnClear2) {
        btnClear2.addEventListener('click', () => {
            isSynchronizing = true;
            baseInput2.value = '';
            checkboxes2.w.checked = false;
            checkboxes2.c.checked = false;
            checkboxes2.a.checked = false;
            checkboxes2.s.checked = false;
            shortcodeInput2.value = '';
            isSynchronizing = false;
            triggerValidation();
        });
    }

    if (btnClear) {
        btnClear.addEventListener('click', () => {
            isSynchronizing = true;
            baseInput1.value = '';
            checkboxes1.w.checked = false;
            checkboxes1.c.checked = false;
            checkboxes1.a.checked = false;
            checkboxes1.s.checked = false;
            shortcodeInput1.value = '';

            baseInput2.value = '';
            checkboxes2.w.checked = false;
            checkboxes2.c.checked = false;
            checkboxes2.a.checked = false;
            checkboxes2.s.checked = false;
            shortcodeInput2.value = '';

            whenInput.value = '';
            lastValidatedNativeKey = '';
            statusBox.style.display = 'none';
            statusBox.textContent = '';
            isSynchronizing = false;
            triggerValidation();
        });
    }

    window.addEventListener('message', event => {
        const message = event.data;
        if (message.type === 'init') {
            isSynchronizing = true;
            let b1 = '';
            let f1 = '';
            let b2 = '';
            let f2 = '';
            const shorthandStr = message.shorthand || '';
            const baseKeyStr = message.baseKey || '';
            const flagsStr = message.flags || '';
            const baseKey2Str = message.baseKey2 || '';
            const flags2Str = message.flags2 || '';

            if (shorthandStr) {
                const chords = shorthandStr.trim().split(/\\\\s+/);
                if (chords.length >= 1 && chords[0]) {
                    const match = chords[0].match(/(.*)\\\\.([wcas]*)$/);
                    if (match) {
                        b1 = match[1];
                        f1 = match[2];
                    } else {
                        b1 = chords[0];
                        f1 = '';
                    }
                }
                if (chords.length >= 2 && chords[1]) {
                    const match = chords[1].match(/(.*)\\\\.([wcas]*)$/);
                    if (match) {
                        b2 = match[1];
                        f2 = match[2];
                    } else {
                        b2 = chords[1];
                        f2 = '';
                    }
                }
            }
            if (!b1 && baseKeyStr) {
                b1 = baseKeyStr;
            }
            if (!f1 && flagsStr) {
                f1 = flagsStr;
            }
            if (!b2 && baseKey2Str) {
                b2 = baseKey2Str;
            }
            if (!f2 && flags2Str) {
                f2 = flags2Str;
            }

            if (b1.toLowerCase() === 'insert' || b1.toLowerCase() === 'ins') {
                baseInput1.value = 'insert';
            } else {
                baseInput1.value = b1.toUpperCase();
            }
            shortcodeInput1.value = f1.toLowerCase();
            checkboxes1.w.checked = f1.includes('w');
            checkboxes1.c.checked = f1.includes('c');
            checkboxes1.a.checked = f1.includes('a');
            checkboxes1.s.checked = f1.includes('s');

            if (b2.toLowerCase() === 'insert' || b2.toLowerCase() === 'ins') {
                baseInput2.value = 'insert';
            } else {
                baseInput2.value = b2.toUpperCase();
            }
            shortcodeInput2.value = f2.toLowerCase();
            checkboxes2.w.checked = f2.includes('w');
            checkboxes2.c.checked = f2.includes('c');
            checkboxes2.a.checked = f2.includes('a');
            checkboxes2.s.checked = f2.includes('s');

            const incomingWhen = message.whenClause !== undefined ? message.whenClause : (message.when !== undefined ? message.when : undefined);
            whenInput.value = incomingWhen !== undefined ? incomingWhen : 'editorTextFocus';

            isSynchronizing = false;
            triggerValidation();
        } else if (message.type === 'status') {
            statusBox.textContent = message.text;
            statusBox.style.display = 'block';
            statusBox.style.padding = '8px 12px';
            statusBox.style.borderRadius = '4px';
            
            if (message.status === 'error') {
                statusBox.style.background = 'rgba(241, 76, 76, 0.15)';
                statusBox.style.color = '#f14c4c';
                lastValidatedNativeKey = '';
                updateButtonStates(false);
            } else {
                statusBox.style.background = 'rgba(137, 209, 137, 0.15)';
                statusBox.style.color = '#88d188';
                lastValidatedNativeKey = message.nativeKey || '';
                updateButtonStates(true);
            }
        } else if (message.type === 'updateLabels') {
            const container = document.getElementById('currentKeysContainer');
            if (container) {
                container.innerHTML = formatCurrentKeysJS(message.currentKeys || 'None');
            }
            if (currentWhenClauseLabel) currentWhenClauseLabel.textContent = message.currentWhen;
        } else if (message.type === 'pasteBindingData') {
            isSynchronizing = true;
            baseInput1.value = message.chord1Base || '';
            shortcodeInput1.value = message.chord1Flags || '';
            checkboxes1.w.checked = shortcodeInput1.value.includes('w');
            checkboxes1.c.checked = shortcodeInput1.value.includes('c');
            checkboxes1.a.checked = shortcodeInput1.value.includes('a');
            checkboxes1.s.checked = shortcodeInput1.value.includes('s');

            baseInput2.value = message.chord2Base || '';
            shortcodeInput2.value = message.chord2Flags || '';
            checkboxes2.w.checked = shortcodeInput2.value.includes('w');
            checkboxes2.c.checked = shortcodeInput2.value.includes('c');
            checkboxes2.a.checked = shortcodeInput2.value.includes('a');
            checkboxes2.s.checked = shortcodeInput2.value.includes('s');

            whenInput.value = message.when || '';
            isSynchronizing = false;
            triggerValidation();
        }
    });

    // Handle form change/keyup events to check if changed or valid
    const formInputs = [baseInput1, baseInput2, shortcodeInput1, shortcodeInput2, whenInput];
    formInputs.forEach(inp => {
        inp.addEventListener('input', () => {
            const textValue = getFullShorthand();
            updateButtonStates(!!textValue);
        });
        inp.addEventListener('keyup', () => {
            const textValue = getFullShorthand();
            updateButtonStates(!!textValue);
        });
    });

    btnSubmit.addEventListener('click', () => {
        if (!lastValidatedNativeKey) return;
        vscode.postMessage({
            command: 'submit',
            actionType: 'save',
            nativeKey: lastValidatedNativeKey,
            when: whenInput.value
        });
    });

    btnClone.addEventListener('click', () => {
        // Change Clone Button to Unbind
        vscode.postMessage({
            command: 'unbind',
            nativeKey: lastValidatedNativeKey,
            when: whenInput.value
        });
    });

    btnSaveClone.addEventListener('click', () => {
        if (!lastValidatedNativeKey) return;
        vscode.postMessage({
            command: 'submit',
            actionType: 'saveAndClone',
            nativeKey: lastValidatedNativeKey,
            when: whenInput.value
        });
    });

    btnCancel.addEventListener('click', () => {
        vscode.postMessage({ command: 'cancel' });
    });

    btnEditJson.addEventListener('click', () => {
        vscode.postMessage({
            command: 'editJson',
            nativeKey: lastValidatedNativeKey,
            when: whenInput.value
        });
    });

    btnCopyBinding.addEventListener('click', () => {
        const textValue = getFullShorthand();
        if (!textValue) return;
        vscode.postMessage({
            command: 'copyBinding',
            value: JSON.stringify({
                key: lastValidatedNativeKey || '',
                command: window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '',
                when: whenInput.value
            }, null, 4)
        });
    });

    btnPasteBinding.addEventListener('click', () => {
        vscode.postMessage({ command: 'pasteBinding' });
    });

    function resetToInitial() {
        if (!window.CE_INITIAL_STATE) return;
        isSynchronizing = true;

        let b1 = window.CE_INITIAL_STATE.chord1Base || '';
        if (b1.toLowerCase() === 'insert' || b1.toLowerCase() === 'ins') {
            baseInput1.value = 'insert';
        } else {
            baseInput1.value = b1.toUpperCase();
        }
        shortcodeInput1.value = window.CE_INITIAL_STATE.chord1Flags || '';
        checkboxes1.w.checked = shortcodeInput1.value.includes('w');
        checkboxes1.c.checked = shortcodeInput1.value.includes('c');
        checkboxes1.a.checked = shortcodeInput1.value.includes('a');
        checkboxes1.s.checked = shortcodeInput1.value.includes('s');

        let b2 = window.CE_INITIAL_STATE.chord2Base || '';
        if (b2.toLowerCase() === 'insert' || b2.toLowerCase() === 'ins') {
            baseInput2.value = 'insert';
        } else {
            baseInput2.value = b2.toUpperCase();
        }
        shortcodeInput2.value = window.CE_INITIAL_STATE.chord2Flags || '';
        checkboxes2.w.checked = shortcodeInput2.value.includes('w');
        checkboxes2.c.checked = shortcodeInput2.value.includes('c');
        checkboxes2.a.checked = shortcodeInput2.value.includes('a');
        checkboxes2.s.checked = shortcodeInput2.value.includes('s');

        whenInput.value = window.CE_INITIAL_STATE.whenClause !== undefined ? window.CE_INITIAL_STATE.whenClause : '';
        isSynchronizing = false;
        triggerValidation();
    }

    if (btnReset) {
        btnReset.addEventListener('click', resetToInitial);
    }

    // Connect Keyboard Shortcuts Helper Buttons
    if (btnKbUi) {
        btnKbUi.addEventListener('click', () => {
            vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings' });
        });
    }
    if (btnKbUiCmd) {
        btnKbUiCmd.addEventListener('click', () => {
            vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: ['todo-tree.filter'] });
        });
    }
    if (btnKbUiKey) {
        btnKbUiKey.addEventListener('click', () => {
            vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: ['@key:"alt+. f1"'] });
        });
    }
    if (btnKbUiUser) {
        btnKbUiUser.addEventListener('click', () => {
            vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: ['@source:user'] });
        });
    }
    if (btnKbUiDefault) {
        btnKbUiDefault.addEventListener('click', () => {
            vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: ['@source:default'] });
        });
    }
    if (btnKbUiExtension) {
        btnKbUiExtension.addEventListener('click', () => {
            vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: ['@source:extension'] });
        });
    }
    if (btnKbUiExt) {
        btnKbUiExt.addEventListener('click', () => {
            vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: ['@ext:gruntfuggly.todo-tree'] });
        });
    }
    if (btnKbUiClear) {
        btnKbUiClear.addEventListener('click', () => {
            vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: ['todo-tree clear'] });
        });
    }

    if (window.CE_INITIAL_STATE) {
        resetToInitial();
        const container = document.getElementById('currentKeysContainer');
        if (container) {
            container.innerHTML = formatCurrentKeysJS(window.CE_INITIAL_STATE.currentKeys || 'None');
        }
        if (currentWhenClauseLabel) currentWhenClauseLabel.textContent = window.CE_INITIAL_STATE.currentWhen || 'No context';
    }
    `;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CE Form Dialog</title>
    <style>
        body { font-family: var(--vscode-font-family); font-size: var(--vscode-font-size); padding: 20px; display: flex; flex-direction: column; gap: 16px; background-color: var(--vscode-editor-background); color: var(--vscode-editor-foreground); }
        .current-info-container {
            background: rgba(255, 255, 255, 0.03);
            border-left: 4px solid var(--vscode-focusBorder);
            padding: 12px 16px;
            border-radius: 4px;
            margin-bottom: 8px;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        .chords-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        @media (max-width: 600px) {
            .chords-grid {
                grid-template-columns: 1fr;
            }
        }
        .chord-panel {
            background: rgba(255, 255, 255, 0.015);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 6px;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .chord-header {
            font-size: 1.1em;
            font-weight: bold;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            padding-bottom: 8px;
            margin-bottom: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        input[type="text"] { background: var(--vscode-input-background); color: var(--vscode-input-foreground); border: 1px solid var(--vscode-input-border); padding: 6px 10px; border-radius: 4px; font-family: inherit; }
        input[type="text"]:focus { outline: 1px solid var(--vscode-focusBorder); }
        .checkbox-group { display: flex; gap: 12px; padding: 4px 0; flex-wrap: wrap; }
        .checkbox-item { display: flex; align-items: center; gap: 6px; cursor: pointer; }
        .checkbox-item input { cursor: pointer; }
        .actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 16px; flex-wrap: wrap; }
        button { background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 500; font-family: inherit; }
        button:hover { background: var(--vscode-button-hoverBackground); }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
        button.secondary { background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground); }
        button.secondary:hover { background-color: var(--vscode-button-secondaryHoverBackground); }
        button.small { padding: 4px 8px; font-size: 0.85em; }
        #statusBox {
            padding: 10px 14px;
            border-radius: 4px;
            font-size: 0.95em;
            margin: 8px 0;
            line-height: 1.4;
        }
    </style>
</head>
<body>
    <div class="current-info-container">
        <div style="font-weight: bold; font-size: 1.1em; margin-bottom: 2px;">Action: ` + (title || '') + `</div>
        <div id="currentKeysContainer">` + formatCurrentKeys(currentKeys) + `</div>
        <div><span style="opacity: 0.7;">Current When:</span> <strong id="currentWhenClauseLabel">` + (currentWhen || 'No context') + `</strong></div>
    </div>
    
    <div class="chords-grid">
        <!-- Chord 1 Panel -->
        <div class="chord-panel">
            <div class="chord-header">
                <span>Key 1 (Main Chord)</span>
                <button type="button" class="secondary small" id="btnClear1" title="Clear the Base Key, modifier checkboxes, and shortcode box for the primary chord.">Clear</button>
            </div>
            
            <div class="form-group">
                <label for="baseKey" style="font-weight: 500;">Base Key</label>
                <input type="text" id="baseKey" placeholder="e.g., K, F11, ENTER, LEFT">
            </div>

            <div class="form-group">
                <label style="font-weight: 500;">Modifiers</label>
                <div class="checkbox-group">
                    <label class="checkbox-item"><input type="checkbox" id="modW" value="w"> Windows</label>
                    <label class="checkbox-item"><input type="checkbox" id="modC" value="c"> Control</label>
                    <label class="checkbox-item"><input type="checkbox" id="modA" value="a"> Alt</label>
                    <label class="checkbox-item"><input type="checkbox" id="modS" value="s"> Shift</label>
                </div>
            </div>

            <div class="form-group">
                <label for="shortcode" style="font-weight: 500;">Modifier Shortcode Box (wcas)</label>
                <input type="text" id="shortcode" placeholder="e.g., ca, s, wcas">
            </div>
        </div>

        <!-- Chord 2 Panel -->
        <div class="chord-panel">
            <div class="chord-header">
                <span>Key 2 (Optional Second Chord)</span>
                <button type="button" class="secondary small" id="btnClear2" title="Clear the Base Key, modifier checkboxes, and shortcode box for the secondary optional chord.">Clear</button>
            </div>
            
            <div class="form-group">
                <label for="baseKey2" style="font-weight: 500;">Base Key</label>
                <input type="text" id="baseKey2" placeholder="e.g., W, ESC, DOWN">
            </div>

            <div class="form-group">
                <label style="font-weight: 500;">Modifiers</label>
                <div class="checkbox-group">
                    <label class="checkbox-item"><input type="checkbox" id="modW2" value="w"> Windows</label>
                    <label class="checkbox-item"><input type="checkbox" id="modC2" value="c"> Control</label>
                    <label class="checkbox-item"><input type="checkbox" id="modA2" value="a"> Alt</label>
                    <label class="checkbox-item"><input type="checkbox" id="modS2" value="s"> Shift</label>
                </div>
            </div>

            <div class="form-group">
                <label for="shortcode2" style="font-weight: 500;">Modifier Shortcode Box (wcas)</label>
                <input type="text" id="shortcode2" placeholder="e.g., ca, s, wcas">
            </div>
        </div>
    </div>

    <div class="form-group" style="margin-top: 8px;">
        <label for="whenClause" style="font-weight: 500;">Context Clause Constraint (When)</label>
        <input type="text" id="whenClause" placeholder="e.g., editorTextFocus">
    </div>

    <div id="statusBox" style="display: none;"></div>

    <div class="actions">
        <button class="secondary small" id="btnEditJson" title="Open keybindings.json file to manually view or edit raw JSON records.">Edit Json</button>
        <button class="secondary small" id="btnKbUi" title="Open the native VS Code Keybindings Keyboard Shortcuts configuration panel.">KB UI</button>
        <button class="secondary small" id="btnKbUiCmd" title="Search and filter the VS Code Keyboard Shortcuts panel specifically for the 'todo-tree.filter' command.">KB UI Cmd</button>
        <button class="secondary small" id="btnKbUiKey" title="Search the VS Code Keyboard Shortcuts panel specifically for the 'alt+. f1' key combination.">KB UI Key</button>
        <button class="secondary small" id="btnKbUiUser" title="Filter the Keyboard Shortcuts panel to show only custom user-configured keybindings.">KB UI User</button>
        <button class="secondary small" id="btnKbUiDefault" title="Filter the Keyboard Shortcuts panel to show only built-in default VS Code system keybindings.">KB UI Default</button>
        <button class="secondary small" id="btnKbUiExtension" title="Filter the Keyboard Shortcuts panel to show only keybindings contributed by extensions.">KB UI Extension</button>
        <button class="secondary small" id="btnKbUiExt" title="Filter the Keyboard Shortcuts panel to display only keybindings contributed specifically by the 'gruntfuggly.todo-tree' extension.">KB UI Ext</button>
        <button class="secondary small" id="btnKbUiClear" title="Search the Keyboard Shortcuts panel for unassigned keybindings related to 'todo-tree' to assist in resolving conflicts.">KB UI Clear</button>
        
        <button class="secondary" id="btnReset" title="Reset and restore all input fields, checkboxes, and modifier settings to their initial values when the form opened.">Reset</button>
        <button class="secondary" id="btnClear" title="Clear all fields, checkboxes, and validation states across the entire form.">Clear</button>
        <button class="secondary" id="btnCopyBinding" title="Copy the current keybinding, command, and when-clause properties to the clipboard as a standard VS Code JSON block.">Copy Binding</button>
        <button class="secondary" id="btnPasteBinding" title="Read a keybinding JSON object from the clipboard and automatically populate the form fields with its values.">Paste Binding</button>
        <div style="flex-grow: 1;"></div>
        <button class="secondary" id="btnCancel" title="Discard any pending changes and return back to the main command picker menu.">Cancel</button>
        <button class="secondary" id="btnClone" disabled title="Remove the active keybinding assignment for this command.">Unbind</button>
        <button class="secondary" id="btnSaveClone" disabled title="Add the newly configured keybinding as an additional shortcut for this command without deleting any existing mappings.">Add</button>
        <button id="btnSubmit" disabled title="Save and apply the updated keybinding assignment for this command.">Save</button>
    </div>

    <script>
        window.CE_INITIAL_STATE = {
            commandId: "` + escapeJS(commandId) + `",
            chord1Base: "` + escapeJS(chord1Base) + `",
            chord1Flags: "` + escapeJS(chord1Flags) + `",
            chord2Base: "` + escapeJS(chord2Base) + `",
            chord2Flags: "` + escapeJS(chord2Flags) + `",
            whenClause: "` + escapeJS(whenClause) + `",
            currentKeys: "` + escapeJS(currentKeys) + `",
            currentWhen: "` + escapeJS(currentWhen) + `",
            initialNativeKey: "` + escapeJS(initialNativeKey) + `"
        };
        ` + webviewJS + `
    </script>
</body>
</html>`;
}

module.exports = { getWebviewContent };

// END OF FILE: src/extension-macros-html.js
