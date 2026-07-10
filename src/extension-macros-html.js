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
    const fullShorthandInput = document.getElementById('fullShorthandInput');
    const statusBox = document.getElementById('statusBox');
    
    const btnCancel = document.getElementById('btnCancel');
    const btnClone = document.getElementById('btnClone'); // Unbind
    const btnSaveClone = document.getElementById('btnSaveClone'); // Add
    const btnSubmit = document.getElementById('btnSubmit'); // Save

    const btnClear1 = document.getElementById('btnClear1');
    const btnClear2 = document.getElementById('btnClear2');
    
    // Left side actions and copies
    const btnReset = document.getElementById('btnResetHeader');
    const btnClear = document.getElementById('btnClear');
    const btnCopyBinding = document.getElementById('btnCopyBindingHeader');
    const btnPasteBinding = document.getElementById('btnPasteBinding');
    const btnCopyCommand = document.getElementById('btnCopyCommand');
    const btnCopyKey = document.getElementById('btnCopyKey');

    // Row 1 (Current)
    const btnEditJson = document.getElementById('btnEditJson');
    const btnKbUiCmd = document.getElementById('btnKbUiCmd');
    const btnKbUiKey = document.getElementById('btnKbUiKey');
    const btnKbUiUser = document.getElementById('btnKbUiUser');
    const btnKbUiDefault = document.getElementById('btnKbUiDefault');
    const btnKbUiExtension = document.getElementById('btnKbUiExtension');
    const btnKbUiExt = document.getElementById('btnKbUiExt');

    // Row 2 (New)
    const btnEditJsonNew = document.getElementById('btnEditJsonNew');
    const btnKbUiCmdNew = document.getElementById('btnKbUiCmdNew');
    const btnKbUiKeyNew = document.getElementById('btnKbUiKeyNew');
    const btnKbUiUserNew = document.getElementById('btnKbUiUserNew');
    const btnKbUiDefaultNew = document.getElementById('btnKbUiDefaultNew');
    const btnKbUiExtensionNew = document.getElementById('btnKbUiExtensionNew');
    const btnKbUiExtNew = document.getElementById('btnKbUiExtNew');

    const currentWhenClauseLabel = document.getElementById('currentWhenClauseLabel');

    let lastValidatedNativeKey = '';
    let isSynchronizing = false;
    let isInitialLoad = true;

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

    function normalizeBaseKey(k) {
        const lower = (k || '').toLowerCase().trim();
        if (lower === 'ins' || lower === 'insert') return 'insert';
        if (lower === 'del' || lower === 'delete') return 'delete';
        if (lower === 'esc' || lower === 'escape') return 'escape';
        if (lower === 'pgup' || lower === 'pageup') return 'pageup';
        if (lower === 'pgdn' || lower === 'pagedown') return 'pagedown';
        if (lower === 'caps' || lower === 'capslock') return 'capslock';
        return lower;
    }

    function normalizeFlags(f) {
        return (f || '').toLowerCase().split('').sort().join('').trim();
    }

    function hasBindingChanged() {
        if (!window.CE_INITIAL_STATE) return false;
        const initialB1 = normalizeBaseKey(window.CE_INITIAL_STATE.chord1Base);
        const initialF1 = normalizeFlags(window.CE_INITIAL_STATE.chord1Flags);
        const initialB2 = normalizeBaseKey(window.CE_INITIAL_STATE.chord2Base);
        const initialF2 = normalizeFlags(window.CE_INITIAL_STATE.chord2Flags);
        const initialWhen = (window.CE_INITIAL_STATE.whenClause || '').trim();

        const currentB1 = normalizeBaseKey(baseInput1.value);
        const currentF1 = normalizeFlags(shortcodeInput1.value);
        const currentB2 = normalizeBaseKey(baseInput2.value);
        const currentF2 = normalizeFlags(shortcodeInput2.value);
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
        const changed = hasBindingChanged();
        
        const changedIndicator = document.getElementById('changedIndicator');
        if (changedIndicator) {
            changedIndicator.style.display = (changed && !isInitialLoad) ? 'inline-block' : 'none';
        }

        if (!isValid) {
            btnSubmit.disabled = true;
            btnSaveClone.disabled = true;
            btnClone.disabled = true;
        } else {
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

    function triggerValidation(updateShorthandText = true) {
        validateBaseKeys();
        const textValue = getFullShorthand();
        
        if (updateShorthandText) {
            fullShorthandInput.value = textValue;
        }

        const changed = hasBindingChanged();
        const changedIndicator = document.getElementById('changedIndicator');
        if (changedIndicator) {
            changedIndicator.style.display = (changed && !isInitialLoad) ? 'inline-block' : 'none';
        }

        if (!textValue) {
            statusBox.style.display = 'none';
            btnSubmit.disabled = true;
            btnClone.disabled = true;
            btnSaveClone.disabled = true;
            return;
        }
        vscode.postMessage({ command: 'validate', value: textValue });
    }

    function parseAndPopulateShorthand(shorthandStr) {
        const chords = (shorthandStr || '').trim().split(/\\\\s+/);
        let b1 = '', f1 = '', b2 = '', f2 = '';

        if (chords.length >= 1 && chords[0]) {
            const match = chords[0].match(/(.*)\\\\.([wcas]*)$/i);
            if (match) {
                b1 = match[1];
                f1 = match[2];
            } else {
                b1 = chords[0];
                f1 = '';
            }
        }
        if (chords.length >= 2 && chords[1]) {
            const match = chords[1].match(/(.*)\\\\.([wcas]*)$/i);
            if (match) {
                b2 = match[1];
                f2 = match[2];
            } else {
                b2 = chords[1];
                f2 = '';
            }
        }

        baseInput1.value = cleanBaseKeyInput(b1);
        shortcodeInput1.value = cleanShortcodeInput(f1);
        checkboxes1.w.checked = f1.includes('w');
        checkboxes1.c.checked = f1.includes('c');
        checkboxes1.a.checked = f1.includes('a');
        checkboxes1.s.checked = f1.includes('s');

        baseInput2.value = cleanBaseKeyInput(b2);
        shortcodeInput2.value = cleanShortcodeInput(f2);
        checkboxes2.w.checked = f2.includes('w');
        checkboxes2.c.checked = f2.includes('c');
        checkboxes2.a.checked = f2.includes('a');
        checkboxes2.s.checked = f2.includes('s');
    }

    function syncFromFullShorthand() {
        if (isSynchronizing) return;
        isSynchronizing = true;
        parseAndPopulateShorthand(fullShorthandInput.value);
        isSynchronizing = false;
        triggerValidation(false);
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
        triggerValidation(true);
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
        triggerValidation(true);
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
        triggerValidation(true);
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
        triggerValidation(true);
    }

    fullShorthandInput.addEventListener('input', syncFromFullShorthand);

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
            triggerValidation(true);
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
            triggerValidation(true);
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
            triggerValidation(true);
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
            triggerValidation(true);
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
            triggerValidation(true);
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
        // Trigger unbind action using the new/form UI parameters or current parameters
        vscode.postMessage({
            command: 'unbind',
            nativeKey: lastValidatedNativeKey || (window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.initialNativeKey : ''),
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

    // Row 1 (Current) Action Handlers
    btnEditJson.addEventListener('click', () => {
        vscode.postMessage({
            command: 'editJson',
            nativeKey: window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.initialNativeKey : '',
            when: window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.whenClause : ''
        });
    });

    btnKbUiCmd.addEventListener('click', () => {
        const cmd = window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '';
        vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: [cmd] });
    });

    btnKbUiKey.addEventListener('click', () => {
        const key = window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.initialNativeKey : '';
        vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: ['@key:"' + key + '"'] });
    });

    btnKbUiUser.addEventListener('click', () => {
        vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: ['@source:user'] });
    });

    btnKbUiDefault.addEventListener('click', () => {
        vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: ['@source:default'] });
    });

    btnKbUiExtension.addEventListener('click', () => {
        vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: ['@source:extension'] });
    });

    btnKbUiExt.addEventListener('click', () => {
        const commandId = window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '';
        let targetExtensionId = '';
        const dotIndex = commandId.indexOf('.');
        if (dotIndex !== -1) {
            targetExtensionId = commandId.substring(0, dotIndex);
        }
        vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: ['@ext:' + targetExtensionId] });
    });


    // Row 2 (New) Action Handlers
    btnEditJsonNew.addEventListener('click', () => {
        vscode.postMessage({
            command: 'editJson',
            nativeKey: lastValidatedNativeKey,
            when: whenInput.value
        });
    });

    btnKbUiCmdNew.addEventListener('click', () => {
        const cmd = window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '';
        vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: [cmd] });
    });

    btnKbUiKeyNew.addEventListener('click', () => {
        vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: ['@key:"' + (lastValidatedNativeKey || '') + '"'] });
    });

    btnKbUiUserNew.addEventListener('click', () => {
        vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: ['@source:user'] });
    });

    btnKbUiDefaultNew.addEventListener('click', () => {
        vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: ['@source:default'] });
    });

    btnKbUiExtensionNew.addEventListener('click', () => {
        vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: ['@source:extension'] });
    });

    btnKbUiExtNew.addEventListener('click', () => {
        const commandId = window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '';
        let targetExtensionId = '';
        const dotIndex = commandId.indexOf('.');
        if (dotIndex !== -1) {
            targetExtensionId = commandId.substring(0, dotIndex);
        }
        vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: ['@ext:' + targetExtensionId] });
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
        isInitialLoad = true;
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
        triggerValidation(true);

        setTimeout(() => {
            isInitialLoad = false;
        }, 100);
    }

    if (btnReset) {
        btnReset.addEventListener('click', resetToInitial);
    }

    if (btnCopyCommand) {
        btnCopyCommand.addEventListener('click', () => {
            const cmd = window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '';
            if (!cmd) return;
            vscode.postMessage({
                command: 'copyToClipboard',
                value: cmd,
                infoMsg: 'Copied command ID to clipboard.'
            });
        });
    }

    if (btnCopyKey) {
        btnCopyKey.addEventListener('click', () => {
            const textValue = getFullShorthand();
            if (!textValue) return;
            vscode.postMessage({
                command: 'copyToClipboard',
                value: textValue,
                infoMsg: 'Copied key to clipboard.'
            });
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
        
        .actions-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            padding-top: 16px;
            margin-top: 10px;
        }
        .helper-row {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .helper-row-label {
            font-weight: bold;
            font-size: 0.9em;
            width: 70px;
            opacity: 0.85;
        }
        .helper-buttons {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
        }
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
        <div style="font-weight: bold; font-size: 1.1em; margin-bottom: 2px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
            <span style="display: flex; align-items: center; gap: 8px;">
                <button type="button" class="secondary small" id="btnCopyCommand" title="Copy Command ID" style="padding: 2px 4px; font-size: 0.9em; display: inline-flex; align-items: center; justify-content: center;">📋</button>
                <span>Command: ` + (title || '') + `</span>
                <button type="button" class="secondary small" id="btnCopyBindingHeader" title="Copy Binding JSON" style="padding: 2px 6px; font-size: 0.85em; font-weight: 500;">Copy Binding</button>
            </span>
            <span id="changedIndicator" style="display: none; background: #e5c07b; color: #1e1e1e; padding: 2px 6px; border-radius: 3px; font-size: 0.8em; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Changed</span>
        </div>
        <div id="currentKeysContainer">` + formatCurrentKeys(currentKeys) + `</div>
        <div><span style="opacity: 0.7;">Current When:</span> <strong id="currentWhenClauseLabel">` + (currentWhen || 'No context') + `</strong></div>
        <div style="margin-top: 8px; display: flex; align-items: center; gap: 8px;">
            <span style="display: inline-flex; align-items: center; gap: 6px;">
                <button type="button" class="secondary small" id="btnCopyKey" title="Copy Shorthand Key" style="padding: 2px 4px; font-size: 0.9em; display: inline-flex; align-items: center; justify-content: center;">📋</button>
                <span style="opacity: 0.85; font-weight: bold;">Key:</span>
            </span>
            <input type="text" id="fullShorthandInput" placeholder="e.g., INS.a E" title="Editable full binding in cas shorthand format (e.g., INS.a E). Modifying this field instantly parses and populates the individual key controls below, and vice versa." style="flex-grow: 1;">
            <button type="button" class="secondary small" id="btnResetHeader" title="Discard current unsaved changes and reset the entire form and validation state back to the original values." style="padding: 4px 8px; font-size: 0.85em; font-weight: 500;">Reset</button>
        </div>
    </div>
    
    <div class="chords-grid">
        <!-- Chord 1 Panel -->
        <div class="chord-panel">
            <div class="chord-header">
                <span>Key 1 (Main Chord)</span>
                <button type="button" class="secondary small" id="btnClear1" title="Clear the Base Key, modifier checkboxes, and shortcode box for the primary chord.">Clear</button>
            </div>
            
            <div style="display: flex; gap: 12px; align-items: end; flex-wrap: wrap;">
                <div style="display: flex; gap: 6px; align-items: end;">
                    <div class="form-group">
                        <label for="baseKey" style="font-weight: 500; font-size: 0.9em; opacity: 0.85;">Base Key</label>
                        <input type="text" id="baseKey" placeholder="e.g., K, F11, ENTER" title="Specify the primary key identifier. Non-recognized keys will be highlighted with red border borders." style="width: 4em; padding: 6px 4px; text-align: center;">
                    </div>
                    <div class="form-group">
                        <label for="shortcode" style="font-weight: 500; font-size: 0.9em; opacity: 0.85;">Code</label>
                        <input type="text" id="shortcode" placeholder="cas" title="Compact modifier flags: w (Windows), c (Control), a (Alt), s (Shift)" style="width: 2em; padding: 6px 4px; text-align: center;">
                    </div>
                </div>
                <div class="form-group">
                    <label style="font-weight: 500; font-size: 0.9em; opacity: 0.85; margin-bottom: 6px;">Mods</label>
                    <div class="checkbox-group" style="display: flex; gap: 4px; align-items: center; justify-content: flex-start; margin-bottom: 2px; flex-wrap: nowrap; white-space: nowrap;">
                        <label class="checkbox-item" title="Windows modifier key flag" style="gap: 2px; font-size: 0.9em;"><input type="checkbox" id="modW" value="w">W</label>
                        <label class="checkbox-item" title="Control modifier key flag" style="gap: 2px; font-size: 0.9em;"><input type="checkbox" id="modC" value="c">C</label>
                        <label class="checkbox-item" title="Alt modifier key flag" style="gap: 2px; font-size: 0.9em;"><input type="checkbox" id="modA" value="a">A</label>
                        <label class="checkbox-item" title="Shift modifier key flag" style="gap: 2px; font-size: 0.9em;"><input type="checkbox" id="modS" value="s">S</label>
                    </div>
                </div>
            </div>
        </div>

        <!-- Chord 2 Panel -->
        <div class="chord-panel">
            <div class="chord-header">
                <span>Key 2 (Optional Second Chord)</span>
                <button type="button" class="secondary small" id="btnClear2" title="Clear the Base Key, modifier checkboxes, and shortcode box for the secondary optional chord.">Clear</button>
            </div>
            
            <div style="display: flex; gap: 12px; align-items: end; flex-wrap: wrap;">
                <div style="display: flex; gap: 6px; align-items: end;">
                    <div class="form-group">
                        <label for="baseKey2" style="font-weight: 500; font-size: 0.9em; opacity: 0.85;">Base Key</label>
                        <input type="text" id="baseKey2" placeholder="e.g., W, ESC, DOWN" title="Specify the secondary key identifier for chord combinations. Non-recognized keys will be highlighted with red border borders." style="width: 4em; padding: 6px 4px; text-align: center;">
                    </div>
                    <div class="form-group">
                        <label for="shortcode2" style="font-weight: 500; font-size: 0.9em; opacity: 0.85;">Code</label>
                        <input type="text" id="shortcode2" placeholder="cas" title="Compact modifier flags: w (Windows), c (Control), a (Alt), s (Shift)" style="width: 2em; padding: 6px 4px; text-align: center;">
                    </div>
                </div>
                <div class="form-group">
                    <label style="font-weight: 500; font-size: 0.9em; opacity: 0.85; margin-bottom: 6px;">Mods</label>
                    <div class="checkbox-group" style="display: flex; gap: 4px; align-items: center; justify-content: flex-start; margin-bottom: 2px; flex-wrap: nowrap; white-space: nowrap;">
                        <label class="checkbox-item" title="Windows modifier key flag" style="gap: 2px; font-size: 0.9em;"><input type="checkbox" id="modW2" value="w">W</label>
                        <label class="checkbox-item" title="Control modifier key flag" style="gap: 2px; font-size: 0.9em;"><input type="checkbox" id="modC2" value="c">C</label>
                        <label class="checkbox-item" title="Alt modifier key flag" style="gap: 2px; font-size: 0.9em;"><input type="checkbox" id="modA2" value="a">A</label>
                        <label class="checkbox-item" title="Shift modifier key flag" style="gap: 2px; font-size: 0.9em;"><input type="checkbox" id="modS2" value="s">S</label>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="form-group" style="margin-top: 8px;">
        <label for="whenClause" style="font-weight: 500;">When</label>
        <input type="text" id="whenClause" placeholder="e.g., editorTextFocus" title="Specifies the context condition when the keybinding is active (e.g., editorTextFocus, terminalFocus).">
    </div>

    <div id="statusBox" style="display: none;"></div>

    <div class="actions-group">
        <!-- Row 1: Current Helpers -->
        <div class="helper-row">
            <span class="helper-row-label">Current:</span>
            <div class="helper-buttons">
                <button type="button" class="secondary small" id="btnEditJson" title="Open the user keybindings.json configuration file and highlight the exact location of the current active binding record.">Edit Json</button>
                <button type="button" class="secondary small" id="btnKbUiCmd" title="Open the native VS Code Keyboard Shortcuts panel with a search filter focused specifically on the command ID of this action.">KB UI Cmd</button>
                <button type="button" class="secondary small" id="btnKbUiKey" title="Open the native VS Code Keyboard Shortcuts panel pre-filtered for the current keyboard shortcut assignment.">KB UI Key</button>
                <button type="button" class="secondary small" id="btnKbUiUser" title="Open the native VS Code Keyboard Shortcuts panel displaying only your custom user-configured keybindings.">KB UI User</button>
                <button type="button" class="secondary small" id="btnKbUiDefault" title="Open the native VS Code Keyboard Shortcuts panel displaying all default built-in keybindings.">KB UI Default</button>
                <button type="button" class="secondary small" id="btnKbUiExtension" title="Open the native VS Code Keyboard Shortcuts panel filtering to show keybindings contributed by extensions.">KB UI Extension</button>
                <button type="button" class="secondary small" id="btnKbUiExt" title="Open the native VS Code Keyboard Shortcuts panel showing only the keybindings contributed by the extension namespace of this command.">KB UI Ext</button>
            </div>
        </div>

        <!-- Row 2: New Helpers -->
        <div class="helper-row" style="margin-bottom: 8px;">
            <span class="helper-row-label">New:</span>
            <div class="helper-buttons">
                <button type="button" class="secondary small" id="btnEditJsonNew" title="Open keybindings.json file and look up or highlight entries matching the newly configured key combination and context.">Edit Json</button>
                <button type="button" class="secondary small" id="btnKbUiCmdNew" title="Open the native VS Code Keyboard Shortcuts panel filtering specifically for this action's command.">KB UI Cmd</button>
                <button type="button" class="secondary small" id="btnKbUiKeyNew" title="Open the native VS Code Keyboard Shortcuts panel with search pre-filled for the new key combination typed in the form.">KB UI Key</button>
                <button type="button" class="secondary small" id="btnKbUiUserNew" title="Open the native VS Code Keyboard Shortcuts panel displaying custom user keybinding modifications.">KB UI User</button>
                <button type="button" class="secondary small" id="btnKbUiDefaultNew" title="Open the native VS Code Keyboard Shortcuts panel to view default VS Code keyboard mappings.">KB UI Default</button>
                <button type="button" class="secondary small" id="btnKbUiExtensionNew" title="Open the native VS Code Keyboard Shortcuts panel showing extension-supplied default bindings.">KB UI Extension</button>
                <button type="button" class="secondary small" id="btnKbUiExtNew" title="Open the native VS Code Keyboard Shortcuts panel filtered specifically to the extension package that contributes this command.">KB UI Ext</button>
            </div>
        </div>

        <!-- Row 3: Standard Actions -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 12px;">
            <!-- Align Left -->
            <div style="display: flex; gap: 8px;">
                <button type="button" class="secondary" id="btnClear" title="Clear all input fields, checkboxes, modifier labels, and validation indicators to let you configure a clean, empty key combination.">Clear</button>
                <button type="button" class="secondary" id="btnPasteBinding" title="Read a keybinding JSON object from your system clipboard and instantly parse its properties to populate this form.">Paste Binding</button>
            </div>
            
            <!-- Align Right -->
            <div style="display: flex; gap: 8px;">
                <button type="button" class="secondary" id="btnCancel" title="Close this configuration view and return to the main command picker menu.">Cancel</button>
                <button type="button" class="secondary" id="btnClone" disabled title="Unbind and remove this keyboard shortcut mapping.">Unbind</button>
                <button type="button" class="secondary" id="btnSaveClone" disabled title="Add the newly configured key combination as an additional secondary shortcut for this action, preserving existing bindings.">Add</button>
                <button type="button" id="btnSubmit" disabled title="Save and apply the updated key combination assignment for this action (replacing any matched existing binding).">Save</button>
            </div>
        </div>
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
