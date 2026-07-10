// START OF FILE: src/extension-macros-html.js

/**
 * Returns lightweight HTML DOM structures using embedded script logic variables.
 * Automatically mirrors the theme's colors natively using CSS Workbench properties.
 */
function getWebviewContent(commandId, title, chord1Base, chord1Flags, chord2Base, chord2Flags, whenClause, currentKeys, currentWhen, initialNativeKey, originalArgs = [], checkedOff = [], commandBindings = {}) {
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
            return `
            <div>
                <label style="cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                    <input type="radio" name="preferredFormat" id="radioShortcode" value="shortcode" style="margin: 0; cursor: pointer;" checked>
                    <span style="opacity: 0.7;">ShortCode:</span>
                    <strong>None</strong>
                </label>
            </div>
            <div>
                <label style="cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                    <input type="radio" name="preferredFormat" id="radioNative" value="native" style="margin: 0; cursor: pointer;">
                    <span style="opacity: 0.7;">Native:</span>
                    <strong>None</strong>
                </label>
            </div>`;
        }
        const parts = keys.split('  |  ');
        let shorthand = '';
        let nativeKey = '';
        for (const part of parts) {
            const lastOpenParen = part.lastIndexOf(' (');
            if (lastOpenParen !== -1 && part.endsWith(')')) {
                shorthand = part.substring(0, lastOpenParen).trim();
                nativeKey = part.substring(lastOpenParen + 2, part.length - 1).trim();
                break;
            } else {
                shorthand = part;
                nativeKey = part;
            }
        }
        return `
        <div>
            <label style="cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                <input type="radio" name="preferredFormat" id="radioShortcode" value="shortcode" style="margin: 0; cursor: pointer;" checked>
                <span style="opacity: 0.7;">ShortCode:</span>
                <strong>${shorthand}</strong>
            </label>
        </div>
        <div>
            <label style="cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                <input type="radio" name="preferredFormat" id="radioNative" value="native" style="margin: 0; cursor: pointer;">
                <span style="opacity: 0.7;">Native:</span>
                <strong>${nativeKey}</strong>
            </label>
        </div>`;
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
    const btnDone = document.getElementById('btnDone'); // Done

    const btnClear1 = document.getElementById('btnClear1');
    const btnClear2 = document.getElementById('btnClear2');
    const btnResetKey1 = document.getElementById('btnResetKey1');
    const btnResetKey2 = document.getElementById('btnResetKey2');
    
    // Left side actions and copies
    const btnReset = document.getElementById('btnResetHeader');
    const btnClear = document.getElementById('btnClear');
    const btnCopyCurrentBinding = document.getElementById('btnCopyCurrentBinding');
    const btnCopyNewBinding = document.getElementById('btnCopyNewBinding');
    const btnEditInstigator = document.getElementById('btnEditInstigator');
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

    const btnEditJsonNewInst = document.getElementById('btnEditJsonNewInst');
    const btnKbUiCmdNewInst = document.getElementById('btnKbUiCmdNewInst');
    const btnKbUiKeyNewInst = document.getElementById('btnKbUiKeyNewInst');
    const btnKbUiUserNewInst = document.getElementById('btnKbUiUserNewInst');
    const btnKbUiDefaultNewInst = document.getElementById('btnKbUiDefaultNewInst');
    const btnKbUiExtensionNewInst = document.getElementById('btnKbUiExtensionNewInst');
    const btnKbUiExtNewInst = document.getElementById('btnKbUiExtNewInst');

    // Row 2 (New)
    const btnEditJsonNew = document.getElementById('btnEditJsonNew');
    const btnKbUiCmdNew = document.getElementById('btnKbUiCmdNew');
    const btnKbUiKeyNew = document.getElementById('btnKbUiKeyNew');
    const btnKbUiUserNew = document.getElementById('btnKbUiUserNew');
    const btnKbUiDefaultNew = document.getElementById('btnKbUiDefaultNew');
    const btnKbUiExtensionNew = document.getElementById('btnKbUiExtensionNew');
    const btnKbUiExtNew = document.getElementById('btnKbUiExtNew');

    const btnEditJsonNewNewInst = document.getElementById('btnEditJsonNewNewInst');
    const btnKbUiCmdNewNewInst = document.getElementById('btnKbUiCmdNewNewInst');
    const btnKbUiKeyNewNewInst = document.getElementById('btnKbUiKeyNewNewInst');
    const btnKbUiUserNewNewInst = document.getElementById('btnKbUiUserNewNewInst');
    const btnKbUiDefaultNewNewInst = document.getElementById('btnKbUiDefaultNewNewInst');
    const btnKbUiExtensionNewNewInst = document.getElementById('btnKbUiExtensionNewNewInst');
    const btnKbUiExtNewNewInst = document.getElementById('btnKbUiExtNewNewInst');

    const currentWhenClauseLabel = document.getElementById('currentWhenClauseLabel');

    let lastValidatedNativeKey = '';
    let lastValidatedShortCode = '';
    let isSynchronizing = false;
    let isInitialLoad = true;

    const baseKeyShortcodeMap = {
        'pageup': 'pu', 'pgup': 'pu',
        'pagedown': 'pd', 'pgdn': 'pd',
        'home': 'ho',
        'end': 'en',
        'insert': 'in', 'ins': 'in',
        '[': 'bl',
        ']': 'br',
        "'": 'sq',
        ';': 'sc',
        ',': 'co',
        '.': 'pe',
        '/': 'sf',
        '\\\\': 'sb',
        '\`': 'bq',
        'escape': 'esc', 'esc': 'esc',
        'arrowleft': 'lf', 'left': 'lf',
        'arrowright': 'rt', 'right': 'rt',
        'arrowdown': 'dn', 'down': 'dn',
        'arrowup': 'up', 'up': 'up',
        'delete': 'del', 'del': 'del',
        'pausebreak': 'pause', 'pause': 'pause',
        'backspace': 'bs',
        'pu': 'pu', 'pd': 'pd', 'ho': 'ho', 'en': 'en', 'in': 'in',
        'bl': 'bl', 'br': 'br', 'sq': 'sq', 'sc': 'sc', 'co': 'co',
        'pe': 'pe', 'sf': 'sf', 'sb': 'sb', 'bq': 'bq', 'lf': 'lf',
        'rt': 'rt', 'dn': 'dn', 'up': 'up', 'pause': 'pause', 'bs': 'bs'
    };

    function cleanBaseKeyInput(val) {
        if (!val) return '';
        let cleaned = val.toLowerCase()
            .replace(/(ctrl|alt|shift|win|cmd|meta)\\+/g, '')
            .replace(/\\.[casw]+/g, '')
            .replace(/\\+/g, '')
            .trim();
        if (baseKeyShortcodeMap[cleaned]) {
            return baseKeyShortcodeMap[cleaned];
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
        const radioNativeChecked = document.getElementById('radioNative') ? document.getElementById('radioNative').checked : false;
        
        if (!keys || keys === 'None') {
            return '<div>' +
                '<label style="cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">' +
                    '<input type="radio" name="preferredFormat" id="radioShortcode" value="shortcode" style="margin: 0; cursor: pointer;"' + (!radioNativeChecked ? ' checked' : '') + '> ' +
                    '<span style="opacity: 0.7;">ShortCode:</span> <strong>None</strong>' +
                '</label>' +
            '</div>' +
            '<div>' +
                '<label style="cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">' +
                    '<input type="radio" name="preferredFormat" id="radioNative" value="native" style="margin: 0; cursor: pointer;"' + (radioNativeChecked ? ' checked' : '') + '> ' +
                    '<span style="opacity: 0.7;">Native:</span> <strong>None</strong>' +
                '</label>' +
            '</div>';
        }
        const parts = keys.split('  |  ');
        let shorthand = '';
        let nativeKey = '';
        for (const part of parts) {
            const lastOpenParen = part.lastIndexOf(' (');
            if (lastOpenParen !== -1 && part.endsWith(')')) {
                shorthand = part.substring(0, lastOpenParen).trim();
                nativeKey = part.substring(lastOpenParen + 2, part.length - 1).trim();
                break;
            } else {
                shorthand = part;
                nativeKey = part;
            }
        }
        return '<div>' +
            '<label style="cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">' +
                '<input type="radio" name="preferredFormat" id="radioShortcode" value="shortcode" style="margin: 0; cursor: pointer;"' + (!radioNativeChecked ? ' checked' : '') + '> ' +
                '<span style="opacity: 0.7;">ShortCode:</span> <strong>' + shorthand + '</strong>' +
            '</label>' +
        '</div>' +
        '<div>' +
            '<label style="cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">' +
                '<input type="radio" name="preferredFormat" id="radioNative" value="native" style="margin: 0; cursor: pointer;"' + (radioNativeChecked ? ' checked' : '') + '> ' +
                '<span style="opacity: 0.7;">Native:</span> <strong>' + nativeKey + '</strong>' +
            '</label>' +
        '</div>';
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
            'home', 'end', 'capslock', 'caps',
            'pu', 'pd', 'ho', 'en', 'in', 'bl', 'br', 'sq', 'sc', 'co', 'pe', 'sf', 'sb', 'bq', 'lf', 'rt', 'dn', 'pause', 'bs'
        ];

        const isValidBaseKey = (k) => {
            const lower = k.toLowerCase().trim();
            if (!lower) return false;
            return /^[a-z0-9]$/.test(lower) || /^f[0-9]+$/.test(lower) || knownKeys.includes(lower);
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
        const chords = (shorthandStr || '').trim().split(/\\s+/);
        let b1 = '', f1 = '', b2 = '', f2 = '';

        if (chords.length >= 1 && chords[0]) {
            const match = chords[0].match(/(.*)\\.([wcas]*)$/i);
            if (match) {
                b1 = match[1];
                f1 = match[2];
            } else {
                b1 = chords[0];
                f1 = '';
            }
        }
        if (chords.length >= 2 && chords[1]) {
            const match = chords[1].match(/(.*)\\.([wcas]*)$/i);
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

    function getModifierColor(c, a, s, w = false) {
        let color = '#abb2bf';
        if (c && a && s) color = '#56b6c2';
        else if (c && s) color = '#d19a66';
        else if (a && s) color = '#98c379';
        else if (c && a) color = '#c678dd';
        else if (c) color = '#f14c4c';
        else if (a) color = '#2f2bfb';
        else if (s) color = '#e5c07b';
        else if (w) color = '#ffffff';

        if (w && (c || a || s)) {
            if (c && a) color = '#e1b3f7';
            else if (c) color = '#ffa1a1';
            else if (a) color = '#8a88ff';
            else if (s) color = '#fff4a3';
        }
        return color;
    }

    function updateModifierColors() {
        const w1 = checkboxes1.w.checked;
        const c1 = checkboxes1.c.checked;
        const a1 = checkboxes1.a.checked;
        const s1 = checkboxes1.s.checked;

        let colorW1 = '#abb2bf';
        let colorC1 = '#f14c4c';
        let colorA1 = '#2f2bfb';
        let colorS1 = '#e5c07b';

        if (c1 && a1) {
            colorC1 = '#c678dd';
            colorA1 = '#c678dd';
        }

        if (w1) {
            colorW1 = '#ffffff';
            colorC1 = (c1 && a1) ? '#e1b3f7' : '#ffa1a1';
            colorA1 = (c1 && a1) ? '#e1b3f7' : '#8a88ff';
            colorS1 = '#fff4a3';
        }

        if (checkboxes1.w.parentNode) checkboxes1.w.parentNode.style.color = colorW1;
        if (checkboxes1.c.parentNode) checkboxes1.c.parentNode.style.color = colorC1;
        if (checkboxes1.a.parentNode) checkboxes1.a.parentNode.style.color = colorA1;
        if (checkboxes1.s.parentNode) checkboxes1.s.parentNode.style.color = colorS1;

        const dominantColor1 = getModifierColor(c1, a1, s1, w1);
        shortcodeInput1.style.color = dominantColor1;
        shortcodeInput1.style.borderColor = dominantColor1;

        const w2 = checkboxes2.w.checked;
        const c2 = checkboxes2.c.checked;
        const a2 = checkboxes2.a.checked;
        const s2 = checkboxes2.s.checked;

        let colorW2 = '#abb2bf';
        let colorC2 = '#f14c4c';
        let colorA2 = '#2f2bfb';
        let colorS2 = '#e5c07b';

        if (c2 && a2) {
            colorC2 = '#c678dd';
            colorA2 = '#c678dd';
        }

        if (w2) {
            colorW2 = '#ffffff';
            colorC2 = (c2 && a2) ? '#e1b3f7' : '#ffa1a1';
            colorA2 = (c2 && a2) ? '#e1b3f7' : '#8a88ff';
            colorS2 = '#fff4a3';
        }

        if (checkboxes2.w.parentNode) checkboxes2.w.parentNode.style.color = colorW2;
        if (checkboxes2.c.parentNode) checkboxes2.c.parentNode.style.color = colorC2;
        if (checkboxes2.a.parentNode) checkboxes2.a.parentNode.style.color = colorA2;
        if (checkboxes2.s.parentNode) checkboxes2.s.parentNode.style.color = colorS2;

        const dominantColor2 = getModifierColor(c2, a2, s2, w2);
        shortcodeInput2.style.color = dominantColor2;
        shortcodeInput2.style.borderColor = dominantColor2;
    }

    // Hook modifier colors update to triggerValidation so it runs on every form change
    const originalTriggerValidation = triggerValidation;
    triggerValidation = function(updateShorthandText) {
        originalTriggerValidation(updateShorthandText);
        updateModifierColors();
    };

    fullShorthandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const preferredEl = document.querySelector('input[name="preferredFormat"]:checked');
            const preferred = preferredEl ? preferredEl.value : 'shortcode';
            if (preferred === 'shortcode' && lastValidatedShortCode) {
                fullShorthandInput.value = lastValidatedShortCode;
            } else if (preferred === 'native' && lastValidatedNativeKey) {
                fullShorthandInput.value = lastValidatedNativeKey;
            }
        }
    });

    // Checkoff functionality
    const chkCheckoff = document.getElementById('chkCheckoff');
    const lblCheckoffCount = document.getElementById('lblCheckoffCount');

    function findNextUnchecked(startIdx, dir) {
        const originalArgs = window.CE_ORIGINAL_ARGS || [];
        const checkedOff = window.CE_CHECKED_OFF_COMMANDS || [];
        const total = originalArgs.length;
        if (total <= 1) return -1;
        
        let idx = startIdx;
        for (let i = 0; i < total - 1; i++) {
            idx = (idx + dir + total) % total;
            if (!checkedOff.includes(originalArgs[idx])) {
                return idx;
            }
        }
        return -1;
    }

    function findNextChecked(startIdx, dir) {
        const originalArgs = window.CE_ORIGINAL_ARGS || [];
        const checkedOff = window.CE_CHECKED_OFF_COMMANDS || [];
        const total = originalArgs.length;
        if (total <= 1) return -1;
        
        let idx = startIdx;
        for (let i = 0; i < total - 1; i++) {
            idx = (idx + dir + total) % total;
            if (checkedOff.includes(originalArgs[idx])) {
                return idx;
            }
        }
        return -1;
    }

    function updatePagingButtonDisabledStates() {
        const originalArgs = window.CE_ORIGINAL_ARGS || [];
        const total = originalArgs.length;
        const currentCmdId = window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '';
        const currentIdx = originalArgs.indexOf(currentCmdId);

        if (total <= 1 || currentIdx === -1) {
            [
                btnPageFirst, btnPagePrevWithCheckoff, btnPagePrevNoCheckoff, btnPagePrev,
                btnPageNext, btnPageNextNoCheckoff, btnPageNextWithCheckoff, btnPageLast
            ].forEach(btn => {
                if (btn) btn.disabled = true;
            });
            return;
        }

        if (btnPageFirst) btnPageFirst.disabled = (currentIdx === 0);
        if (btnPageLast) btnPageLast.disabled = (currentIdx === total - 1);

        if (btnPagePrev) btnPagePrev.disabled = (currentIdx === 0);
        if (btnPageNext) btnPageNext.disabled = (currentIdx === total - 1);

        const nextUncheckedForward = findNextUnchecked(currentIdx, 1);
        if (btnPageNextNoCheckoff) btnPageNextNoCheckoff.disabled = (nextUncheckedForward === -1);

        const nextUncheckedBackward = findNextUnchecked(currentIdx, -1);
        if (btnPagePrevNoCheckoff) btnPagePrevNoCheckoff.disabled = (nextUncheckedBackward === -1);

        const nextCheckedForward = findNextChecked(currentIdx, 1);
        if (btnPageNextWithCheckoff) btnPageNextWithCheckoff.disabled = (nextCheckedForward === -1);

        const nextCheckedBackward = findNextChecked(currentIdx, -1);
        if (btnPagePrevWithCheckoff) btnPagePrevWithCheckoff.disabled = (nextCheckedBackward === -1);
    }

    function updateCheckoffUI() {
        const originalArgs = window.CE_ORIGINAL_ARGS || [];
        const checkedOff = window.CE_CHECKED_OFF_COMMANDS || [];
        const currentCmdId = window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '';

        if (chkCheckoff) {
            chkCheckoff.checked = checkedOff.includes(currentCmdId);
        }
        const matchedCount = originalArgs.filter(id => checkedOff.includes(id)).length;
        if (lblCheckoffCount) {
            lblCheckoffCount.textContent = matchedCount + ' of ' + originalArgs.length;
        }
        updatePagingButtonDisabledStates();
    }

    if (chkCheckoff) {
        chkCheckoff.addEventListener('change', () => {
            const checked = chkCheckoff.checked;
            const currentCmdId = window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '';
            const checkedOff = window.CE_CHECKED_OFF_COMMANDS || [];

            if (checked) {
                if (!checkedOff.includes(currentCmdId)) {
                    checkedOff.push(currentCmdId);
                }
            } else {
                const idx = checkedOff.indexOf(currentCmdId);
                if (idx !== -1) {
                    checkedOff.splice(idx, 1);
                }
            }
            window.CE_CHECKED_OFF_COMMANDS = checkedOff;
            updateCheckoffUI();

            vscode.postMessage({
                command: 'toggleCheckoff',
                commandId: currentCmdId,
                checked: checked
            });
        });
    }

    // Paging functionality
    const btnPageFirst = document.getElementById('btnPageFirst');
    const btnPagePrevWithCheckoff = document.getElementById('btnPagePrevWithCheckoff');
    const btnPagePrevNoCheckoff = document.getElementById('btnPagePrevNoCheckoff');
    const btnPagePrev = document.getElementById('btnPagePrev');
    const btnPageNext = document.getElementById('btnPageNext');
    const btnPageNextNoCheckoff = document.getElementById('btnPageNextNoCheckoff');
    const btnPageNextWithCheckoff = document.getElementById('btnPageNextWithCheckoff');
    const btnPageLast = document.getElementById('btnPageLast');
    const lblPageNum = document.getElementById('lblPageNum');

    function checkoffCurrent() {
        const currentCmdId = window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '';
        const checkedOff = window.CE_CHECKED_OFF_COMMANDS || [];
        if (currentCmdId && !checkedOff.includes(currentCmdId)) {
            checkedOff.push(currentCmdId);
            window.CE_CHECKED_OFF_COMMANDS = checkedOff;
            updateCheckoffUI();
            vscode.postMessage({
                command: 'toggleCheckoff',
                commandId: currentCmdId,
                checked: true
            });
        }
    }

    function pageTo(targetIdx) {
        const originalArgs = window.CE_ORIGINAL_ARGS || [];
        if (targetIdx >= 0 && targetIdx < originalArgs.length) {
            const nextCmdId = originalArgs[targetIdx];
            vscode.postMessage({
                command: 'pageToCommand',
                commandId: nextCmdId
            });
        }
    }

    const originalArgs = window.CE_ORIGINAL_ARGS || [];
    const initialCmdId = window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '';
    const initialIdx = originalArgs.indexOf(initialCmdId);
    const total = originalArgs.length;

    function getCurrentIndex() {
        const args = window.CE_ORIGINAL_ARGS || [];
        const currentCmdId = window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '';
        return args.indexOf(currentCmdId);
    }

    if (total > 0 && initialIdx !== -1) {
        if (btnPageFirst) btnPageFirst.addEventListener('click', () => pageTo(0));
        
        if (btnPagePrevWithCheckoff) btnPagePrevWithCheckoff.addEventListener('click', () => {
            const currentIdx = getCurrentIndex();
            const idx = findNextChecked(currentIdx, -1);
            if (idx !== -1) pageTo(idx);
        });
        
        if (btnPagePrevNoCheckoff) btnPagePrevNoCheckoff.addEventListener('click', () => {
            const currentIdx = getCurrentIndex();
            const idx = findNextUnchecked(currentIdx, -1);
            if (idx !== -1) pageTo(idx);
        });
        
        if (btnPagePrev) btnPagePrev.addEventListener('click', () => {
            const currentIdx = getCurrentIndex();
            if (currentIdx > 0) {
                pageTo(currentIdx - 1);
            }
        });

        if (btnPageNext) btnPageNext.addEventListener('click', () => {
            const currentIdx = getCurrentIndex();
            if (currentIdx < total - 1) {
                pageTo(currentIdx + 1);
            }
        });

        if (btnPageNextNoCheckoff) btnPageNextNoCheckoff.addEventListener('click', () => {
            const currentIdx = getCurrentIndex();
            const idx = findNextUnchecked(currentIdx, 1);
            if (idx !== -1) pageTo(idx);
        });
        
        if (btnPageNextWithCheckoff) btnPageNextWithCheckoff.addEventListener('click', () => {
            const currentIdx = getCurrentIndex();
            const idx = findNextChecked(currentIdx, 1);
            if (idx !== -1) pageTo(idx);
        });
        
        if (btnPageLast) btnPageLast.addEventListener('click', () => pageTo(total - 1));
        
        if (lblPageNum) {
            lblPageNum.textContent = (initialIdx + 1) + ' of ' + total;
        }
    } else {
        [
            btnPageFirst, btnPagePrevWithCheckoff, btnPagePrevNoCheckoff, btnPagePrev,
            btnPageNext, btnPageNextNoCheckoff, btnPageNextWithCheckoff, btnPageLast
        ].forEach(btn => {
            if (btn) btn.disabled = true;
        });
        if (lblPageNum) lblPageNum.textContent = '1 of 1';
    }

    // Close All Buttons
    const btnCloseAllKbJson = document.getElementById('btnCloseAllKbJson');
    if (btnCloseAllKbJson) {
        btnCloseAllKbJson.addEventListener('click', () => {
            vscode.postMessage({ command: 'closeAllKbJson' });
        });
    }

    const btnCloseAllKbUi = document.getElementById('btnCloseAllKbUi');
    if (btnCloseAllKbUi) {
        btnCloseAllKbUi.addEventListener('click', () => {
            vscode.postMessage({ command: 'closeAllKbUi' });
        });
    }

    // Run initial checkoff UI display & modifier colors
    updateCheckoffUI();
    updateModifierColors();

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
                const chords = shorthandStr.trim().split(/\\s+/);
                if (chords.length >= 1 && chords[0]) {
                    const match = chords[0].match(/(.*)\\.([wcas]*)$/);
                    if (match) {
                        b1 = match[1];
                        f1 = match[2];
                    } else {
                        b1 = chords[0];
                        f1 = '';
                    }
                }
                if (chords.length >= 2 && chords[1]) {
                    const match = chords[1].match(/(.*)\\.([wcas]*)$/);
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
            statusBox.style.display = 'block';
            statusBox.style.padding = '8px 12px';
            statusBox.style.borderRadius = '4px';
            
            statusBox.innerHTML = '';
            
            const textSpan = document.createElement('span');
            textSpan.textContent = message.text;
            statusBox.appendChild(textSpan);
            
            if (message.status === 'error') {
                statusBox.style.background = 'rgba(241, 76, 76, 0.15)';
                statusBox.style.color = '#f14c4c';
                lastValidatedNativeKey = '';
                lastValidatedShortCode = '';
                updateButtonStates(false);
            } else {
                if (message.status === 'warning') {
                    statusBox.style.background = 'rgba(229, 192, 123, 0.15)';
                    statusBox.style.color = '#e5c07b';
                    
                    if (message.collisionCommands && message.collisionCommands.length > 0) {
                        message.collisionCommands.forEach(cmdId => {
                            const btn = document.createElement('button');
                            btn.type = 'button';
                            btn.className = 'secondary small';
                            btn.style.marginLeft = '10px';
                            btn.style.padding = '2px 6px';
                            btn.style.fontSize = '0.85em';
                            btn.title = 'Launch editor UI for ' + cmdId;
                            btn.textContent = 'Edit ' + cmdId;
                            btn.addEventListener('click', () => {
                                vscode.postMessage({
                                    command: 'launchCollisionUI',
                                    commandId: cmdId
                                });
                            });
                            statusBox.appendChild(btn);
                        });
                    }
                } else {
                    statusBox.style.background = 'rgba(137, 209, 137, 0.15)';
                    statusBox.style.color = '#88d188';
                }
                
                lastValidatedNativeKey = message.nativeKey || '';
                lastValidatedShortCode = message.shortCode || '';
                
                if (document.activeElement !== fullShorthandInput) {
                    const preferredEl = document.querySelector('input[name="preferredFormat"]:checked');
                    const preferred = preferredEl ? preferredEl.value : 'shortcode';
                    if (preferred === 'native' && lastValidatedNativeKey) {
                        fullShorthandInput.value = lastValidatedNativeKey;
                    } else if (preferred === 'shortcode' && lastValidatedShortCode) {
                        fullShorthandInput.value = lastValidatedShortCode;
                    }
                }
                updateButtonStates(true);
            }
        } else if (message.type === 'updateLabels') {
            const container = document.getElementById('currentKeysContainer');
            if (container) {
                container.innerHTML = formatCurrentKeysJS(message.currentKeys || 'None');
            }
            if (currentWhenClauseLabel) currentWhenClauseLabel.textContent = message.currentWhen;
        } else if (message.type === 'saveSuccess') {
            if (message.commandBindings) {
                window.CE_COMMAND_BINDINGS = message.commandBindings;
            }
            if (window.CE_INITIAL_STATE) {
                window.CE_INITIAL_STATE.chord1Base = baseInput1.value;
                window.CE_INITIAL_STATE.chord1Flags = shortcodeInput1.value;
                window.CE_INITIAL_STATE.chord2Base = baseInput2.value;
                window.CE_INITIAL_STATE.chord2Flags = shortcodeInput2.value;
                window.CE_INITIAL_STATE.whenClause = whenInput.value;
            }
            const container = document.getElementById('currentKeysContainer');
            if (container) {
                container.innerHTML = formatCurrentKeysJS(message.currentKeys || 'None');
            }
            if (currentWhenClauseLabel) currentWhenClauseLabel.textContent = message.currentWhen;
            triggerValidation(true);
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
        } else if (message.type === 'updateItem') {
            if (message.commandBindings) {
                window.CE_COMMAND_BINDINGS = message.commandBindings;
            }
            window.CE_INITIAL_STATE = {
                commandId: message.commandId,
                chord1Base: message.chord1Base,
                chord1Flags: message.chord1Flags,
                chord2Base: message.chord2Base,
                chord2Flags: message.chord2Flags,
                whenClause: message.whenClause,
                currentKeys: message.currentKeys,
                currentWhen: message.currentWhen,
                initialNativeKey: message.initialNativeKey
            };
            if (message.checkedOffCommands) {
                window.CE_CHECKED_OFF_COMMANDS = message.checkedOffCommands;
            }

            const cmdTitleLabel = document.getElementById('cmdTitleLabel');
            if (cmdTitleLabel) {
                cmdTitleLabel.textContent = "Command: " + message.title;
            }

            resetToInitial();

            const lblPageNum = document.getElementById('lblPageNum');
            if (lblPageNum && window.CE_ORIGINAL_ARGS) {
                const total = window.CE_ORIGINAL_ARGS.length;
                const currentIdx = window.CE_ORIGINAL_ARGS.indexOf(message.commandId);
                lblPageNum.textContent = (currentIdx + 1) + ' of ' + total;
            }

            updateCheckoffUI();

            const container = document.getElementById('currentKeysContainer');
            if (container) {
                container.innerHTML = formatCurrentKeysJS(message.currentKeys || 'None');
            }
            if (currentWhenClauseLabel) {
                currentWhenClauseLabel.textContent = message.currentWhen || 'No context';
            }

            if (statusBox) {
                statusBox.style.display = 'none';
                statusBox.innerHTML = '';
            }

            setTimeout(focusShorthandIfNoActiveFocus, 50);
        } else if (message.type === 'viewstateChanged') {
            if (message.active) {
                focusShorthandIfNoActiveFocus();
            }
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

    if (btnDone) {
        btnDone.addEventListener('click', () => {
            vscode.postMessage({
                command: 'done',
                modified: hasBindingChanged()
            });
        });
    }

    // Row 1 (Current) Action Handlers
    btnEditJson.addEventListener('click', () => {
        vscode.postMessage({
            command: 'editJson',
            newInstance: false,
            nativeKey: window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.initialNativeKey : '',
            when: window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.whenClause : ''
        });
    });

    btnEditJsonNewInst.addEventListener('click', () => {
        vscode.postMessage({
            command: 'editJson',
            newInstance: true,
            nativeKey: window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.initialNativeKey : '',
            when: window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.whenClause : ''
        });
    });

    btnKbUiCmd.addEventListener('click', () => {
        const cmd = window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '';
        vscode.postMessage({ command: 'openKeybindings', newInstance: false, commandName: 'workbench.action.openGlobalKeybindings', args: [cmd] });
    });

    btnKbUiCmdNewInst.addEventListener('click', () => {
        const cmd = window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '';
        vscode.postMessage({ command: 'openKeybindings', newInstance: true, commandName: 'workbench.action.openGlobalKeybindings', args: [cmd] });
    });

    btnKbUiKey.addEventListener('click', () => {
        const key = window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.initialNativeKey : '';
        vscode.postMessage({ command: 'openKeybindings', newInstance: false, commandName: 'workbench.action.openGlobalKeybindings', args: ['"' + key + '"'] });
    });

    btnKbUiKeyNewInst.addEventListener('click', () => {
        const key = window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.initialNativeKey : '';
        vscode.postMessage({ command: 'openKeybindings', newInstance: true, commandName: 'workbench.action.openGlobalKeybindings', args: ['"' + key + '"'] });
    });

    btnKbUiUser.addEventListener('click', () => {
        vscode.postMessage({ command: 'openKeybindings', newInstance: false, commandName: 'workbench.action.openGlobalKeybindings', args: ['@source:user'] });
    });

    btnKbUiUserNewInst.addEventListener('click', () => {
        vscode.postMessage({ command: 'openKeybindings', newInstance: true, commandName: 'workbench.action.openGlobalKeybindings', args: ['@source:user'] });
    });

    btnKbUiDefault.addEventListener('click', () => {
        vscode.postMessage({ command: 'openKeybindings', newInstance: false, commandName: 'workbench.action.openGlobalKeybindings', args: ['@source:default'] });
    });

    btnKbUiDefaultNewInst.addEventListener('click', () => {
        vscode.postMessage({ command: 'openKeybindings', newInstance: true, commandName: 'workbench.action.openGlobalKeybindings', args: ['@source:default'] });
    });

    btnKbUiExtension.addEventListener('click', () => {
        vscode.postMessage({ command: 'openKeybindings', newInstance: false, commandName: 'workbench.action.openGlobalKeybindings', args: ['@source:extension'] });
    });

    btnKbUiExtensionNewInst.addEventListener('click', () => {
        vscode.postMessage({ command: 'openKeybindings', newInstance: true, commandName: 'workbench.action.openGlobalKeybindings', args: ['@source:extension'] });
    });

    btnKbUiExt.addEventListener('click', () => {
        const commandId = window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '';
        let targetExtensionId = '';
        const dotIndex = commandId.indexOf('.');
        if (dotIndex !== -1) {
            targetExtensionId = commandId.substring(0, dotIndex);
        }
        vscode.postMessage({ command: 'openKeybindings', newInstance: false, commandName: 'workbench.action.openGlobalKeybindings', args: ['@ext:' + targetExtensionId] });
    });

    btnKbUiExtNewInst.addEventListener('click', () => {
        const commandId = window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '';
        let targetExtensionId = '';
        const dotIndex = commandId.indexOf('.');
        if (dotIndex !== -1) {
            targetExtensionId = commandId.substring(0, dotIndex);
        }
        vscode.postMessage({ command: 'openKeybindings', newInstance: true, commandName: 'workbench.action.openGlobalKeybindings', args: ['@ext:' + targetExtensionId] });
    });


    // Row 2 (New) Action Handlers
    btnEditJsonNew.addEventListener('click', () => {
        vscode.postMessage({
            command: 'editJson',
            newInstance: false,
            nativeKey: lastValidatedNativeKey,
            when: whenInput.value
        });
    });

    btnEditJsonNewNewInst.addEventListener('click', () => {
        vscode.postMessage({
            command: 'editJson',
            newInstance: true,
            nativeKey: lastValidatedNativeKey,
            when: whenInput.value
        });
    });

    btnKbUiCmdNew.addEventListener('click', () => {
        const cmd = window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '';
        vscode.postMessage({ command: 'openKeybindings', newInstance: false, commandName: 'workbench.action.openGlobalKeybindings', args: [cmd] });
    });

    btnKbUiCmdNewNewInst.addEventListener('click', () => {
        const cmd = window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '';
        vscode.postMessage({ command: 'openKeybindings', newInstance: true, commandName: 'workbench.action.openGlobalKeybindings', args: [cmd] });
    });

    btnKbUiKeyNew.addEventListener('click', () => {
        vscode.postMessage({ command: 'openKeybindings', newInstance: false, commandName: 'workbench.action.openGlobalKeybindings', args: ['"' + (lastValidatedNativeKey || '') + '"'] });
    });

    btnKbUiKeyNewNewInst.addEventListener('click', () => {
        vscode.postMessage({ command: 'openKeybindings', newInstance: true, commandName: 'workbench.action.openGlobalKeybindings', args: ['"' + (lastValidatedNativeKey || '') + '"'] });
    });

    btnKbUiUserNew.addEventListener('click', () => {
        vscode.postMessage({ command: 'openKeybindings', newInstance: false, commandName: 'workbench.action.openGlobalKeybindings', args: ['@source:user'] });
    });

    btnKbUiUserNewNewInst.addEventListener('click', () => {
        vscode.postMessage({ command: 'openKeybindings', newInstance: true, commandName: 'workbench.action.openGlobalKeybindings', args: ['@source:user'] });
    });

    btnKbUiDefaultNew.addEventListener('click', () => {
        vscode.postMessage({ command: 'openKeybindings', newInstance: false, commandName: 'workbench.action.openGlobalKeybindings', args: ['@source:default'] });
    });

    btnKbUiDefaultNewNewInst.addEventListener('click', () => {
        vscode.postMessage({ command: 'openKeybindings', newInstance: true, commandName: 'workbench.action.openGlobalKeybindings', args: ['@source:default'] });
    });

    btnKbUiExtensionNew.addEventListener('click', () => {
        vscode.postMessage({ command: 'openKeybindings', newInstance: false, commandName: 'workbench.action.openGlobalKeybindings', args: ['@source:extension'] });
    });

    btnKbUiExtensionNewNewInst.addEventListener('click', () => {
        vscode.postMessage({ command: 'openKeybindings', newInstance: true, commandName: 'workbench.action.openGlobalKeybindings', args: ['@source:extension'] });
    });

    btnKbUiExtNew.addEventListener('click', () => {
        const commandId = window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '';
        let targetExtensionId = '';
        const dotIndex = commandId.indexOf('.');
        if (dotIndex !== -1) {
            targetExtensionId = commandId.substring(0, dotIndex);
        }
        vscode.postMessage({ command: 'openKeybindings', newInstance: false, commandName: 'workbench.action.openGlobalKeybindings', args: ['@ext:' + targetExtensionId] });
    });

    btnKbUiExtNewNewInst.addEventListener('click', () => {
        const commandId = window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '';
        let targetExtensionId = '';
        const dotIndex = commandId.indexOf('.');
        if (dotIndex !== -1) {
            targetExtensionId = commandId.substring(0, dotIndex);
        }
        vscode.postMessage({ command: 'openKeybindings', newInstance: true, commandName: 'workbench.action.openGlobalKeybindings', args: ['@ext:' + targetExtensionId] });
    });


    if (btnCopyCurrentBinding) {
        btnCopyCurrentBinding.addEventListener('click', () => {
            vscode.postMessage({
                command: 'copyBinding',
                value: JSON.stringify({
                    key: window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.initialNativeKey : '',
                    command: window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '',
                    when: window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.whenClause : ''
                }, null, 4)
            });
        });
    }

    if (btnCopyNewBinding) {
        btnCopyNewBinding.addEventListener('click', () => {
            vscode.postMessage({
                command: 'copyBinding',
                value: JSON.stringify({
                    key: lastValidatedNativeKey || '',
                    command: window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '',
                    when: whenInput.value
                }, null, 4)
            });
        });
    }

    if (btnEditInstigator) {
        btnEditInstigator.addEventListener('click', () => {
            vscode.postMessage({
                command: 'launchCollisionUI',
                commandId: 'ce-command-picker.show'
            });
        });
    }

    const btnEditPickerJson = document.getElementById('btnEditPickerJson');
    if (btnEditPickerJson) {
        btnEditPickerJson.addEventListener('click', () => {
            vscode.postMessage({
                command: 'editJson',
                newInstance: false,
                commandId: 'ce-command-picker.show'
            });
        });
    }

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

    if (btnResetKey1) {
        btnResetKey1.addEventListener('click', () => {
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
            isSynchronizing = false;
            triggerValidation(true);
        });
    }

    if (btnResetKey2) {
        btnResetKey2.addEventListener('click', () => {
            if (!window.CE_INITIAL_STATE) return;
            isSynchronizing = true;
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
            isSynchronizing = false;
            triggerValidation(true);
        });
    }

    document.addEventListener('change', (e) => {
        if (e.target && e.target.name === 'preferredFormat') {
            const preferred = e.target.value;
            if (preferred === 'shortcode') {
                if (lastValidatedShortCode) {
                    fullShorthandInput.value = lastValidatedShortCode;
                } else {
                    fullShorthandInput.value = getFullShorthand();
                }
            } else if (preferred === 'native') {
                if (lastValidatedNativeKey) {
                    fullShorthandInput.value = lastValidatedNativeKey;
                }
            }
        }
    });

    fullShorthandInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const preferredEl = document.querySelector('input[name="preferredFormat"]:checked');
            const preferred = preferredEl ? preferredEl.value : 'shortcode';
            if (preferred === 'shortcode' && lastValidatedShortCode) {
                fullShorthandInput.value = lastValidatedShortCode;
                syncFromFullShorthand();
            } else if (preferred === 'native' && lastValidatedNativeKey) {
                fullShorthandInput.value = lastValidatedNativeKey;
                if (lastValidatedShortCode) {
                    isSynchronizing = true;
                    parseAndPopulateShorthand(lastValidatedShortCode);
                    isSynchronizing = false;
                }
            }
        }
    });

    let lastFocusedElement = null;
    document.addEventListener('focusin', (e) => {
        if (e.target && e.target.tagName && e.target !== document.body) {
            lastFocusedElement = e.target;
        }
    });

    function focusShorthandIfNoActiveFocus() {
        if (!fullShorthandInput) return;
        const active = document.activeElement;
        const hasRealFocus = active && active !== document.body && (active.tagName === 'INPUT' || active.tagName === 'SELECT' || active.tagName === 'TEXTAREA' || active.tagName === 'BUTTON');
        
        if (!hasRealFocus) {
            if (lastFocusedElement && lastFocusedElement !== document.body && document.body.contains(lastFocusedElement)) {
                lastFocusedElement.focus();
                if (typeof lastFocusedElement.select === 'function') {
                    lastFocusedElement.select();
                }
            } else {
                fullShorthandInput.focus();
                fullShorthandInput.select();
            }
        }
    }

    if (window.CE_INITIAL_STATE) {
        resetToInitial();
        const container = document.getElementById('currentKeysContainer');
        if (container) {
            container.innerHTML = formatCurrentKeysJS(window.CE_INITIAL_STATE.currentKeys || 'None');
        }
        if (currentWhenClauseLabel) currentWhenClauseLabel.textContent = window.CE_INITIAL_STATE.currentWhen || 'No context';
    }

    // Execute Command Button click listener
    const btnExecuteCommand = document.getElementById('btnExecuteCommand');
    if (btnExecuteCommand) {
        btnExecuteCommand.addEventListener('click', () => {
            const cmd = window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '';
            if (!cmd) return;
            vscode.postMessage({
                command: 'executeCommand',
                commandName: cmd
            });
        });
    }

    // Preferred direction checkbox management (mutually exclusive)
    const prefDirCheckboxes = document.querySelectorAll('.pref-dir-chk');
    prefDirCheckboxes.forEach(chk => {
        chk.addEventListener('change', (e) => {
            if (e.target.checked) {
                prefDirCheckboxes.forEach(other => {
                    if (other !== e.target) other.checked = false;
                });
            } else {
                const anyChecked = Array.from(prefDirCheckboxes).some(c => c.checked);
                if (!anyChecked) {
                    document.getElementById('prefDirRight').checked = true;
                }
            }
        });
    });

    function getPreferredDirection() {
        const checked = document.querySelector('.pref-dir-chk:checked');
        return checked ? checked.value : 'right';
    }

    // Intercept postMessage to auto-inject preferredDirection for openKeybindings and editJson commands
    const originalPostMessage = vscode.postMessage;
    vscode.postMessage = function(msg) {
        if (msg && (msg.command === 'openKeybindings' || msg.command === 'editJson')) {
            msg.preferredDirection = getPreferredDirection();
        }
        originalPostMessage.call(vscode, msg);
    };

    // Command Queue list renderer
    function renderQueueList() {
        const queueList = document.getElementById('queueList');
        const finder = document.getElementById('queueFinderInput');
        const countLabel = document.getElementById('queueCountLabel');
        if (!queueList) return;

        const originalArgs = window.CE_ORIGINAL_ARGS || [];
        const checkedOff = window.CE_CHECKED_OFF_COMMANDS || [];
        const currentCmdId = window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '';
        const filterText = finder ? finder.value.toLowerCase().trim() : '';

        queueList.innerHTML = '';
        let matchCount = 0;

        originalArgs.forEach((cmdId, idx) => {
            if (filterText && !cmdId.toLowerCase().includes(filterText)) {
                return;
            }
            matchCount++;

            const isCurrent = (cmdId === currentCmdId);
            const isChecked = checkedOff.includes(cmdId);

            const itemEl = document.createElement('div');
            itemEl.className = 'queue-item' + (isCurrent ? ' active' : '');
            
            // Apply queue-item styling programmatically
            itemEl.style.display = 'flex';
            itemEl.style.alignItems = 'center';
            itemEl.style.justifyContent = 'space-between';
            itemEl.style.padding = isCurrent ? '6px 12px 6px 9px' : '6px 12px';
            itemEl.style.cursor = 'pointer';
            itemEl.style.borderBottom = '1px solid rgba(255, 255, 255, 0.02)';
            itemEl.style.fontFamily = 'var(--vscode-editor-font-family, monospace)';
            itemEl.style.fontSize = '0.9em';
            itemEl.style.userSelect = 'none';
            if (isCurrent) {
                itemEl.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                itemEl.style.borderLeft = '3px solid var(--vscode-focusBorder)';
            }

            // Hover effect
            itemEl.addEventListener('mouseenter', () => {
                if (!isCurrent) {
                    itemEl.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                }
            });
            itemEl.addEventListener('mouseleave', () => {
                if (!isCurrent) {
                    itemEl.style.backgroundColor = 'transparent';
                }
            });

            const leftDiv = document.createElement('div');
            leftDiv.style.display = 'flex';
            leftDiv.style.alignItems = 'center';
            leftDiv.style.gap = '8px';
            leftDiv.style.flexGrow = '1';
            leftDiv.style.minWidth = '0';

            const chk = document.createElement('input');
            chk.type = 'checkbox';
            chk.className = 'queue-item-check';
            chk.checked = isChecked;
            chk.style.cursor = 'pointer';
            chk.style.margin = '0';
            chk.style.flexShrink = '0';
            chk.addEventListener('click', (e) => {
                e.stopPropagation();
            });
            chk.addEventListener('change', (e) => {
                const checked = e.target.checked;
                const targetCmd = cmdId;
                const currentCheckedOff = window.CE_CHECKED_OFF_COMMANDS || [];

                if (checked) {
                    if (!currentCheckedOff.includes(targetCmd)) {
                        currentCheckedOff.push(targetCmd);
                    }
                } else {
                    const cIdx = currentCheckedOff.indexOf(targetCmd);
                    if (cIdx !== -1) {
                        currentCheckedOff.splice(cIdx, 1);
                    }
                }
                window.CE_CHECKED_OFF_COMMANDS = currentCheckedOff;
                
                if (targetCmd === (window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '')) {
                    const mainCheckoff = document.getElementById('chkCheckoff');
                    if (mainCheckoff) mainCheckoff.checked = checked;
                }
                
                updateCheckoffUI();
                renderQueueList();

                vscode.postMessage({
                    command: 'toggleCheckoff',
                    commandId: targetCmd,
                    checked: checked
                });
            });

            const arrowSpan = document.createElement('span');
            arrowSpan.textContent = '➤';
            arrowSpan.style.color = isCurrent ? 'var(--vscode-focusBorder)' : 'rgba(255, 255, 255, 0.4)';
            arrowSpan.style.marginRight = '2px';
            arrowSpan.style.flexShrink = '0';

            const txt = document.createElement('span');
            txt.className = 'queue-item-text';
            txt.textContent = cmdId;
            txt.style.overflow = 'hidden';
            txt.style.textOverflow = 'ellipsis';
            txt.style.whiteSpace = 'nowrap';
            txt.style.color = 'var(--vscode-editor-foreground)';
            txt.style.opacity = '1';
            if (isCurrent) {
                txt.style.fontWeight = 'bold';
                txt.style.color = 'var(--vscode-focusBorder)';
            }

            leftDiv.appendChild(chk);
            leftDiv.appendChild(arrowSpan);
            leftDiv.appendChild(txt);
            itemEl.appendChild(leftDiv);

            // Add shortcodes for keybindings in Navigation Items
            const bindingsMap = window.CE_COMMAND_BINDINGS || {};
            const shortcutStr = bindingsMap[cmdId] || '';
            if (shortcutStr) {
                const shortcutSpan = document.createElement('span');
                shortcutSpan.textContent = shortcutStr;
                shortcutSpan.style.marginLeft = 'auto';
                shortcutSpan.style.marginRight = '12px';
                shortcutSpan.style.padding = '2px 6px';
                shortcutSpan.style.background = 'rgba(255, 255, 255, 0.05)';
                shortcutSpan.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                shortcutSpan.style.borderRadius = '3px';
                shortcutSpan.style.fontSize = '0.8em';
                shortcutSpan.style.fontFamily = 'monospace';
                shortcutSpan.style.color = 'var(--vscode-editor-foreground)';
                shortcutSpan.style.opacity = '1';
                shortcutSpan.style.flexShrink = '0';
                itemEl.appendChild(shortcutSpan);
            }

            if (isCurrent) {
                const badge = document.createElement('span');
                badge.style.fontSize = '0.8em';
                badge.style.padding = '2px 6px';
                badge.style.background = 'rgba(255, 255, 255, 0.1)';
                badge.style.borderRadius = '3px';
                badge.style.fontWeight = 'bold';
                badge.style.marginLeft = shortcutStr ? '0px' : '8px';
                badge.style.flexShrink = '0';
                badge.textContent = 'ACTIVE';
                itemEl.appendChild(badge);
            }

            itemEl.addEventListener('click', () => {
                if (!isCurrent) {
                    pageTo(idx);
                }
            });

            queueList.appendChild(itemEl);
        });

        if (countLabel) {
            countLabel.textContent = matchCount + ' of ' + originalArgs.length + ' shown';
        }
    }

    const queueFinderInput = document.getElementById('queueFinderInput');
    if (queueFinderInput) {
        queueFinderInput.addEventListener('input', () => {
            renderQueueList();
        });
    }

    // Wrap the existing updateCheckoffUI to also trigger renderQueueList
    const originalUpdateCheckoffUI = updateCheckoffUI;
    updateCheckoffUI = function() {
        originalUpdateCheckoffUI();
        renderQueueList();
    };

    // Hotkeys setup
    window.addEventListener('keydown', (e) => {
        if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
            const key = e.key.toLowerCase();
            if (key === 'x') {
                e.preventDefault();
                e.stopPropagation();
                const btnExec = document.getElementById('btnExecuteCommand');
                if (btnExec) btnExec.click();
            } else if (key === 'k') {
                e.preventDefault();
                e.stopPropagation();
                if (fullShorthandInput) {
                    fullShorthandInput.focus();
                    fullShorthandInput.select();
                }
            } else if (e.key === '.' || key === '>') {
                e.preventDefault();
                e.stopPropagation();
                const btnNext = document.getElementById('btnPageNext');
                if (btnNext && !btnNext.disabled) btnNext.click();
            } else if (e.key === ',' || key === '<') {
                e.preventDefault();
                e.stopPropagation();
                const btnPrev = document.getElementById('btnPagePrev');
                if (btnPrev && !btnPrev.disabled) btnPrev.click();
            }
        }
    });

    // Set focus on first load
    setTimeout(focusShorthandIfNoActiveFocus, 100);

    // Also set focus when the window gets focus
    window.addEventListener('focus', focusShorthandIfNoActiveFocus);

    // Collapsible Keys Panel toggle
    const btnToggleKeys = document.getElementById('btnToggleKeys');
    const keysContent = document.getElementById('keysContent');
    const keysToggleArrow = document.getElementById('keysToggleArrow');
    if (btnToggleKeys && keysContent) {
        btnToggleKeys.addEventListener('click', () => {
            keysContent.classList.toggle('collapsed');
            if (keysContent.classList.contains('collapsed')) {
                keysToggleArrow.textContent = '▶';
            } else {
                keysToggleArrow.textContent = '▼';
            }
        });
    }

    // Render queue initially
    setTimeout(renderQueueList, 200);
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

        /* Transition for very dark orange background on changed state */
        body {
            transition: background-color 0.4s ease-in-out;
        }
        body.changed-state {
            background-color: #240d00 !important;
        }

        /* Colored Buttons with Borders and Black Background */
        .custom-btn {
            background-color: #000000 !important;
            border-style: solid !important;
            border-width: 1.5px !important;
            font-weight: bold !important;
            cursor: pointer !important;
            transition: all 0.2s ease-in-out !important;
            opacity: 0.75 !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            border-radius: 4px !important;
        }
        .custom-btn:hover:not(:disabled) {
            opacity: 1.0 !important;
            box-shadow: 0 0 10px currentColor !important;
            filter: brightness(1.2) !important;
        }
        .custom-btn:active:not(:disabled) {
            transform: scale(0.95) !important;
            box-shadow: 0 0 16px currentColor !important;
            filter: brightness(1.4) !important;
            opacity: 1.0 !important;
        }
        .custom-btn:disabled {
            opacity: 0.3 !important;
            cursor: not-allowed !important;
            box-shadow: none !important;
        }
        
        .btn-red {
            border-color: #ff4a4a !important;
            color: #ff4a4a !important;
        }
        .btn-blue {
            border-color: #3b82f6 !important;
            color: #3b82f6 !important;
        }
        .btn-green {
            border-color: #10b981 !important;
            color: #10b981 !important;
        }
        .btn-yellow {
            border-color: #eab308 !important;
            color: #eab308 !important;
        }
        .btn-orange {
            border-color: #f97316 !important;
            color: #f97316 !important;
        }
        .btn-cyan {
            border-color: #06b6d4 !important;
            color: #06b6d4 !important;
        }
        .btn-purple {
            border-color: #a855f7 !important;
            color: #a855f7 !important;
        }
        
        #statusBox {
            padding: 10px 14px;
            border-radius: 4px;
            font-size: 0.95em;
            margin: 8px 0;
            line-height: 1.4;
        }

        /* Collapsible keys panel container */
        .collapsible-container {
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 6px;
            background: rgba(255, 255, 255, 0.01);
            overflow: hidden;
            margin-bottom: 12px;
        }
        .collapsible-header {
            background: rgba(255, 255, 255, 0.04);
            padding: 10px 16px;
            font-weight: bold;
            font-size: 1.05em;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            transition: background 0.2s ease;
        }
        .collapsible-header:hover {
            background: rgba(255, 255, 255, 0.08);
        }
        .collapsible-content {
            padding: 16px;
            display: block;
        }
        .collapsible-content.collapsed {
            display: none;
        }
    </style>
