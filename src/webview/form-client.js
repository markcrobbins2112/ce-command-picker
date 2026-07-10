// START OF FILE: src/webview/form-client.js

const vscode = acquireVsCodeApi();

const baseInput = document.getElementById('baseKey');
const shortcodeInput = document.getElementById('shortcode');
const whenInput = document.getElementById('whenClause');
const statusBox = document.getElementById('statusBox');
const btnSubmit = document.getElementById('btnSubmit');
const btnCancel = document.getElementById('btnCancel');

const checkboxes = {
    w: document.getElementById('modW'),
    c: document.getElementById('modC'),
    a: document.getElementById('modA'),
    s: document.getElementById('modS')
};

let lastValidatedNativeKey = '';
let isSynchronizing = false;

function getFlagsFromUI() {
    let f = '';
    if (checkboxes.w.checked) f += 'w';
    if (checkboxes.c.checked) f += 'c';
    if (checkboxes.a.checked) f += 'a';
    if (checkboxes.s.checked) f += 's';
    return f;
}

function setUIFlags(flagsStr) {
    checkboxes.w.checked = flagsStr.includes('w');
    checkboxes.c.checked = flagsStr.includes('c');
    checkboxes.a.checked = flagsStr.includes('a');
    checkboxes.s.checked = flagsStr.includes('s');
}

function triggerValidation(textValue) {
    if (!textValue.trim()) {
        statusBox.className = 'status-box';
        statusBox.style.display = 'none';
        btnSubmit.disabled = true;
        return;
    }
    vscode.postMessage({ command: 'validate', value: textValue });
}

function syncFromUIForm() {
    if (isSynchronizing) return;
    isSynchronizing = true;

    const base = baseInput.value.trim().toUpperCase();
    if (!base) {
        isSynchronizing = false;
        return;
    }

    const activeFlags = getFlagsFromUI();
    shortcodeInput.value = activeFlags ? base + '.' + activeFlags : base;
    
    isSynchronizing = false;
    triggerValidation(shortcodeInput.value);
}

function syncFromShortcode() {
    if (isSynchronizing) return;
    isSynchronizing = true;

    const text = shortcodeInput.value.trim();
    if (!text) {
        setUIFlags('');
        baseInput.value = '';
        isSynchronizing = false;
        return;
    }

    // ✅ FIXED: Lookbehind regex parsing guarantees trailing flag isolation for literal period assignments
    const match = text.match(/(.*)\.([wcas]*)$/i);
    if (match) {
        baseInput.value = match[1].toUpperCase();
        setUIFlags(match[2] || '');
    } else {
        if (!text.includes('+')) {
            baseInput.value = text.toUpperCase();
        }
        setUIFlags('');
    }

    isSynchronizing = false;
    triggerValidation(text);
}

baseInput.addEventListener('input', syncFromUIForm);
Object.values(checkboxes).forEach(cb => cb.addEventListener('change', syncFromUIForm));
shortcodeInput.addEventListener('input', syncFromShortcode);

window.addEventListener('message', event => {
    const message = event.data;
    if (message.type === 'status') {
        statusBox.textContent = message.text;
        statusBox.className = 'status-box ' + message.status;
        
        if (message.status === 'error') {
            btnSubmit.disabled = true;
            lastValidatedNativeKey = '';
        } else {
            btnSubmit.disabled = false;
            lastValidatedNativeKey = message.nativeKey || '';
        }
    }
});

btnSubmit.addEventListener('click', () => {
    if (!lastValidatedNativeKey) return;
    vscode.postMessage({
        command: 'submit',
        nativeKey: lastValidatedNativeKey,
        when: whenInput.value
    });
});

btnCancel.addEventListener('click', () => {
    vscode.postMessage({ command: 'cancel' });
});

triggerValidation(shortcodeInput.value);

// END OF FILE: src/webview/form-client.js
