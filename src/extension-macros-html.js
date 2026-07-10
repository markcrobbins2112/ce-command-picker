// START OF FILE: src/extension-macros-html.js

/**
 * Returns raw HTML DOM string data styled dynamically via standard VS Code workbench colors.
 * Keeps form text inputs and modifier checkboxes in strict bi-directional synchronization.
 */
function getWebviewContent(title, baseKey, shorthand, whenClause) {
    let flags = '';
    if (shorthand && shorthand.includes('.')) {
        const parts = shorthand.split('.');
        flags = parts[1] || ''; // ✅ FIXED: Explicitly isolate index 1 string token
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CE Form Dialog</title>
    <style>
        body {
            background-color: var(--vscode-sideBar-background);
            color: var(--vscode-editor-foreground);
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
            max-width: 450px;
            margin: 0 auto;
            border: 1px solid var(--vscode-widget-border);
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        h2 {
            font-size: 1.1rem;
            margin: 0 0 5px 0;
            color: var(--vscode-settings-headerForeground);
            border-bottom: 1px solid var(--vscode-panel-border);
            padding-bottom: 8px;
        }
        .form-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        label {
            font-weight: bold;
            color: var(--vscode-input-foreground);
        }
        input[type="text"] {
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            padding: 6px 10px;
            border-radius: 4px;
            font-family: inherit;
        }
        input[type="text"]:focus {
            outline: 1px solid var(--vscode-focusBorder);
        }
        .checkbox-group {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            background-color: var(--vscode-editor-background);
            padding: 10px;
            border-radius: 4px;
            border: 1px solid var(--vscode-panel-border);
        }
        .checkbox-item {
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
        }
        .status-box {
            min-height: 24px;
            font-size: 0.9em;
            padding: 6px;
            border-radius: 4px;
            display: none;
        }
        .error { background-color: rgba(241, 76, 76, 0.15); color: #f14c4c; display: block; }
        .warning { background-color: rgba(204, 167, 0, 0.15); color: #cca700; display: block; }
        .success { background-color: rgba(137, 209, 137, 0.15); color: #88d188; display: block; }
        .actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 10px;
        }
        button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 6px 14px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }
        button:hover { background-color: var(--vscode-button-hoverBackground); }
        button.secondary {
            background-color: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        button.secondary:hover { background-color: var(--vscode-button-secondaryHoverBackground); }
    </style>
</head>
<body>
    <h2>Action Target: ${title}</h2>
    
    <div class="form-group">
        <label for="baseKey">1. Character Base Key</label>
        <input type="text" id="baseKey" value="${baseKey}" placeholder="e.g., X, F11, DOWN, ENTER">
    </div>

    <div class="form-group">
        <label>2. Modifiers Checkbox Form</label>
        <div class="checkbox-group">
            <div class="checkbox-item"><input type="checkbox" id="modW" ${flags.includes('w') ? 'checked' : ''} value="w"> Windows</div>
            <div class="checkbox-item"><input type="checkbox" id="modC" ${flags.includes('c') ? 'checked' : ''} value="c"> Control</div>
            <div class="checkbox-item"><input type="checkbox" id="modA" ${flags.includes('a') ? 'checked' : ''} value="a"> Alt</div>
            <div class="checkbox-item"><input type="checkbox" id="modS" ${flags.includes('s') ? 'checked' : ''} value="s"> Shift</div>
        </div>
    </div>

    <div class="form-group">
        <label for="shortcode">3. Synchronized Shortcode Box</label>
        <input type="text" id="shortcode" value="${shorthand}" placeholder="Watching form matrices...">
    </div>

    <div class="form-group">
        <label for="whenClause">4. Context Clause Constraint (When)</label>
        <input type="text" id="whenClause" value="${whenClause}" placeholder="e.g., editorTextFocus">
    </div>

    <!-- ✅ FIXED: statusBox reintroduced to resolve runtime JS mount exceptions -->
    <div id="statusBox" class="status-box"></div>

    <div class="actions">
        <button class="secondary" id="btnCancel">Cancel</button>
        <button id="btnSubmit" disabled>Save Mappings</button>
    </div>

    <script>
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

            if (text.includes('.')) {
                const parts = text.split('.');
                baseInput.value = parts[0].toUpperCase();
                setUIFlags(parts[1] || '');
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
    </script>
</body>
</html>`;
}

module.exports = { getWebviewContent };

// END OF FILE: src/extension-macros-html.js