</head>
<body>
    <div class="current-info-container">
        <div style="font-weight: bold; font-size: 1.1em; margin-bottom: 2px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
            <span style="display: flex; align-items: center; gap: 8px;">
                <button type="button" class="secondary small" id="btnExecuteCommand" title="Execute Command in VS Code (Alt+X)" style="padding: 2px 4px; font-size: 0.9em; display: inline-flex; align-items: center; justify-content: center; margin-right: 2px;">⚡ E<u>x</u>ecute</button>
                <button type="button" class="secondary small" id="btnCopyCommand" title="Copy Command ID" style="padding: 2px 4px; font-size: 0.9em; display: inline-flex; align-items: center; justify-content: center;">📋</button>
                <span id="cmdTitleLabel">Command: ` + (title || '') + `</span>
            </span>
            <span id="changedIndicator" style="display: none; background: #f97316; color: #ffffff; padding: 2px 8px; border-radius: 3px; font-size: 0.85em; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; align-items: center; gap: 4px;">⚠️ Changed</span>
        </div>
        <!-- Checkoff Row -->
        <div style="margin-top: 6px; display: flex; align-items: center; gap: 8px;">
            <label style="display: inline-flex; align-items: center; gap: 6px; font-weight: 500; cursor: pointer; font-size: 0.95em;">
                <input type="checkbox" id="chkCheckoff" style="cursor: pointer; margin: 0;"> Checkoff
            </label>
            <span id="lblCheckoffCount" style="opacity: 0.85; font-size: 0.9em; font-weight: 500; margin-left: 4px;">0 of 0</span>
        </div>

        <!-- Copy Binding, Edit Instigator Row -->
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 8px; margin-bottom: 8px; flex-wrap: wrap;">
            <div style="display: flex; gap: 6px; align-items: center; flex-grow: 1; min-width: 180px;">
                <button type="button" class="secondary small" id="btnCopyCurrentBinding" title="Copy Current Binding JSON" style="font-weight: 500; padding: 4px 8px; flex-grow: 1; text-align: center;">Copy Current Binding</button>
                <button type="button" class="secondary small" id="btnCopyNewBinding" title="Copy New Binding JSON" style="font-weight: 500; padding: 4px 8px; flex-grow: 1; text-align: center;">Copy New Binding</button>
                <button type="button" class="secondary small" id="btnEditInstigator" title="Edit the keybinding for ce-command-picker.show (the command that instigated the Menu)" style="font-weight: 500; padding: 4px 8px; flex-grow: 1; text-align: center;">Edit Picker Key</button>
                <button type="button" class="secondary small" id="btnEditPickerJson" title="Find and edit the keybindings.json entry for ce-command-picker.show" style="font-weight: 500; padding: 4px 8px; flex-grow: 1; text-align: center;">Edit Picker Json</button>
            </div>
        </div>
        <div id="currentKeysContainer">` + formatCurrentKeys(currentKeys) + `</div>
        <div><span style="opacity: 0.7;">Current When:</span> <strong id="currentWhenClauseLabel">` + (currentWhen || 'No context') + `</strong></div>
        <div style="margin-top: 8px; display: flex; align-items: center; gap: 8px;">
            <span style="display: inline-flex; align-items: center; gap: 6px;">
                <button type="button" class="secondary small" id="btnCopyKey" title="Copy Shorthand Key" style="padding: 2px 4px; font-size: 0.9em; display: inline-flex; align-items: center; justify-content: center;">📋</button>
                <span style="opacity: 0.85; font-weight: bold;"><u style="text-decoration: underline;">K</u>ey:</span>
            </span>
            <input type="text" id="fullShorthandInput" placeholder="e.g., INS.a E" title="Editable full binding in cas shorthand format (e.g., INS.a E). Modifying this field instantly parses and populates the individual key controls below, and vice versa." style="flex-grow: 1;">
            <button type="button" class="secondary small" id="btnResetHeader" title="Discard current unsaved changes and reset the entire form and validation state back to the original values." style="padding: 4px 8px; font-size: 0.85em; font-weight: 500;">Reset</button>
        </div>
        <div id="statusBox" style="display: none; margin-top: 8px;"></div>
    </div>
    
    <!-- Collapsible Keys Panel Container -->
    <div class="collapsible-container">
        <div class="collapsible-header" id="btnToggleKeys" title="Click to collapse/expand Keys configurations">
            <span>Keys</span>
            <span id="keysToggleArrow">▼</span>
        </div>
        <div class="collapsible-content" id="keysContent">
            <div class="chords-grid">
                <!-- Chord 1 Panel -->
                <div class="chord-panel">
                    <div class="chord-header">
                        <span>Key 1 (Main Chord)</span>
                        <span style="display: inline-flex; gap: 4px;">
                            <button type="button" class="secondary small" id="btnResetKey1" title="Reset this key combination to its original assigned value.">Reset</button>
                            <button type="button" class="custom-btn btn-red small" id="btnClear1" title="Clear the Base Key, modifier checkboxes, and shortcode box for the primary chord.">Clear</button>
                        </span>
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
                        <span style="display: inline-flex; gap: 4px;">
                            <button type="button" class="secondary small" id="btnResetKey2" title="Reset this key combination to its original assigned value.">Reset</button>
                            <button type="button" class="custom-btn btn-red small" id="btnClear2" title="Clear the Base Key, modifier checkboxes, and shortcode box for the secondary optional chord.">Clear</button>
                        </span>
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
        </div>
    </div>

    <div class="form-group" style="margin-top: 8px;">
        <label for="whenClause" style="font-weight: 500;">When</label>
        <input type="text" id="whenClause" placeholder="e.g., editorTextFocus" title="Specifies the context condition when the keybinding is active (e.g., editorTextFocus, terminalFocus).">
    </div>

    <div class="actions-group">
        <!-- Preferred Direction Row -->
        <div class="helper-row" style="margin-bottom: 12px; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 10px;">
            <span class="helper-row-label" style="width: auto; margin-right: 12px; font-weight: bold; font-size: 0.9em; opacity: 0.85;">Preferred Direction:</span>
            <div style="display: flex; gap: 12px; align-items: center;">
                <label class="checkbox-item" style="font-size: 0.9em; gap: 4px; cursor: pointer; display: inline-flex; align-items: center;" title="Open split editor above (Up)">
                    <input type="checkbox" id="prefDirUp" class="pref-dir-chk" value="up" style="margin: 0;"> Up
                </label>
                <label class="checkbox-item" style="font-size: 0.9em; gap: 4px; cursor: pointer; display: inline-flex; align-items: center;" title="Open split editor below (Down)">
                    <input type="checkbox" id="prefDirDown" class="pref-dir-chk" value="down" style="margin: 0;"> Down
                </label>
                <label class="checkbox-item" style="font-size: 0.9em; gap: 4px; cursor: pointer; display: inline-flex; align-items: center;" title="Open split editor on the left (Left)">
                    <input type="checkbox" id="prefDirLeft" class="pref-dir-chk" value="left" style="margin: 0;"> Left
                </label>
                <label class="checkbox-item" style="font-size: 0.9em; gap: 4px; cursor: pointer; display: inline-flex; align-items: center;" title="Open split editor on the right (Right)">
                    <input type="checkbox" id="prefDirRight" class="pref-dir-chk" value="right" checked style="margin: 0;"> Right
                </label>
            </div>
        </div>

        <!-- Row 1: Current Helpers (Reordered & Color-coded) -->
        <div class="helper-row" style="margin-bottom: 8px;">
            <span class="helper-row-label">Current:</span>
            <div class="helper-buttons" style="display: flex; gap: 4px; align-items: center; flex-wrap: wrap;">
                <!-- Edit Json (cyan) -->
                <span style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.03); border-radius: 4px; padding: 2px;">
                    <button type="button" class="custom-btn btn-cyan small" id="btnEditJsonNewInst" title="Open Edit Json as a new instance in a new group" style="padding: 2px 4px; border-radius: 3px; font-size: 0.9em; margin-right: 2px;">➕</button>
                    <button type="button" class="custom-btn btn-cyan small" id="btnEditJson" title="Open the user keybindings.json configuration file and highlight the exact location of the current active binding record in another group." style="padding: 2px 6px; border-radius: 3px; font-size: 0.85em;">Edit Json</button>
                </span>
                <!-- KB UI Cmd (red) -->
                <span style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.03); border-radius: 4px; padding: 2px;">
                    <button type="button" class="custom-btn btn-red small" id="btnKbUiCmdNewInst" title="Open Keyboard Shortcuts for command as a new instance" style="padding: 2px 4px; border-radius: 3px; font-size: 0.9em; margin-right: 2px;">➕</button>
                    <button type="button" class="custom-btn btn-red small" id="btnKbUiCmd" title="Open the native VS Code Keyboard Shortcuts panel with a search filter focused specifically on the command ID of this action in another group." style="padding: 2px 6px; border-radius: 3px; font-size: 0.85em;">KB UI Cmd</button>
                </span>
                <!-- KB UI Key (blue) -->
                <span style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.03); border-radius: 4px; padding: 2px;">
                    <button type="button" class="custom-btn btn-blue small" id="btnKbUiKeyNewInst" title="Open Keyboard Shortcuts for key as a new instance" style="padding: 2px 4px; border-radius: 3px; font-size: 0.9em; margin-right: 2px;">➕</button>
                    <button type="button" class="custom-btn btn-blue small" id="btnKbUiKey" title="Open the native VS Code Keyboard Shortcuts panel pre-filtered for the current keyboard shortcut assignment in another group." style="padding: 2px 6px; border-radius: 3px; font-size: 0.85em;">KB UI Key</button>
                </span>
                <!-- KB UI Ext (green) -->
                <span style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.03); border-radius: 4px; padding: 2px;">
                    <button type="button" class="custom-btn btn-green small" id="btnKbUiExtNewInst" title="Open extension-specific keybindings as a new instance" style="padding: 2px 4px; border-radius: 3px; font-size: 0.9em; margin-right: 2px;">➕</button>
                    <button type="button" class="custom-btn btn-green small" id="btnKbUiExt" title="Open the native VS Code Keyboard Shortcuts panel showing only the keybindings contributed by the extension namespace of this command in another group." style="padding: 2px 6px; border-radius: 3px; font-size: 0.85em;">KB UI Ext</button>
                </span>
                <!-- KB UI Default (yellow) -->
                <span style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.03); border-radius: 4px; padding: 2px;">
                    <button type="button" class="custom-btn btn-yellow small" id="btnKbUiDefaultNewInst" title="Open default built-in keybindings as a new instance" style="padding: 2px 4px; border-radius: 3px; font-size: 0.9em; margin-right: 2px;">➕</button>
                    <button type="button" class="custom-btn btn-yellow small" id="btnKbUiDefault" title="Open the native VS Code Keyboard Shortcuts panel displaying all default built-in keybindings in another group." style="padding: 2px 6px; border-radius: 3px; font-size: 0.85em;">KB UI Default</button>
                </span>
                <!-- KB UI Extension (orange) -->
                <span style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.03); border-radius: 4px; padding: 2px;">
                    <button type="button" class="custom-btn btn-orange small" id="btnKbUiExtensionNewInst" title="Open extension keybindings as a new instance" style="padding: 2px 4px; border-radius: 3px; font-size: 0.9em; margin-right: 2px;">➕</button>
                    <button type="button" class="custom-btn btn-orange small" id="btnKbUiExtension" title="Open the native VS Code Keyboard Shortcuts panel filtering to show keybindings contributed by extensions in another group." style="padding: 2px 6px; border-radius: 3px; font-size: 0.85em;">KB UI Extension</button>
                </span>
                <!-- KB UI User (secondary) -->
                <span style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.03); border-radius: 4px; padding: 2px;">
                    <button type="button" class="secondary small" id="btnKbUiUserNewInst" title="Open custom User keybindings as a new instance" style="padding: 2px 4px; border-radius: 3px; font-size: 0.9em; margin-right: 2px;">➕</button>
                    <button type="button" class="secondary small" id="btnKbUiUser" title="Open the native VS Code Keyboard Shortcuts panel displaying only your custom user-configured keybindings in another group." style="padding: 2px 6px; border-radius: 3px; font-size: 0.85em;">KB UI User</button>
                </span>
            </div>
        </div>

        <!-- Row 2: New Helpers (Reordered & Color-coded) -->
        <div class="helper-row" style="margin-bottom: 8px;">
            <span class="helper-row-label">New:</span>
            <div class="helper-buttons" style="display: flex; gap: 4px; align-items: center; flex-wrap: wrap;">
                <!-- Edit Json (cyan) -->
                <span style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.03); border-radius: 4px; padding: 2px;">
                    <button type="button" class="custom-btn btn-cyan small" id="btnEditJsonNewNewInst" title="Open Edit Json as a new instance in a new group" style="padding: 2px 4px; border-radius: 3px; font-size: 0.9em; margin-right: 2px;">➕</button>
                    <button type="button" class="custom-btn btn-cyan small" id="btnEditJsonNew" title="Open keybindings.json file and look up or highlight entries matching the newly configured key combination and context in another group." style="padding: 2px 6px; border-radius: 3px; font-size: 0.85em;">Edit Json</button>
                </span>
                <!-- KB UI Cmd (red) -->
                <span style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.03); border-radius: 4px; padding: 2px;">
                    <button type="button" class="custom-btn btn-red small" id="btnKbUiCmdNewNewInst" title="Open Keyboard Shortcuts for command as a new instance" style="padding: 2px 4px; border-radius: 3px; font-size: 0.9em; margin-right: 2px;">➕</button>
                    <button type="button" class="custom-btn btn-red small" id="btnKbUiCmdNew" title="Open the native VS Code Keyboard Shortcuts panel filtering specifically for this action's command in another group." style="padding: 2px 6px; border-radius: 3px; font-size: 0.85em;">KB UI Cmd</button>
                </span>
                <!-- KB UI Key (blue) -->
                <span style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.03); border-radius: 4px; padding: 2px;">
                    <button type="button" class="custom-btn btn-blue small" id="btnKbUiKeyNewNewInst" title="Open Keyboard Shortcuts for new key as a new instance" style="padding: 2px 4px; border-radius: 3px; font-size: 0.9em; margin-right: 2px;">➕</button>
                    <button type="button" class="custom-btn btn-blue small" id="btnKbUiKeyNew" title="Open the native VS Code Keyboard Shortcuts panel with search pre-filled for the new key combination typed in the form in another group." style="padding: 2px 6px; border-radius: 3px; font-size: 0.85em;">KB UI Key</button>
                </span>
                <!-- KB UI Ext (green) -->
                <span style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.03); border-radius: 4px; padding: 2px;">
                    <button type="button" class="custom-btn btn-green small" id="btnKbUiExtNewNewInst" title="Open extension-specific keybindings as a new instance" style="padding: 2px 4px; border-radius: 3px; font-size: 0.9em; margin-right: 2px;">➕</button>
                    <button type="button" class="custom-btn btn-green small" id="btnKbUiExtNew" title="Open the native VS Code Keyboard Shortcuts panel filtered specifically to the extension package that contributes this command in another group." style="padding: 2px 6px; border-radius: 3px; font-size: 0.85em;">KB UI Ext</button>
                </span>
                <!-- KB UI Default (yellow) -->
                <span style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.03); border-radius: 4px; padding: 2px;">
                    <button type="button" class="custom-btn btn-yellow small" id="btnKbUiDefaultNewNewInst" title="Open default built-in keybindings as a new instance" style="padding: 2px 4px; border-radius: 3px; font-size: 0.9em; margin-right: 2px;">➕</button>
                    <button type="button" class="custom-btn btn-yellow small" id="btnKbUiDefaultNew" title="Open the native VS Code Keyboard Shortcuts panel to view default VS Code keyboard mappings in another group." style="padding: 2px 6px; border-radius: 3px; font-size: 0.85em;">KB UI Default</button>
                </span>
                <!-- KB UI Extension (orange) -->
                <span style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.03); border-radius: 4px; padding: 2px;">
                    <button type="button" class="custom-btn btn-orange small" id="btnKbUiExtensionNewNewInst" title="Open extension keybindings as a new instance" style="padding: 2px 4px; border-radius: 3px; font-size: 0.9em; margin-right: 2px;">➕</button>
                    <button type="button" class="custom-btn btn-orange small" id="btnKbUiExtensionNew" title="Open the native VS Code Keyboard Shortcuts panel showing extension-supplied default bindings in another group." style="padding: 2px 6px; border-radius: 3px; font-size: 0.85em;">KB UI Extension</button>
                </span>
                <!-- KB UI User (secondary) -->
                <span style="display: inline-flex; align-items: center; background: rgba(255,255,255,0.03); border-radius: 4px; padding: 2px;">
                    <button type="button" class="secondary small" id="btnKbUiUserNewNewInst" title="Open custom User keybindings as a new instance" style="padding: 2px 4px; border-radius: 3px; font-size: 0.9em; margin-right: 2px;">➕</button>
                    <button type="button" class="secondary small" id="btnKbUiUserNew" title="Open the native VS Code Keyboard Shortcuts panel displaying custom user keybinding modifications in another group." style="padding: 2px 6px; border-radius: 3px; font-size: 0.85em;">KB UI User</button>
                </span>
            </div>
        </div>

        <!-- Row 3: Standard Actions -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 12px; flex-wrap: wrap; gap: 12px;">
            <!-- Align Left -->
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button type="button" class="custom-btn btn-red" id="btnClear" title="Clear all input fields, checkboxes, modifier labels, and validation indicators to let you configure a clean, empty key combination.">Clear</button>
                <button type="button" class="custom-btn btn-cyan" id="btnCloseAllKbJson" title="Close all open keybindings.json file tabs in VS Code.">Close All KB Json</button>
                <button type="button" class="custom-btn btn-purple" id="btnCloseAllKbUi" title="Close all open native Keyboard Shortcuts editor tabs in VS Code.">Close All KB UI</button>
                <button type="button" class="custom-btn btn-yellow" id="btnPasteBinding" title="Read a keybinding JSON object from your system clipboard and instantly parse its properties to populate this form.">Paste Binding</button>
            </div>
            
            <!-- Align Right -->
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button type="button" class="custom-btn btn-orange" id="btnCancel" title="Close this configuration view and return to the main command picker menu.">Cancel</button>
                <button type="button" class="custom-btn btn-red" id="btnClone" disabled title="Unbind and remove this keyboard shortcut mapping.">Unbind</button>
                <button type="button" class="custom-btn btn-green" id="btnSaveClone" disabled title="Add the newly configured key combination as an additional secondary shortcut for this action, preserving existing bindings.">Add</button>
                <button type="button" class="custom-btn btn-green" id="btnSubmit" disabled title="Save and apply the updated key combination assignment for this action (replacing any matched existing binding).">Save</button>
                <button type="button" class="secondary" id="btnDone" title="Close this configuration view. Warns if there are unsaved changes.">Done</button>
            </div>
        </div>
    </div>

    <!-- Command Queue Section with Finder -->
    <div class="queue-container" style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255, 255, 255, 0.08);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
            <span style="font-weight: bold; font-size: 1.05em; opacity: 0.95; display: flex; align-items: center; gap: 8px;">
                Command Queue Navigation
                <span id="queueCountLabel" style="font-size: 0.8em; opacity: 0.7; font-weight: normal;">0 items</span>
            </span>
            <!-- Paging Row (moved to Command Queue Navigation Title Bar) -->
            <div style="display: flex; align-items: center; gap: 4px;">
                <button type="button" class="secondary small" id="btnPageFirst" title="First item">&lt;&lt;&lt;</button>
                <button type="button" class="secondary small" id="btnPagePrevWithCheckoff" title="Page backward until a checkoff is true (checked)">&lt;&lt;[x]</button>
                <button type="button" class="secondary small" id="btnPagePrevNoCheckoff" title="Page backward until a checkoff is false (unchecked)">&lt;&lt;[]</button>
                <button type="button" class="secondary small" id="btnPagePrev" title="Previous item">&lt;</button>
                <span id="lblPageNum" style="font-size: 0.9em; font-weight: bold; margin: 0 4px; opacity: 0.85; min-width: 3.5em; text-align: center;">1 of 1</span>
                <button type="button" class="secondary small" id="btnPageNext" title="Next item">&gt;</button>
                <button type="button" class="secondary small" id="btnPageNextNoCheckoff" title="Page forward until a checkoff is false (unchecked)">[]&gt;&gt;</button>
                <button type="button" class="secondary small" id="btnPageNextWithCheckoff" title="Page forward until a checkoff is true (checked)">[x]&gt;&gt;</button>
                <button type="button" class="secondary small" id="btnPageLast" title="Last item">&gt;&gt;&gt;</button>
            </div>
        </div>
        <div style="margin-bottom: 8px;">
            <input type="text" id="queueFinderInput" placeholder="Filter command queue..." style="width: 100%; box-sizing: border-box; background: var(--vscode-input-background); color: var(--vscode-input-foreground); border: 1px solid var(--vscode-input-border); padding: 6px 10px; border-radius: 4px; font-family: inherit;" title="Type here to filter the command queue list below.">
        </div>
        <div id="queueList" style="max-height: 220px; overflow-y: auto; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 4px; background: rgba(0, 0, 0, 0.1); display: flex; flex-direction: column;">
            <!-- Items dynamically populated -->
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
        window.CE_ORIGINAL_ARGS = ` + JSON.stringify(originalArgs) + `;
        window.CE_CHECKED_OFF_COMMANDS = ` + JSON.stringify(checkedOff) + `;
        window.CE_COMMAND_BINDINGS = ` + JSON.stringify(commandBindings) + `;
        ` + webviewJS + `
    </script>
</body>
</html>`;
}

module.exports = { getWebviewContent };

// END OF FILE: src/extension-macros-html.js
