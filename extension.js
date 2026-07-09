const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const jsonc = require('jsonc-parser'); // Run 'npm install jsonc-parser' in your extension directory

/**
 * Translates standard VS Code shortcut syntax into shorthand custom formatting.
 * Handles single keys, chord sequences, and replaces special non-character keys.
 * 
 * Example: "ctrl+arrowdown"  -> "DOWN.c"
 * Example: "ctrl+k escape"    -> "K.c ESC"
 * Example: "shift+alt+f12"   -> "[F12].as"
 */
function formatToCustomShorthand(nativeKeybinding) {
    if (!nativeKeybinding) return '';

    // Map raw VS Code key identifiers to cleaner, shorter UI characters
    const specialKeysMap = {
        'arrowup': 'UP',
        'arrowdown': 'DOWN',
        'arrowleft': 'LEFT',
        'arrowright': 'RIGHT',
        'escape': 'ESC',
        'enter': 'ENTER',
        'tab': 'TAB',
        'space': 'SPACE',
        'backspace': 'BACKSPACE',
        'delete': 'DEL',
        'insert': 'INS',
        'pageup': 'PGUP',
        'pagedown': 'PGDN',
        'home': 'HOME',
        'end': 'END',
        'capslock': 'CAPS'
    };

    // Split chords by space sequence
    const chords = nativeKeybinding.trim().split(/\s+/);

    const formattedChords = chords.map(chord => {
        const lower = chord.toLowerCase();
        const elements = lower.split('+');
        
        // Find the primary non-modifier character sequence
        const baseKey = elements.find(el => !['ctrl', 'alt', 'shift', 'cmd', 'meta'].includes(el));
        if (!baseKey) return chord; 

        // Extract and map the base label string cleanly
        let formattedBase = '';
        if (specialKeysMap[baseKey]) {
            formattedBase = specialKeysMap[baseKey];
        } else if (/^f\d+$/.test(baseKey)) {
            // Standardize function keys (e.g., f5 -> [F5])
            formattedBase = `[${baseKey.toUpperCase()}]`;
        } else {
            // Standard alphabetical or numerical standard key
            formattedBase = baseKey.toUpperCase();
        }

        // Build the trailing suffix string based on active modifiers
        let flags = '';
        if (lower.includes('ctrl') || lower.includes('cmd') || lower.includes('meta')) flags += 'c';
        if (lower.includes('alt')) flags += 'a';
        if (lower.includes('shift')) flags += 's';

        return flags ? `${formattedBase}.${flags}` : formattedBase;
    });

    return formattedChords.join(' ');
}

/**
 * Locates and parses the global keybindings.json file.
 * Dynamically switches paths based on whether the host is VS Code or Cursor.
 */
function loadUserKeybindings() {
    try {
        const appData = process.env.APPDATA;
        const home = process.env.HOME || process.env.USERPROFILE;
        let configPath = '';

        // Detect if the host application is Cursor or VS Code
        const appName = vscode.env.appName; 
        const isCursor = appName.toLowerCase().includes('cursor');
        const folderName = isCursor ? 'Cursor' : 'Code';

        if (process.platform === 'win32') {
            configPath = path.join(appData, folderName, 'User', 'keybindings.json');
        } else if (process.platform === 'darwin') {
            configPath = path.join(home, 'Library', 'Application Support', folderName, 'User', 'keybindings.json');
        } else {
            configPath = path.join(home, '.config', folderName, 'User', 'keybindings.json');
        }

        if (!fs.existsSync(configPath)) {
            return {};
        }

        const fileContent = fs.readFileSync(configPath, 'utf8');
        const bindingsArray = jsonc.parse(fileContent); 

        if (!Array.isArray(bindingsArray)) {
            return {};
        }

        const keymap = {};
        bindingsArray.forEach(binding => {
            // Ignore unbinding statements (e.g., command: "-some.command")
            if (binding.command && binding.key && !binding.command.startsWith('-')) {
                keymap[binding.command] = binding.key;
            }
        });

        return keymap;
    } catch (error) {
        console.error('Failed to read keybindings:', error);
        return {};
    }
}

function activate(context) {
    let disposable = vscode.commands.registerCommand('ce-command-picker.show', async function (args) {
        if (!args || !Array.isArray(args)) {
            vscode.window.showWarningMessage('CE Command Picker requires an array argument of command IDs.');
            return;
        }

        // Dynamically fetch user-assigned shortcuts
        const userKeybindings = loadUserKeybindings();
        const targetCommandIds = args;

        // Step 1: Pre-calculate the maximum length of the custom shorthand strings for column padding
        let maxShorthandLength = "unassigned".length; // Initial default column floor width
        
        const mappedItemsData = targetCommandIds.map(cmdId => {
            let humanLabel = cmdId
                .replace(/^[\w-]+\./, '') 
                .replace(/([A-Z])/g, ' $1') 
                .replace(/[_-]/g, ' '); 
            
            humanLabel = humanLabel.charAt(0).toUpperCase() + humanLabel.slice(1);

            const nativeShortcut = userKeybindings[cmdId];
            const shorthandShortcut = nativeShortcut ? formatToCustomShorthand(nativeShortcut) : '';

            if (shorthandShortcut.length > maxShorthandLength) {
                maxShorthandLength = shorthandShortcut.length;
            }

            return {
                humanLabel,
                shorthandShortcut,
                commandId: cmdId
            };
        });

        // Step 2: Construct final QuickPick items applying padEnd for rigid column text formatting
        const pickerItems = mappedItemsData.map(item => {
            const displayShortcut = item.shorthandShortcut ? item.shorthandShortcut : 'unassigned';
            
            // Pad the shortcut to the longest shortcut size + 2 buffer spaces for clean column split
            const paddedShortcut = displayShortcut.padEnd(maxShorthandLength + 2, ' ');

            return {
                // Generates seamless grid-like columns: "{keybinding}  {human readable}"
                label: `${paddedShortcut}${item.humanLabel}`,
                description: item.commandId,
                commandId: item.commandId
            };
        });

        const selected = await vscode.window.showQuickPick(pickerItems, {
            placeHolder: 'Select a command to execute...',
            matchOnDescription: true
        });

        if (selected && selected.commandId) {
            vscode.commands.executeCommand(selected.commandId);
        }
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
