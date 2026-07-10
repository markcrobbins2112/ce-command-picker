// START OF FILE: src/webview/form-client.js
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
const btnClone = document.getElementById('btnClone');
const btnSaveClone = document.getElementById('btnSaveClone');
const btnSubmit = document.getElementById('btnSubmit');

const btnClear1 = document.getElementById('btnClear1');
const btnClear2 = document.getElementById('btnClear2');
const btnClear = document.getElementById('btnClear');
const btnEditJson = document.getElementById('btnEditJson');
const btnUnbind = document.getElementById('btnUnbind');
const btnCopyBinding = document.getElementById('btnCopyBinding');
const btnPasteBinding = document.getElementById('btnPasteBinding');

const currentKeysLabel = document.getElementById('currentKeysLabel');
const currentWhenClauseLabel = document.getElementById('currentWhenClauseLabel');

let lastValidatedNativeKey = '';
let isSynchronizing = false;

function cleanBaseKeyInput(val) {
    if (!val) return '';
    let cleaned = val.toLowerCase()
        .replace(/(ctrl|alt|shift|win|cmd|meta)\+/g, '')
        .replace(/\.[casw]+/g, '')
        .replace(/\+/g, '')
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

function triggerValidation() {
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
            const chords = shorthandStr.trim().split(/\s+/);
            if (chords.length >= 1 && chords[0]) {
                const match = chords[0].match(/(.*)\.([wcas]*)$/);
                if (match) {
                    b1 = match[1];
                    f1 = match[2];
                } else {
                    b1 = chords[0];
                    f1 = '';
                }
            }
            if (chords.length >= 2 && chords[1]) {
                const match = chords[1].match(/(.*)\.([wcas]*)$/);
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
            if (btnSubmit) btnSubmit.disabled = true;
            if (btnClone) btnClone.disabled = true;
            if (btnSaveClone) btnSaveClone.disabled = true;
            lastValidatedNativeKey = '';
        } else {
            statusBox.style.background = 'rgba(137, 209, 137, 0.15)';
            statusBox.style.color = '#88d188';
            if (btnSubmit) btnSubmit.disabled = false;
            if (btnClone) btnClone.disabled = false;
            if (btnSaveClone) btnSaveClone.disabled = false;
            lastValidatedNativeKey = message.nativeKey || '';
        }
    } else if (message.type === 'updateLabels') {
        if (currentKeysLabel) currentKeysLabel.textContent = message.currentKeys;
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

if (btnSubmit) {
    btnSubmit.addEventListener('click', () => {
        if (!lastValidatedNativeKey) return;
        vscode.postMessage({
            command: 'submit',
            actionType: 'save',
            nativeKey: lastValidatedNativeKey,
            when: whenInput.value
        });
    });
}

if (btnClone) {
    btnClone.addEventListener('click', () => {
        if (!lastValidatedNativeKey) return;
        vscode.postMessage({
            command: 'submit',
            actionType: 'clone',
            nativeKey: lastValidatedNativeKey,
            when: whenInput.value
        });
    });
}

if (btnSaveClone) {
    btnSaveClone.addEventListener('click', () => {
        if (!lastValidatedNativeKey) return;
        vscode.postMessage({
            command: 'submit',
            actionType: 'saveAndClone',
            nativeKey: lastValidatedNativeKey,
            when: whenInput.value
        });
    });
}

if (btnCancel) {
    btnCancel.addEventListener('click', () => {
        vscode.postMessage({ command: 'cancel' });
    });
}

if (btnEditJson) {
    btnEditJson.addEventListener('click', () => {
        vscode.postMessage({
            command: 'editJson',
            nativeKey: lastValidatedNativeKey,
            when: whenInput.value
        });
    });
}

if (btnUnbind) {
    btnUnbind.addEventListener('click', () => {
        vscode.postMessage({
            command: 'unbind',
            nativeKey: lastValidatedNativeKey,
            when: whenInput.value
        });
    });
}

if (btnCopyBinding) {
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
}

if (btnPasteBinding) {
    btnPasteBinding.addEventListener('click', () => {
        vscode.postMessage({ command: 'pasteBinding' });
    });
}

if (window.CE_INITIAL_STATE) {
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
    
    if (currentKeysLabel) currentKeysLabel.textContent = window.CE_INITIAL_STATE.currentKeys || 'None';
    if (currentWhenClauseLabel) currentWhenClauseLabel.textContent = window.CE_INITIAL_STATE.currentWhen || 'No context';
    
    lastValidatedNativeKey = window.CE_INITIAL_STATE.initialNativeKey || '';
    isSynchronizing = false;
    triggerValidation();
}
// END OF FILE: src/webview/form-client.js
