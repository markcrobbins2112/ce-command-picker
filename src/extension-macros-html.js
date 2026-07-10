// START OF FILE: src/extension-macros-html.js

/**
 * Returns lightweight HTML DOM structures using embedded script logic variables.
 * Automatically mirrors the theme's colors natively using CSS Workbench properties.
 */
function getWebviewContent(title, baseKey, shorthand, flags, whenClause) {
    // Isolated client browser synchronization controller logic string block
    const webviewJS = `
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

        const match = text.match(/(.*)\\.([wcas]*)$/i);
        if (match && match[1] !== undefined && match[2] !== undefined) {
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
            statusBox.style.display = 'block';
            statusBox.style.padding = '6px';
            statusBox.style.borderRadius = '4px';
            
            if (message.status === 'error') {
                statusBox.style.background = 'rgba(241, 76, 76, 0.15)';
                statusBox.style.color = '#f14c4c';
                btnSubmit.disabled = true;
                lastValidatedNativeKey = '';
            } else {
                statusBox.style.background = 'rgba(137, 209, 137, 0.15)';
                statusBox.style.color = '#88d188';
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

    if (window.CE_INITIAL_STATE) {
        isSynchronizing = true;
        baseInput.value = window.CE_INITIAL_STATE.baseKey || '';
        shortcodeInput.value = window.CE_INITIAL_STATE.shorthand || '';
        whenInput.value = window.CE_INITIAL_STATE.whenClause || 'editorTextFocus';
        setUIFlags(window.CE_INITIAL_STATE.flags || '');
        isSynchronizing = false;
        triggerValidation(shortcodeInput.value);
    }
    `;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CE Form Dialog</title>
    <style>
        body { font-family: var(--vscode-font-family); font-size: var(--vscode-font-size); padding: 15px; display: flex; flex-direction: column; gap: 12px; }
        .form-group { display: flex; flex-direction: column; gap: 4px; }
        input[type="text"] { background: var(--vscode-input-background); color: var(--vscode-input-foreground); border: 1px solid var(--vscode-input-border); padding: 5px; border-radius: 3px; }
        input[type="text"]:focus { outline: 1px solid var(--vscode-focusBorder); }
        .checkbox-group { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding: 5px 0; }
        .actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 5px; }
        button { background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; padding: 5px 12px; border-radius: 3px; cursor: pointer; }
        button:hover { background: var(--vscode-button-hoverBackground); }
        button.secondary { background: var(--vscode-button-secondaryBackground); color: var(--vscode-button-secondaryForeground); }
        button.secondary:hover { background-color: var(--vscode-button-secondaryHoverBackground); }
    </style>
</head>
<body>
    <h2>Action Target: ` + (title || '') + `</h2>
    
    <div class="form-group">
        <label for="baseKey">1. Character Base Key</label>
        <input type="text" id="baseKey" placeholder="e.g., X, F11, DOWN, ENTER">
    </div>

    <div class="form-group">
        <label>2. Modifiers Checkbox Form</label>
        <div class="checkbox-group">
            <div class="checkbox-item"><input type="checkbox" id="modW" ` + (flags.includes('w') ? 'checked' : '') + ` value="w"> Windows</div>
            <div class="checkbox-item"><input type="checkbox" id="modC" ` + (flags.includes('c') ? 'checked' : '') + ` value="c"> Control</div>
            <div class="checkbox-item"><input type="checkbox" id="modA" ` + (flags.includes('a') ? 'checked' : '') + ` value="a"> Alt</div>
            <div class="checkbox-item"><input type="checkbox" id="modS" ` + (flags.includes('s') ? 'checked' : '') + ` value="s"> Shift</div>
        </div>
    </div>

    <div class="form-group">
        <label for="shortcode">3. Synchronized Shortcode Box</label>
        <input type="text" id="shortcode" placeholder="Watching form matrices...">
    </div>

    <div class="form-group">
        <label for="whenClause">4. Context Clause Constraint (When)</label>
        <input type="text" id="whenClause" placeholder="e.g., editorTextFocus">
    </div>

    <div id="statusBox" style="display: none; font-size: 0.9em; margin: 4px 0;"></div>

    <div class="actions">
        <button class="secondary" id="btnCancel">Cancel</button>
        <button id="btnSubmit" disabled>Save Mappings</button>
    </div>

    <script>
        window.CE_INITIAL_STATE = {
            baseKey: "` + (baseKey || '') + `",
            shorthand: "` + (shorthand || '') + `",
            flags: "` + (flags || '') + `",
            whenClause: "` + (whenClause || 'editorTextFocus') + `"
        };
        ` + webviewJS + `
    </script>
</body>
</html>`;
}

module.exports = { getWebviewContent };

// END OF FILE: src/extension-macros-html.js
