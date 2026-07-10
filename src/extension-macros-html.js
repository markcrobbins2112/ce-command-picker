// START OF FILE: src/extension-macros-html.js

/**
 * Returns lightweight HTML DOM structures using embedded script logic variables.
 * Automatically mirrors the theme's colors natively using CSS Workbench properties.
 */
function getWebviewContent(title, chord1Base, chord1Flags, chord2Base, chord2Flags, whenClause, currentKeys, currentWhen) {
    // Isolated client browser synchronization controller logic string block
    const webviewJS = `
    const vscode = acquireVsCodeApi();

    const baseInput1 = document.getElementById('baseKey1');
    const shortcodeInput1 = document.getElementById('shortcode1');
    const checkboxes1 = {
        c: document.getElementById('modC1'),
        a: document.getElementById('modA1'),
        s: document.getElementById('modS1')
    };

    const baseInput2 = document.getElementById('baseKey2');
    const shortcodeInput2 = document.getElementById('shortcode2');
    const checkboxes2 = {
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
    const btnCloneKey1 = document.getElementById('btnCloneKey1');

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
        return cleaned.toUpperCase();
    }

    function cleanShortcodeInput(val) {
        if (!val) return '';
        let cleaned = val.toLowerCase().replace(/[^cas]/g, '');
        let res = '';
        if (cleaned.includes('c')) res += 'c';
        if (cleaned.includes('a')) res += 'a';
        if (cleaned.includes('s')) res += 's';
        return res;
    }

    function getFullShorthand() {
        const base1 = baseInput1.value.trim().toUpperCase();
        const flags1 = shortcodeInput1.value.trim().toLowerCase();
        const part1 = flags1 ? base1 + '.' + flags1 : base1;

        const base2 = baseInput2.value.trim().toUpperCase();
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

        baseInput1.value = cleanBaseKeyInput(baseInput1.value);
        let f = '';
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
        checkboxes1.c.checked = shortcodeInput1.value.includes('c');
        checkboxes1.a.checked = shortcodeInput1.value.includes('a');
        checkboxes1.s.checked = shortcodeInput1.value.includes('s');

        isSynchronizing = false;
        triggerValidation();
    }

    function syncFromUIForm2() {
        if (isSynchronizing) return;
        isSynchronizing = true;

        baseInput2.value = cleanBaseKeyInput(baseInput2.value);
        let f = '';
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
        checkboxes2.c.checked = shortcodeInput2.value.includes('c');
        checkboxes2.a.checked = shortcodeInput2.value.includes('a');
        checkboxes2.s.checked = shortcodeInput2.value.includes('s');

        isSynchronizing = false;
        triggerValidation();
    }

    baseInput1.addEventListener('input', syncFromUIForm1);
    Object.values(checkboxes1).forEach(cb => cb.addEventListener('change', syncFromUIForm1));
    shortcodeInput1.addEventListener('input', syncFromShortcode1);

    baseInput2.addEventListener('input', syncFromUIForm2);
    Object.values(checkboxes2).forEach(cb => cb.addEventListener('change', syncFromUIForm2));
    shortcodeInput2.addEventListener('input', syncFromShortcode2);

    btnCloneKey1.addEventListener('click', () => {
        isSynchronizing = true;
        baseInput2.value = baseInput1.value;
        checkboxes2.c.checked = checkboxes1.c.checked;
        checkboxes2.a.checked = checkboxes1.a.checked;
        checkboxes2.s.checked = checkboxes1.s.checked;
        shortcodeInput2.value = shortcodeInput1.value;
        isSynchronizing = false;
        triggerValidation();
    });

    window.addEventListener('message', event => {
        const message = event.data;
        if (message.type === 'status') {
            statusBox.textContent = message.text;
            statusBox.style.display = 'block';
            statusBox.style.padding = '8px 12px';
            statusBox.style.borderRadius = '4px';
            
            if (message.status === 'error') {
                statusBox.style.background = 'rgba(241, 76, 76, 0.15)';
                statusBox.style.color = '#f14c4c';
                btnSubmit.disabled = true;
                btnClone.disabled = true;
                btnSaveClone.disabled = true;
                lastValidatedNativeKey = '';
            } else {
                statusBox.style.background = 'rgba(137, 209, 137, 0.15)';
                statusBox.style.color = '#88d188';
                btnSubmit.disabled = false;
                btnClone.disabled = false;
                btnSaveClone.disabled = false;
                lastValidatedNativeKey = message.nativeKey || '';
            }
        } else if (message.type === 'updateLabels') {
            if (currentKeysLabel) currentKeysLabel.textContent = message.currentKeys;
            if (currentWhenClauseLabel) currentWhenClauseLabel.textContent = message.currentWhen;
        }
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
        if (!lastValidatedNativeKey) return;
        vscode.postMessage({
            command: 'submit',
            actionType: 'clone',
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

    if (window.CE_INITIAL_STATE) {
        isSynchronizing = true;
        baseInput1.value = window.CE_INITIAL_STATE.chord1Base || '';
        shortcodeInput1.value = window.CE_INITIAL_STATE.chord1Flags || '';
        checkboxes1.c.checked = shortcodeInput1.value.includes('c');
        checkboxes1.a.checked = shortcodeInput1.value.includes('a');
        checkboxes1.s.checked = shortcodeInput1.value.includes('s');

        baseInput2.value = window.CE_INITIAL_STATE.chord2Base || '';
        shortcodeInput2.value = window.CE_INITIAL_STATE.chord2Flags || '';
        checkboxes2.c.checked = shortcodeInput2.value.includes('c');
        checkboxes2.a.checked = shortcodeInput2.value.includes('a');
        checkboxes2.s.checked = shortcodeInput2.value.includes('s');

        whenInput.value = window.CE_INITIAL_STATE.whenClause || 'editorTextFocus';
        
        if (currentKeysLabel) currentKeysLabel.textContent = window.CE_INITIAL_STATE.currentKeys || 'None';
        if (currentWhenClauseLabel) currentWhenClauseLabel.textContent = window.CE_INITIAL_STATE.currentWhen || 'No context';
        
        isSynchronizing = false;
        triggerValidation();
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
        .actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 16px; }
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
        <div><span style="opacity: 0.7;">Current Key(s):</span> <strong id="currentKeysLabel">` + (currentKeys || 'None') + `</strong></div>
        <div><span style="opacity: 0.7;">Current When:</span> <strong id="currentWhenClauseLabel">` + (currentWhen || 'No context') + `</strong></div>
    </div>
    
    <div class="chords-grid">
        <!-- Chord 1 Panel -->
        <div class="chord-panel">
            <div class="chord-header">
                <span>Key 1 (Main Chord)</span>
            </div>
            
            <div class="form-group">
                <label for="baseKey1" style="font-weight: 500;">Base Key</label>
                <input type="text" id="baseKey1" placeholder="e.g., K, F11, ENTER, LEFT">
            </div>

            <div class="form-group">
                <label style="font-weight: 500;">Modifiers</label>
                <div class="checkbox-group">
                    <label class="checkbox-item"><input type="checkbox" id="modC1" value="c"> Control</label>
                    <label class="checkbox-item"><input type="checkbox" id="modA1" value="a"> Alt</label>
                    <label class="checkbox-item"><input type="checkbox" id="modS1" value="s"> Shift</label>
                </div>
            </div>

            <div class="form-group">
                <label for="shortcode1" style="font-weight: 500;">Modifier Shortcode Box (cas)</label>
                <input type="text" id="shortcode1" placeholder="e.g., ca, s, cas">
            </div>
        </div>

        <!-- Chord 2 Panel -->
        <div class="chord-panel">
            <div class="chord-header">
                <span>Key 2 (Optional Second Chord)</span>
                <button type="button" class="secondary small" id="btnCloneKey1">Clone Key 1</button>
            </div>
            
            <div class="form-group">
                <label for="baseKey2" style="font-weight: 500;">Base Key</label>
                <input type="text" id="baseKey2" placeholder="e.g., W, ESC, DOWN">
            </div>

            <div class="form-group">
                <label style="font-weight: 500;">Modifiers</label>
                <div class="checkbox-group">
                    <label class="checkbox-item"><input type="checkbox" id="modC2" value="c"> Control</label>
                    <label class="checkbox-item"><input type="checkbox" id="modA2" value="a"> Alt</label>
                    <label class="checkbox-item"><input type="checkbox" id="modS2" value="s"> Shift</label>
                </div>
            </div>

            <div class="form-group">
                <label for="shortcode2" style="font-weight: 500;">Modifier Shortcode Box (cas)</label>
                <input type="text" id="shortcode2" placeholder="e.g., ca, s, cas">
            </div>
        </div>
    </div>

    <div class="form-group" style="margin-top: 8px;">
        <label for="whenClause" style="font-weight: 500;">Context Clause Constraint (When)</label>
        <input type="text" id="whenClause" placeholder="e.g., editorTextFocus">
    </div>

    <div id="statusBox" style="display: none;"></div>

    <div class="actions">
        <button class="secondary" id="btnCancel">Cancel</button>
        <button class="secondary" id="btnClone" disabled>Clone</button>
        <button class="secondary" id="btnSaveClone" disabled>Save and Clone</button>
        <button id="btnSubmit" disabled>Save Mappings</button>
    </div>

    <script>
        window.CE_INITIAL_STATE = {
            chord1Base: "` + (chord1Base || '') + `",
            chord1Flags: "` + (chord1Flags || '') + `",
            chord2Base: "` + (chord2Base || '') + `",
            chord2Flags: "` + (chord2Flags || '') + `",
            whenClause: "` + (whenClause || 'editorTextFocus') + `",
            currentKeys: "` + (currentKeys || '') + `",
            currentWhen: "` + (currentWhen || '') + `"
        };
        ` + webviewJS + `
    </script>
</body>
</html>`;
}

module.exports = { getWebviewContent };

// END OF FILE: src/extension-macros-html.js
