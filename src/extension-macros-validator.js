// START OF FILE: src/extension-macros-validator.js
const core = require('./extension-core');

function validateAndParseInput(inputString) {
    const value = inputString.trim();
    if (!value) {
        return { isValid: false, nativeKey: '', errorReason: 'Input cannot be empty.' };
    }

    const knownKeys = [
        'up', 'down', 'left', 'right', 'escape', 'esc', 'enter', 'tab', 'space',
        'backspace', 'delete', 'del', 'insert', 'ins', 'pageup', 'pgup', 'pagedown', 'pgdn',
        'home', 'end', 'capslock', 'caps'
    ];

    const isValidBaseKey = (k) => {
        const lower = k.toLowerCase();
        return /^[a-z0-9]$/.test(lower) || /^f\d+$/.test(lower) || knownKeys.includes(lower);
    };

    if (value.includes('+')) {
        const chords = value.split(/\s+/);
        for (const chord of chords) {
            const elements = chord.toLowerCase().split('+');
            const baseKeys = elements.filter(el => !['ctrl', 'alt', 'shift', 'cmd', 'meta', 'win'].includes(el));

            if (baseKeys.length === 0) {
                return { isValid: false, nativeKey: '', errorReason: `Native format error: Chord "${chord}" is missing a character key.` };
            }
            if (baseKeys.length > 1) {
                return { isValid: false, nativeKey: '', errorReason: `Native format error: Too many base keys ("${baseKeys.join(', ')}") inside chord.` };
            }
            if (!isValidBaseKey(baseKeys[0])) {
                return { isValid: false, nativeKey: '', errorReason: `Syntax Error: "${baseKeys[0]}" is not recognized.` };
            }
        }
        return { isValid: true, nativeKey: value.toLowerCase(), errorReason: null };
    }

    const chords = value.split(/\s+/);
    for (const chord of chords) {
        if (!chord.includes('.')) {
            if (!isValidBaseKey(chord)) {
                return { isValid: false, nativeKey: '', errorReason: `Shortcode format error: "${chord}" is not valid.` };
            }
            continue;
        }

        const [baseKey, flags] = chord.split('.');
        if (!baseKey || !isValidBaseKey(baseKey)) {
            return { isValid: false, nativeKey: '', errorReason: `Syntax Error: "${baseKey || 'empty'}" is not recognized.` };
        }
        if (!flags) {
            return { isValid: false, nativeKey: '', errorReason: `Shortcode error: Modifier flags suffix is blank.` };
        }

        const invalidFlags = [...flags.toLowerCase()].filter(char => !['w', 'c', 'a', 's'].includes(char));
        if (invalidFlags.length > 0) {
            return { isValid: false, nativeKey: '', errorReason: `Shortcode error: Invalid flags ("${invalidFlags.join(', ')}"). Use w, c, a, s.` };
        }
    }

    try {
        const structuralNativeText = core.parseShorthandToNative(value);
        return { isValid: true, nativeKey: structuralNativeText, errorReason: null };
    } catch {
        return { isValid: false, nativeKey: '', errorReason: 'Failed to transform shortcode notation.' };
    }
}

module.exports = { validateAndParseInput };
// END OF FILE: src/extension-macros-validator.js
