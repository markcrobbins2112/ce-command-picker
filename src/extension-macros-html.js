// START OF FILE: src/extension-macros-html.js

const fs = require('fs');
const path = require('path');
// 🌟 FIX: Require the CSS straight as a bundled module parameter string!
const stylesModule = require('./webview/form-styles');

/**
 * Returns clean HTML DOM layout skeletons.
 * Reads assets natively from compiled bundles to protect execution states.
 */
function getWebviewContent(title, baseKey, shorthand, whenClause) {
    let flags = '';
    
    if (shorthand) {
        const match = shorthand.match(/(.*)\.([wcas]*)$/);
        if (match && match) {
            flags = match[2];
        }
    }

    const clientScriptPath = path.join(__dirname, 'webview', 'form-client.js');
    let clientScriptContent = '';
    
    try {
        clientScriptContent = fs.readFileSync(clientScriptPath, 'utf8');
    } catch (e) {
        clientScriptContent = `console.error("Critical: Form client controller missing", e);`;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CE Form Dialog</title>
    <style>
        ` + stylesModule.webviewCSS + `
    </style>
</head>
<body>
    <h2>Action Target: ` + (title || '') + `</h2>
    
    <div class="form-group">
        <label for="baseKey">1. Character Base Key</label>
        <input type="text" id="baseKey" value="` + (baseKey || '') + `" placeholder="e.g., X, F11, DOWN, ENTER">
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
        <input type="text" id="shortcode" value="` + (shorthand || '') + `" placeholder="Watching form matrices...">
    </div>

    <div class="form-group">
        <label for="whenClause">4. Context Clause Constraint (When)</label>
        <input type="text" id="whenClause" value="` + (whenClause || '') + `" placeholder="e.g., editorTextFocus">
    </div>

    <div id="statusBox" class="status-box"></div>

    <div class="actions">
        <button class="secondary" id="btnCancel">Cancel</button>
        <button id="btnSubmit" disabled>Save Mappings</button>
    </div>

    <script>
        ` + clientScriptContent + `
    </script>
</body>
</html>`;
}

module.exports = { getWebviewContent };

// END OF FILE: src/extension-macros-html.js
