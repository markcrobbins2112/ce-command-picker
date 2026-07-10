// START OF FILE: src/webview/form-styles.js

/**
 * Pure compiled CSS stylesheet string payload.
 * Encapsulated as a standard commonJS module to force esbuild inline compilation bundles.
 */
const webviewCSS = `
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
`;

module.exports = { webviewCSS };

// END OF FILE: src/webview/form-styles.js
