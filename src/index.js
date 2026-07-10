// START OF FILE: src/index.js

const ui = require('./extension-ui');

/**
 * Main lifecycle hook invoked by VS Code engine upon activation events.
 */
export function activate(context) {
    ui.activate(context);
}

/**
 * Teardown lifecycle hook invoked upon extension disablement.
 */
export function deactivate() {
    if (typeof ui.deactivate === 'function') {
        ui.deactivate();
    }
}

// END OF FILE: src/index.js
