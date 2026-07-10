// START OF FILE: src/extension-macros-html.js
const vscode = require('vscode');
const path = require('path');

/**
 * Returns static HTML structures mapped completely to secure local workspace engine resource URIs.
 */
function getWebviewContent(webview, title) {
    // Generate secure local file pathway URIs that VS Code can load internally
    const stylesPath = vscode.Uri.file(path.join(__dirname, 'src', 'webview', 'form-styles.css'));
    const scriptPath = vscode.Uri.file(path.join(__dirname, 'src', 'webview', 'form-client.js'));
    
    const stylesUri = webview.asWebviewUri(stylesPath);
    const scriptUri = webview.asWebviewUri(scriptPath);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CE Form Dialog</title>
    <link rel="stylesheet" href="` + stylesUri + `">
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
            <div class="checkbox-item"><input type="checkbox" id="modW" value="w"> Windows</div>
            <div class="checkbox-item"><input type="checkbox" id="modC" value="c"> Control</div>
            <div class="checkbox-item"><input type="checkbox" id="modA" value="a"> Alt</div>
            <div class="checkbox-item"><input type="checkbox" id="modS" value="s"> Shift</div>
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

    <div id="statusBox" class="status-box"></div>

    <div class="actions">
        <button class="secondary" id="btnCancel">Cancel</button>
        <button id="btnSubmit" disabled>Save Mappings</button>
    </div>

    <script src="` + scriptUri + `"></script>
</body>
</html>`;
}

module.exports = { getWebviewContent };
// END OF FILE: src/extension-macros-html.js
