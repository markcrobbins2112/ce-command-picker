// START OF FILE: src/extension-core.js
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const jsonc = require('jsonc-parser');

let editModeActive = false;

const shortcodeToNativeMap = {
    'pu': 'pageup',
    'pd': 'pagedown',
    'ho': 'home',
    'en': 'end',
    'in': 'insert',
    'bl': '[',
    'br': ']',
    'sq': "'",
    'sc': ';',
    'co': ',',
    'pe': '.',
    'sf': '/',
    'sb': '\\',
    'bq': '`',
    'esc': 'escape',
    'lf': 'left',
    'rt': 'right',
    'dn': 'down',
    'up': 'up',
    'del': 'delete',
    'pause': 'pausebreak',
    'bs': 'backspace'
};

const nativeToShortcodeMap = {
    'pageup': 'pu', 'pgup': 'pu',
    'pagedown': 'pd', 'pgdn': 'pd',
    'home': 'ho',
    'end': 'en',
    'insert': 'in', 'ins': 'in',
    '[': 'bl',
    ']': 'br',
    "'": 'sq',
    ';': 'sc',
    ',': 'co',
    '.': 'pe',
    '/': 'sf',
    '\\': 'sb',
    '`': 'bq',
    'escape': 'esc', 'esc': 'esc',
    'arrowleft': 'lf', 'left': 'lf',
    'arrowright': 'rt', 'right': 'rt',
    'arrowdown': 'dn', 'down': 'dn',
    'arrowup': 'up', 'up': 'up',
    'delete': 'del',
    'pausebreak': 'pause', 'pause': 'pause',
    'backspace': 'bs',
    'enter': 'enter',
    'tab': 'tab',
    'space': 'space',
    'capslock': 'capslock'
};

function formatToCustomShorthand(nativeKeybinding) {
    if (!nativeKeybinding) return '';

    const chords = nativeKeybinding.trim().split(/\s+/);
    const formattedChords = chords.map(chord => {
        const lower = chord.toLowerCase();
        const elements = lower.split('+');
        const baseKey = elements.find(el => !['ctrl', 'alt', 'shift', 'cmd', 'meta', 'win'].includes(el));
        if (!baseKey) return chord; 

        let formattedBase = nativeToShortcodeMap[baseKey] || baseKey.toUpperCase();
        let flags = '';
        if (lower.includes('win')) flags += 'w';
        if (lower.includes('ctrl') || lower.includes('cmd') || lower.includes('meta')) flags += 'c';
        if (lower.includes('alt')) flags += 'a';
        if (lower.includes('shift')) flags += 's';

        return flags ? `${formattedBase}.${flags}` : formattedBase;
    });
    return formattedChords.join(' ');
}

function parseShorthandToNative(shorthand) {
    if (!shorthand) return '';

    const chords = shorthand.trim().split(/\s+/);
    const nativeChords = chords.map(chord => {
        if (!chord.includes('.')) {
            const lowerChord = chord.toLowerCase();
            return shortcodeToNativeMap[lowerChord] || lowerChord;
        }
        const [baseKey, flags] = chord.split('.');
        const parts = [];
        if (flags.includes('w')) parts.push('win');
        if (flags.includes('c')) parts.push(process.platform === 'darwin' ? 'cmd' : 'ctrl');
        if (flags.includes('a')) parts.push('alt');
        if (flags.includes('s')) parts.push('shift');
        
        const lowerBase = baseKey.toLowerCase();
        parts.push(shortcodeToNativeMap[lowerBase] || lowerBase);
        return parts.join('+');
    });
    return nativeChords.join(' ');
}

function getKeybindingsFilePath() {
    const appData = process.env.APPDATA;
    const home = process.env.HOME || process.env.USERPROFILE;
    const isCursor = vscode.env.appName.toLowerCase().includes('cursor');
    const folderName = isCursor ? 'Cursor' : 'Code';

    if (process.platform === 'win32') {
        return path.join(appData, folderName, 'User', 'keybindings.json');
    } else if (process.platform === 'darwin') {
        return path.join(home, 'Library', 'Application Support', folderName, 'User', 'keybindings.json');
    } else {
        return path.join(home, '.config', folderName, 'User', 'keybindings.json');
    }
}

function loadFullKeybindingsArray() {
    const configPath = getKeybindingsFilePath();
    if (!fs.existsSync(configPath)) return [];
    try {
        const fileContent = fs.readFileSync(configPath, 'utf8');
        const parsed = jsonc.parse(fileContent);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveKeybindingsArray(arr) {
    const configPath = getKeybindingsFilePath();
    try {
        fs.writeFileSync(configPath, JSON.stringify(arr, null, 4), 'utf8');
        return true;
    } catch (e) {
        vscode.window.showErrorMessage(`Failed to save keybindings updates: ${e.message}`);
        return false;
    }
}

// Explicit module export assignment block
module.exports = {
    getEditMode: () => editModeActive,
    setEditMode: (val) => { editModeActive = val; },
    formatToCustomShorthand,
    parseShorthandToNative,
    getKeybindingsFilePath,
    loadFullKeybindingsArray,
    saveKeybindingsArray
};
// END OF FILE: src/extension-core.js
