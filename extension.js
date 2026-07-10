var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/jsonc-parser/lib/esm/impl/scanner.js
function createScanner(text, ignoreTrivia = false) {
  const len = text.length;
  let pos = 0, value = "", tokenOffset = 0, token = 16, lineNumber = 0, lineStartOffset = 0, tokenLineStartOffset = 0, prevTokenLineStartOffset = 0, scanError = 0;
  function scanHexDigits(count, exact) {
    let digits = 0;
    let value2 = 0;
    while (digits < count || !exact) {
      let ch = text.charCodeAt(pos);
      if (ch >= 48 && ch <= 57) {
        value2 = value2 * 16 + ch - 48;
      } else if (ch >= 65 && ch <= 70) {
        value2 = value2 * 16 + ch - 65 + 10;
      } else if (ch >= 97 && ch <= 102) {
        value2 = value2 * 16 + ch - 97 + 10;
      } else {
        break;
      }
      pos++;
      digits++;
    }
    if (digits < count) {
      value2 = -1;
    }
    return value2;
  }
  function setPosition(newPosition) {
    pos = newPosition;
    value = "";
    tokenOffset = 0;
    token = 16;
    scanError = 0;
  }
  function scanNumber() {
    let start = pos;
    if (text.charCodeAt(pos) === 48) {
      pos++;
    } else {
      pos++;
      while (pos < text.length && isDigit(text.charCodeAt(pos))) {
        pos++;
      }
    }
    if (pos < text.length && text.charCodeAt(pos) === 46) {
      pos++;
      if (pos < text.length && isDigit(text.charCodeAt(pos))) {
        pos++;
        while (pos < text.length && isDigit(text.charCodeAt(pos))) {
          pos++;
        }
      } else {
        scanError = 3;
        return text.substring(start, pos);
      }
    }
    let end = pos;
    if (pos < text.length && (text.charCodeAt(pos) === 69 || text.charCodeAt(pos) === 101)) {
      pos++;
      if (pos < text.length && text.charCodeAt(pos) === 43 || text.charCodeAt(pos) === 45) {
        pos++;
      }
      if (pos < text.length && isDigit(text.charCodeAt(pos))) {
        pos++;
        while (pos < text.length && isDigit(text.charCodeAt(pos))) {
          pos++;
        }
        end = pos;
      } else {
        scanError = 3;
      }
    }
    return text.substring(start, end);
  }
  function scanString() {
    let result = "", start = pos;
    while (true) {
      if (pos >= len) {
        result += text.substring(start, pos);
        scanError = 2;
        break;
      }
      const ch = text.charCodeAt(pos);
      if (ch === 34) {
        result += text.substring(start, pos);
        pos++;
        break;
      }
      if (ch === 92) {
        result += text.substring(start, pos);
        pos++;
        if (pos >= len) {
          scanError = 2;
          break;
        }
        const ch2 = text.charCodeAt(pos++);
        switch (ch2) {
          case 34:
            result += '"';
            break;
          case 92:
            result += "\\";
            break;
          case 47:
            result += "/";
            break;
          case 98:
            result += "\b";
            break;
          case 102:
            result += "\f";
            break;
          case 110:
            result += "\n";
            break;
          case 114:
            result += "\r";
            break;
          case 116:
            result += "	";
            break;
          case 117:
            const ch3 = scanHexDigits(4, true);
            if (ch3 >= 0) {
              result += String.fromCharCode(ch3);
            } else {
              scanError = 4;
            }
            break;
          default:
            scanError = 5;
        }
        start = pos;
        continue;
      }
      if (ch >= 0 && ch <= 31) {
        if (isLineBreak(ch)) {
          result += text.substring(start, pos);
          scanError = 2;
          break;
        } else {
          scanError = 6;
        }
      }
      pos++;
    }
    return result;
  }
  function scanNext() {
    value = "";
    scanError = 0;
    tokenOffset = pos;
    lineStartOffset = lineNumber;
    prevTokenLineStartOffset = tokenLineStartOffset;
    if (pos >= len) {
      tokenOffset = len;
      return token = 17;
    }
    let code = text.charCodeAt(pos);
    if (isWhiteSpace(code)) {
      do {
        pos++;
        value += String.fromCharCode(code);
        code = text.charCodeAt(pos);
      } while (isWhiteSpace(code));
      return token = 15;
    }
    if (isLineBreak(code)) {
      pos++;
      value += String.fromCharCode(code);
      if (code === 13 && text.charCodeAt(pos) === 10) {
        pos++;
        value += "\n";
      }
      lineNumber++;
      tokenLineStartOffset = pos;
      return token = 14;
    }
    switch (code) {
      // tokens: []{}:,
      case 123:
        pos++;
        return token = 1;
      case 125:
        pos++;
        return token = 2;
      case 91:
        pos++;
        return token = 3;
      case 93:
        pos++;
        return token = 4;
      case 58:
        pos++;
        return token = 6;
      case 44:
        pos++;
        return token = 5;
      // strings
      case 34:
        pos++;
        value = scanString();
        return token = 10;
      // comments
      case 47:
        const start = pos - 1;
        if (text.charCodeAt(pos + 1) === 47) {
          pos += 2;
          while (pos < len) {
            if (isLineBreak(text.charCodeAt(pos))) {
              break;
            }
            pos++;
          }
          value = text.substring(start, pos);
          return token = 12;
        }
        if (text.charCodeAt(pos + 1) === 42) {
          pos += 2;
          const safeLength = len - 1;
          let commentClosed = false;
          while (pos < safeLength) {
            const ch = text.charCodeAt(pos);
            if (ch === 42 && text.charCodeAt(pos + 1) === 47) {
              pos += 2;
              commentClosed = true;
              break;
            }
            pos++;
            if (isLineBreak(ch)) {
              if (ch === 13 && text.charCodeAt(pos) === 10) {
                pos++;
              }
              lineNumber++;
              tokenLineStartOffset = pos;
            }
          }
          if (!commentClosed) {
            pos++;
            scanError = 1;
          }
          value = text.substring(start, pos);
          return token = 13;
        }
        value += String.fromCharCode(code);
        pos++;
        return token = 16;
      // numbers
      case 45:
        value += String.fromCharCode(code);
        pos++;
        if (pos === len || !isDigit(text.charCodeAt(pos))) {
          return token = 16;
        }
      // found a minus, followed by a number so
      // we fall through to proceed with scanning
      // numbers
      case 48:
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        value += scanNumber();
        return token = 11;
      // literals and unknown symbols
      default:
        while (pos < len && isUnknownContentCharacter(code)) {
          pos++;
          code = text.charCodeAt(pos);
        }
        if (tokenOffset !== pos) {
          value = text.substring(tokenOffset, pos);
          switch (value) {
            case "true":
              return token = 8;
            case "false":
              return token = 9;
            case "null":
              return token = 7;
          }
          return token = 16;
        }
        value += String.fromCharCode(code);
        pos++;
        return token = 16;
    }
  }
  function isUnknownContentCharacter(code) {
    if (isWhiteSpace(code) || isLineBreak(code)) {
      return false;
    }
    switch (code) {
      case 125:
      case 93:
      case 123:
      case 91:
      case 34:
      case 58:
      case 44:
      case 47:
        return false;
    }
    return true;
  }
  function scanNextNonTrivia() {
    let result;
    do {
      result = scanNext();
    } while (result >= 12 && result <= 15);
    return result;
  }
  return {
    setPosition,
    getPosition: () => pos,
    scan: ignoreTrivia ? scanNextNonTrivia : scanNext,
    getToken: () => token,
    getTokenValue: () => value,
    getTokenOffset: () => tokenOffset,
    getTokenLength: () => pos - tokenOffset,
    getTokenStartLine: () => lineStartOffset,
    getTokenStartCharacter: () => tokenOffset - prevTokenLineStartOffset,
    getTokenError: () => scanError
  };
}
function isWhiteSpace(ch) {
  return ch === 32 || ch === 9;
}
function isLineBreak(ch) {
  return ch === 10 || ch === 13;
}
function isDigit(ch) {
  return ch >= 48 && ch <= 57;
}
var CharacterCodes;
var init_scanner = __esm({
  "node_modules/jsonc-parser/lib/esm/impl/scanner.js"() {
    "use strict";
    (function(CharacterCodes2) {
      CharacterCodes2[CharacterCodes2["lineFeed"] = 10] = "lineFeed";
      CharacterCodes2[CharacterCodes2["carriageReturn"] = 13] = "carriageReturn";
      CharacterCodes2[CharacterCodes2["space"] = 32] = "space";
      CharacterCodes2[CharacterCodes2["_0"] = 48] = "_0";
      CharacterCodes2[CharacterCodes2["_1"] = 49] = "_1";
      CharacterCodes2[CharacterCodes2["_2"] = 50] = "_2";
      CharacterCodes2[CharacterCodes2["_3"] = 51] = "_3";
      CharacterCodes2[CharacterCodes2["_4"] = 52] = "_4";
      CharacterCodes2[CharacterCodes2["_5"] = 53] = "_5";
      CharacterCodes2[CharacterCodes2["_6"] = 54] = "_6";
      CharacterCodes2[CharacterCodes2["_7"] = 55] = "_7";
      CharacterCodes2[CharacterCodes2["_8"] = 56] = "_8";
      CharacterCodes2[CharacterCodes2["_9"] = 57] = "_9";
      CharacterCodes2[CharacterCodes2["a"] = 97] = "a";
      CharacterCodes2[CharacterCodes2["b"] = 98] = "b";
      CharacterCodes2[CharacterCodes2["c"] = 99] = "c";
      CharacterCodes2[CharacterCodes2["d"] = 100] = "d";
      CharacterCodes2[CharacterCodes2["e"] = 101] = "e";
      CharacterCodes2[CharacterCodes2["f"] = 102] = "f";
      CharacterCodes2[CharacterCodes2["g"] = 103] = "g";
      CharacterCodes2[CharacterCodes2["h"] = 104] = "h";
      CharacterCodes2[CharacterCodes2["i"] = 105] = "i";
      CharacterCodes2[CharacterCodes2["j"] = 106] = "j";
      CharacterCodes2[CharacterCodes2["k"] = 107] = "k";
      CharacterCodes2[CharacterCodes2["l"] = 108] = "l";
      CharacterCodes2[CharacterCodes2["m"] = 109] = "m";
      CharacterCodes2[CharacterCodes2["n"] = 110] = "n";
      CharacterCodes2[CharacterCodes2["o"] = 111] = "o";
      CharacterCodes2[CharacterCodes2["p"] = 112] = "p";
      CharacterCodes2[CharacterCodes2["q"] = 113] = "q";
      CharacterCodes2[CharacterCodes2["r"] = 114] = "r";
      CharacterCodes2[CharacterCodes2["s"] = 115] = "s";
      CharacterCodes2[CharacterCodes2["t"] = 116] = "t";
      CharacterCodes2[CharacterCodes2["u"] = 117] = "u";
      CharacterCodes2[CharacterCodes2["v"] = 118] = "v";
      CharacterCodes2[CharacterCodes2["w"] = 119] = "w";
      CharacterCodes2[CharacterCodes2["x"] = 120] = "x";
      CharacterCodes2[CharacterCodes2["y"] = 121] = "y";
      CharacterCodes2[CharacterCodes2["z"] = 122] = "z";
      CharacterCodes2[CharacterCodes2["A"] = 65] = "A";
      CharacterCodes2[CharacterCodes2["B"] = 66] = "B";
      CharacterCodes2[CharacterCodes2["C"] = 67] = "C";
      CharacterCodes2[CharacterCodes2["D"] = 68] = "D";
      CharacterCodes2[CharacterCodes2["E"] = 69] = "E";
      CharacterCodes2[CharacterCodes2["F"] = 70] = "F";
      CharacterCodes2[CharacterCodes2["G"] = 71] = "G";
      CharacterCodes2[CharacterCodes2["H"] = 72] = "H";
      CharacterCodes2[CharacterCodes2["I"] = 73] = "I";
      CharacterCodes2[CharacterCodes2["J"] = 74] = "J";
      CharacterCodes2[CharacterCodes2["K"] = 75] = "K";
      CharacterCodes2[CharacterCodes2["L"] = 76] = "L";
      CharacterCodes2[CharacterCodes2["M"] = 77] = "M";
      CharacterCodes2[CharacterCodes2["N"] = 78] = "N";
      CharacterCodes2[CharacterCodes2["O"] = 79] = "O";
      CharacterCodes2[CharacterCodes2["P"] = 80] = "P";
      CharacterCodes2[CharacterCodes2["Q"] = 81] = "Q";
      CharacterCodes2[CharacterCodes2["R"] = 82] = "R";
      CharacterCodes2[CharacterCodes2["S"] = 83] = "S";
      CharacterCodes2[CharacterCodes2["T"] = 84] = "T";
      CharacterCodes2[CharacterCodes2["U"] = 85] = "U";
      CharacterCodes2[CharacterCodes2["V"] = 86] = "V";
      CharacterCodes2[CharacterCodes2["W"] = 87] = "W";
      CharacterCodes2[CharacterCodes2["X"] = 88] = "X";
      CharacterCodes2[CharacterCodes2["Y"] = 89] = "Y";
      CharacterCodes2[CharacterCodes2["Z"] = 90] = "Z";
      CharacterCodes2[CharacterCodes2["asterisk"] = 42] = "asterisk";
      CharacterCodes2[CharacterCodes2["backslash"] = 92] = "backslash";
      CharacterCodes2[CharacterCodes2["closeBrace"] = 125] = "closeBrace";
      CharacterCodes2[CharacterCodes2["closeBracket"] = 93] = "closeBracket";
      CharacterCodes2[CharacterCodes2["colon"] = 58] = "colon";
      CharacterCodes2[CharacterCodes2["comma"] = 44] = "comma";
      CharacterCodes2[CharacterCodes2["dot"] = 46] = "dot";
      CharacterCodes2[CharacterCodes2["doubleQuote"] = 34] = "doubleQuote";
      CharacterCodes2[CharacterCodes2["minus"] = 45] = "minus";
      CharacterCodes2[CharacterCodes2["openBrace"] = 123] = "openBrace";
      CharacterCodes2[CharacterCodes2["openBracket"] = 91] = "openBracket";
      CharacterCodes2[CharacterCodes2["plus"] = 43] = "plus";
      CharacterCodes2[CharacterCodes2["slash"] = 47] = "slash";
      CharacterCodes2[CharacterCodes2["formFeed"] = 12] = "formFeed";
      CharacterCodes2[CharacterCodes2["tab"] = 9] = "tab";
    })(CharacterCodes || (CharacterCodes = {}));
  }
});

// node_modules/jsonc-parser/lib/esm/impl/string-intern.js
var cachedSpaces, maxCachedValues, cachedBreakLinesWithSpaces, supportedEols;
var init_string_intern = __esm({
  "node_modules/jsonc-parser/lib/esm/impl/string-intern.js"() {
    cachedSpaces = new Array(20).fill(0).map((_, index) => {
      return " ".repeat(index);
    });
    maxCachedValues = 200;
    cachedBreakLinesWithSpaces = {
      " ": {
        "\n": new Array(maxCachedValues).fill(0).map((_, index) => {
          return "\n" + " ".repeat(index);
        }),
        "\r": new Array(maxCachedValues).fill(0).map((_, index) => {
          return "\r" + " ".repeat(index);
        }),
        "\r\n": new Array(maxCachedValues).fill(0).map((_, index) => {
          return "\r\n" + " ".repeat(index);
        })
      },
      "	": {
        "\n": new Array(maxCachedValues).fill(0).map((_, index) => {
          return "\n" + "	".repeat(index);
        }),
        "\r": new Array(maxCachedValues).fill(0).map((_, index) => {
          return "\r" + "	".repeat(index);
        }),
        "\r\n": new Array(maxCachedValues).fill(0).map((_, index) => {
          return "\r\n" + "	".repeat(index);
        })
      }
    };
    supportedEols = ["\n", "\r", "\r\n"];
  }
});

// node_modules/jsonc-parser/lib/esm/impl/format.js
function format(documentText, range, options) {
  let initialIndentLevel;
  let formatText;
  let formatTextStart;
  let rangeStart;
  let rangeEnd;
  if (range) {
    rangeStart = range.offset;
    rangeEnd = rangeStart + range.length;
    formatTextStart = rangeStart;
    while (formatTextStart > 0 && !isEOL(documentText, formatTextStart - 1)) {
      formatTextStart--;
    }
    let endOffset = rangeEnd;
    while (endOffset < documentText.length && !isEOL(documentText, endOffset)) {
      endOffset++;
    }
    formatText = documentText.substring(formatTextStart, endOffset);
    initialIndentLevel = computeIndentLevel(formatText, options);
  } else {
    formatText = documentText;
    initialIndentLevel = 0;
    formatTextStart = 0;
    rangeStart = 0;
    rangeEnd = documentText.length;
  }
  const eol = getEOL(options, documentText);
  const eolFastPathSupported = supportedEols.includes(eol);
  let numberLineBreaks = 0;
  let indentLevel = 0;
  let indentValue;
  if (options.insertSpaces) {
    indentValue = cachedSpaces[options.tabSize || 4] ?? repeat(cachedSpaces[1], options.tabSize || 4);
  } else {
    indentValue = "	";
  }
  const indentType = indentValue === "	" ? "	" : " ";
  let scanner = createScanner(formatText, false);
  let hasError = false;
  function newLinesAndIndent() {
    if (numberLineBreaks > 1) {
      return repeat(eol, numberLineBreaks) + repeat(indentValue, initialIndentLevel + indentLevel);
    }
    const amountOfSpaces = indentValue.length * (initialIndentLevel + indentLevel);
    if (!eolFastPathSupported || amountOfSpaces > cachedBreakLinesWithSpaces[indentType][eol].length) {
      return eol + repeat(indentValue, initialIndentLevel + indentLevel);
    }
    if (amountOfSpaces <= 0) {
      return eol;
    }
    return cachedBreakLinesWithSpaces[indentType][eol][amountOfSpaces];
  }
  function scanNext() {
    let token = scanner.scan();
    numberLineBreaks = 0;
    while (token === 15 || token === 14) {
      if (token === 14 && options.keepLines) {
        numberLineBreaks += 1;
      } else if (token === 14) {
        numberLineBreaks = 1;
      }
      token = scanner.scan();
    }
    hasError = token === 16 || scanner.getTokenError() !== 0;
    return token;
  }
  const editOperations = [];
  function addEdit(text, startOffset, endOffset) {
    if (!hasError && (!range || startOffset < rangeEnd && endOffset > rangeStart) && documentText.substring(startOffset, endOffset) !== text) {
      editOperations.push({ offset: startOffset, length: endOffset - startOffset, content: text });
    }
  }
  let firstToken = scanNext();
  if (options.keepLines && numberLineBreaks > 0) {
    addEdit(repeat(eol, numberLineBreaks), 0, 0);
  }
  if (firstToken !== 17) {
    let firstTokenStart = scanner.getTokenOffset() + formatTextStart;
    let initialIndent = indentValue.length * initialIndentLevel < 20 && options.insertSpaces ? cachedSpaces[indentValue.length * initialIndentLevel] : repeat(indentValue, initialIndentLevel);
    addEdit(initialIndent, formatTextStart, firstTokenStart);
  }
  while (firstToken !== 17) {
    let firstTokenEnd = scanner.getTokenOffset() + scanner.getTokenLength() + formatTextStart;
    let secondToken = scanNext();
    let replaceContent = "";
    let needsLineBreak = false;
    while (numberLineBreaks === 0 && (secondToken === 12 || secondToken === 13)) {
      let commentTokenStart = scanner.getTokenOffset() + formatTextStart;
      addEdit(cachedSpaces[1], firstTokenEnd, commentTokenStart);
      firstTokenEnd = scanner.getTokenOffset() + scanner.getTokenLength() + formatTextStart;
      needsLineBreak = secondToken === 12;
      replaceContent = needsLineBreak ? newLinesAndIndent() : "";
      secondToken = scanNext();
    }
    if (secondToken === 2) {
      if (firstToken !== 1) {
        indentLevel--;
      }
      ;
      if (options.keepLines && numberLineBreaks > 0 || !options.keepLines && firstToken !== 1) {
        replaceContent = newLinesAndIndent();
      } else if (options.keepLines) {
        replaceContent = cachedSpaces[1];
      }
    } else if (secondToken === 4) {
      if (firstToken !== 3) {
        indentLevel--;
      }
      ;
      if (options.keepLines && numberLineBreaks > 0 || !options.keepLines && firstToken !== 3) {
        replaceContent = newLinesAndIndent();
      } else if (options.keepLines) {
        replaceContent = cachedSpaces[1];
      }
    } else {
      switch (firstToken) {
        case 3:
        case 1:
          indentLevel++;
          if (options.keepLines && numberLineBreaks > 0 || !options.keepLines) {
            replaceContent = newLinesAndIndent();
          } else {
            replaceContent = cachedSpaces[1];
          }
          break;
        case 5:
          if (options.keepLines && numberLineBreaks > 0 || !options.keepLines) {
            replaceContent = newLinesAndIndent();
          } else {
            replaceContent = cachedSpaces[1];
          }
          break;
        case 12:
          replaceContent = newLinesAndIndent();
          break;
        case 13:
          if (numberLineBreaks > 0) {
            replaceContent = newLinesAndIndent();
          } else if (!needsLineBreak) {
            replaceContent = cachedSpaces[1];
          }
          break;
        case 6:
          if (options.keepLines && numberLineBreaks > 0) {
            replaceContent = newLinesAndIndent();
          } else if (!needsLineBreak) {
            replaceContent = cachedSpaces[1];
          }
          break;
        case 10:
          if (options.keepLines && numberLineBreaks > 0) {
            replaceContent = newLinesAndIndent();
          } else if (secondToken === 6 && !needsLineBreak) {
            replaceContent = "";
          }
          break;
        case 7:
        case 8:
        case 9:
        case 11:
        case 2:
        case 4:
          if (options.keepLines && numberLineBreaks > 0) {
            replaceContent = newLinesAndIndent();
          } else {
            if ((secondToken === 12 || secondToken === 13) && !needsLineBreak) {
              replaceContent = cachedSpaces[1];
            } else if (secondToken !== 5 && secondToken !== 17) {
              hasError = true;
            }
          }
          break;
        case 16:
          hasError = true;
          break;
      }
      if (numberLineBreaks > 0 && (secondToken === 12 || secondToken === 13)) {
        replaceContent = newLinesAndIndent();
      }
    }
    if (secondToken === 17) {
      if (options.keepLines && numberLineBreaks > 0) {
        replaceContent = newLinesAndIndent();
      } else {
        replaceContent = options.insertFinalNewline ? eol : "";
      }
    }
    const secondTokenStart = scanner.getTokenOffset() + formatTextStart;
    addEdit(replaceContent, firstTokenEnd, secondTokenStart);
    firstToken = secondToken;
  }
  return editOperations;
}
function repeat(s, count) {
  let result = "";
  for (let i = 0; i < count; i++) {
    result += s;
  }
  return result;
}
function computeIndentLevel(content, options) {
  let i = 0;
  let nChars = 0;
  const tabSize = options.tabSize || 4;
  while (i < content.length) {
    let ch = content.charAt(i);
    if (ch === cachedSpaces[1]) {
      nChars++;
    } else if (ch === "	") {
      nChars += tabSize;
    } else {
      break;
    }
    i++;
  }
  return Math.floor(nChars / tabSize);
}
function getEOL(options, text) {
  for (let i = 0; i < text.length; i++) {
    const ch = text.charAt(i);
    if (ch === "\r") {
      if (i + 1 < text.length && text.charAt(i + 1) === "\n") {
        return "\r\n";
      }
      return "\r";
    } else if (ch === "\n") {
      return "\n";
    }
  }
  return options && options.eol || "\n";
}
function isEOL(text, offset) {
  return "\r\n".indexOf(text.charAt(offset)) !== -1;
}
var init_format = __esm({
  "node_modules/jsonc-parser/lib/esm/impl/format.js"() {
    "use strict";
    init_scanner();
    init_string_intern();
  }
});

// node_modules/jsonc-parser/lib/esm/impl/parser.js
function getLocation(text, position) {
  const segments = [];
  const earlyReturnException = new Object();
  let previousNode = void 0;
  const previousNodeInst = {
    value: {},
    offset: 0,
    length: 0,
    type: "object",
    parent: void 0
  };
  let isAtPropertyKey = false;
  function setPreviousNode(value, offset, length, type) {
    previousNodeInst.value = value;
    previousNodeInst.offset = offset;
    previousNodeInst.length = length;
    previousNodeInst.type = type;
    previousNodeInst.colonOffset = void 0;
    previousNode = previousNodeInst;
  }
  try {
    visit(text, {
      onObjectBegin: (offset, length) => {
        if (position <= offset) {
          throw earlyReturnException;
        }
        previousNode = void 0;
        isAtPropertyKey = position > offset;
        segments.push("");
      },
      onObjectProperty: (name, offset, length) => {
        if (position < offset) {
          throw earlyReturnException;
        }
        setPreviousNode(name, offset, length, "property");
        segments[segments.length - 1] = name;
        if (position <= offset + length) {
          throw earlyReturnException;
        }
      },
      onObjectEnd: (offset, length) => {
        if (position <= offset) {
          throw earlyReturnException;
        }
        previousNode = void 0;
        segments.pop();
      },
      onArrayBegin: (offset, length) => {
        if (position <= offset) {
          throw earlyReturnException;
        }
        previousNode = void 0;
        segments.push(0);
      },
      onArrayEnd: (offset, length) => {
        if (position <= offset) {
          throw earlyReturnException;
        }
        previousNode = void 0;
        segments.pop();
      },
      onLiteralValue: (value, offset, length) => {
        if (position < offset) {
          throw earlyReturnException;
        }
        setPreviousNode(value, offset, length, getNodeType(value));
        if (position <= offset + length) {
          throw earlyReturnException;
        }
      },
      onSeparator: (sep, offset, length) => {
        if (position <= offset) {
          throw earlyReturnException;
        }
        if (sep === ":" && previousNode && previousNode.type === "property") {
          previousNode.colonOffset = offset;
          isAtPropertyKey = false;
          previousNode = void 0;
        } else if (sep === ",") {
          const last = segments[segments.length - 1];
          if (typeof last === "number") {
            segments[segments.length - 1] = last + 1;
          } else {
            isAtPropertyKey = true;
            segments[segments.length - 1] = "";
          }
          previousNode = void 0;
        }
      }
    });
  } catch (e) {
    if (e !== earlyReturnException) {
      throw e;
    }
  }
  return {
    path: segments,
    previousNode,
    isAtPropertyKey,
    matches: (pattern) => {
      let k = 0;
      for (let i = 0; k < pattern.length && i < segments.length; i++) {
        if (pattern[k] === segments[i] || pattern[k] === "*") {
          k++;
        } else if (pattern[k] !== "**") {
          return false;
        }
      }
      return k === pattern.length;
    }
  };
}
function parse(text, errors = [], options = ParseOptions.DEFAULT) {
  let currentProperty = null;
  let currentParent = [];
  const previousParents = [];
  function onValue(value) {
    if (Array.isArray(currentParent)) {
      currentParent.push(value);
    } else if (currentProperty !== null) {
      currentParent[currentProperty] = value;
    }
  }
  const visitor = {
    onObjectBegin: () => {
      const object = {};
      onValue(object);
      previousParents.push(currentParent);
      currentParent = object;
      currentProperty = null;
    },
    onObjectProperty: (name) => {
      currentProperty = name;
    },
    onObjectEnd: () => {
      currentParent = previousParents.pop();
    },
    onArrayBegin: () => {
      const array = [];
      onValue(array);
      previousParents.push(currentParent);
      currentParent = array;
      currentProperty = null;
    },
    onArrayEnd: () => {
      currentParent = previousParents.pop();
    },
    onLiteralValue: onValue,
    onError: (error, offset, length) => {
      errors.push({ error, offset, length });
    }
  };
  visit(text, visitor, options);
  return currentParent[0];
}
function parseTree(text, errors = [], options = ParseOptions.DEFAULT) {
  let currentParent = { type: "array", offset: -1, length: -1, children: [], parent: void 0 };
  function ensurePropertyComplete(endOffset) {
    if (currentParent.type === "property") {
      currentParent.length = endOffset - currentParent.offset;
      currentParent = currentParent.parent;
    }
  }
  function onValue(valueNode) {
    currentParent.children.push(valueNode);
    return valueNode;
  }
  const visitor = {
    onObjectBegin: (offset) => {
      currentParent = onValue({ type: "object", offset, length: -1, parent: currentParent, children: [] });
    },
    onObjectProperty: (name, offset, length) => {
      currentParent = onValue({ type: "property", offset, length: -1, parent: currentParent, children: [] });
      currentParent.children.push({ type: "string", value: name, offset, length, parent: currentParent });
    },
    onObjectEnd: (offset, length) => {
      ensurePropertyComplete(offset + length);
      currentParent.length = offset + length - currentParent.offset;
      currentParent = currentParent.parent;
      ensurePropertyComplete(offset + length);
    },
    onArrayBegin: (offset, length) => {
      currentParent = onValue({ type: "array", offset, length: -1, parent: currentParent, children: [] });
    },
    onArrayEnd: (offset, length) => {
      currentParent.length = offset + length - currentParent.offset;
      currentParent = currentParent.parent;
      ensurePropertyComplete(offset + length);
    },
    onLiteralValue: (value, offset, length) => {
      onValue({ type: getNodeType(value), offset, length, parent: currentParent, value });
      ensurePropertyComplete(offset + length);
    },
    onSeparator: (sep, offset, length) => {
      if (currentParent.type === "property") {
        if (sep === ":") {
          currentParent.colonOffset = offset;
        } else if (sep === ",") {
          ensurePropertyComplete(offset);
        }
      }
    },
    onError: (error, offset, length) => {
      errors.push({ error, offset, length });
    }
  };
  visit(text, visitor, options);
  const result = currentParent.children[0];
  if (result) {
    delete result.parent;
  }
  return result;
}
function findNodeAtLocation(root, path) {
  if (!root) {
    return void 0;
  }
  let node = root;
  for (let segment of path) {
    if (typeof segment === "string") {
      if (node.type !== "object" || !Array.isArray(node.children)) {
        return void 0;
      }
      let found = false;
      for (const propertyNode of node.children) {
        if (Array.isArray(propertyNode.children) && propertyNode.children[0].value === segment && propertyNode.children.length === 2) {
          node = propertyNode.children[1];
          found = true;
          break;
        }
      }
      if (!found) {
        return void 0;
      }
    } else {
      const index = segment;
      if (node.type !== "array" || index < 0 || !Array.isArray(node.children) || index >= node.children.length) {
        return void 0;
      }
      node = node.children[index];
    }
  }
  return node;
}
function getNodePath(node) {
  if (!node.parent || !node.parent.children) {
    return [];
  }
  const path = getNodePath(node.parent);
  if (node.parent.type === "property") {
    const key = node.parent.children[0].value;
    path.push(key);
  } else if (node.parent.type === "array") {
    const index = node.parent.children.indexOf(node);
    if (index !== -1) {
      path.push(index);
    }
  }
  return path;
}
function getNodeValue(node) {
  switch (node.type) {
    case "array":
      return node.children.map(getNodeValue);
    case "object":
      const obj = /* @__PURE__ */ Object.create(null);
      for (let prop of node.children) {
        const valueNode = prop.children[1];
        if (valueNode) {
          obj[prop.children[0].value] = getNodeValue(valueNode);
        }
      }
      return obj;
    case "null":
    case "string":
    case "number":
    case "boolean":
      return node.value;
    default:
      return void 0;
  }
}
function contains(node, offset, includeRightBound = false) {
  return offset >= node.offset && offset < node.offset + node.length || includeRightBound && offset === node.offset + node.length;
}
function findNodeAtOffset(node, offset, includeRightBound = false) {
  if (contains(node, offset, includeRightBound)) {
    const children = node.children;
    if (Array.isArray(children)) {
      for (let i = 0; i < children.length && children[i].offset <= offset; i++) {
        const item = findNodeAtOffset(children[i], offset, includeRightBound);
        if (item) {
          return item;
        }
      }
    }
    return node;
  }
  return void 0;
}
function visit(text, visitor, options = ParseOptions.DEFAULT) {
  const _scanner = createScanner(text, false);
  const _jsonPath = [];
  let suppressedCallbacks = 0;
  function toNoArgVisit(visitFunction) {
    return visitFunction ? () => suppressedCallbacks === 0 && visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter()) : () => true;
  }
  function toOneArgVisit(visitFunction) {
    return visitFunction ? (arg) => suppressedCallbacks === 0 && visitFunction(arg, _scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter()) : () => true;
  }
  function toOneArgVisitWithPath(visitFunction) {
    return visitFunction ? (arg) => suppressedCallbacks === 0 && visitFunction(arg, _scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter(), () => _jsonPath.slice()) : () => true;
  }
  function toBeginVisit(visitFunction) {
    return visitFunction ? () => {
      if (suppressedCallbacks > 0) {
        suppressedCallbacks++;
      } else {
        let cbReturn = visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter(), () => _jsonPath.slice());
        if (cbReturn === false) {
          suppressedCallbacks = 1;
        }
      }
    } : () => true;
  }
  function toEndVisit(visitFunction) {
    return visitFunction ? () => {
      if (suppressedCallbacks > 0) {
        suppressedCallbacks--;
      }
      if (suppressedCallbacks === 0) {
        visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter());
      }
    } : () => true;
  }
  const onObjectBegin = toBeginVisit(visitor.onObjectBegin), onObjectProperty = toOneArgVisitWithPath(visitor.onObjectProperty), onObjectEnd = toEndVisit(visitor.onObjectEnd), onArrayBegin = toBeginVisit(visitor.onArrayBegin), onArrayEnd = toEndVisit(visitor.onArrayEnd), onLiteralValue = toOneArgVisitWithPath(visitor.onLiteralValue), onSeparator = toOneArgVisit(visitor.onSeparator), onComment = toNoArgVisit(visitor.onComment), onError = toOneArgVisit(visitor.onError);
  const disallowComments = options && options.disallowComments;
  const allowTrailingComma = options && options.allowTrailingComma;
  function scanNext() {
    while (true) {
      const token = _scanner.scan();
      switch (_scanner.getTokenError()) {
        case 4:
          handleError(
            14
            /* ParseErrorCode.InvalidUnicode */
          );
          break;
        case 5:
          handleError(
            15
            /* ParseErrorCode.InvalidEscapeCharacter */
          );
          break;
        case 3:
          handleError(
            13
            /* ParseErrorCode.UnexpectedEndOfNumber */
          );
          break;
        case 1:
          if (!disallowComments) {
            handleError(
              11
              /* ParseErrorCode.UnexpectedEndOfComment */
            );
          }
          break;
        case 2:
          handleError(
            12
            /* ParseErrorCode.UnexpectedEndOfString */
          );
          break;
        case 6:
          handleError(
            16
            /* ParseErrorCode.InvalidCharacter */
          );
          break;
      }
      switch (token) {
        case 12:
        case 13:
          if (disallowComments) {
            handleError(
              10
              /* ParseErrorCode.InvalidCommentToken */
            );
          } else {
            onComment();
          }
          break;
        case 16:
          handleError(
            1
            /* ParseErrorCode.InvalidSymbol */
          );
          break;
        case 15:
        case 14:
          break;
        default:
          return token;
      }
    }
  }
  function handleError(error, skipUntilAfter = [], skipUntil = []) {
    onError(error);
    if (skipUntilAfter.length + skipUntil.length > 0) {
      let token = _scanner.getToken();
      while (token !== 17) {
        if (skipUntilAfter.indexOf(token) !== -1) {
          scanNext();
          break;
        } else if (skipUntil.indexOf(token) !== -1) {
          break;
        }
        token = scanNext();
      }
    }
  }
  function parseString(isValue) {
    const value = _scanner.getTokenValue();
    if (isValue) {
      onLiteralValue(value);
    } else {
      onObjectProperty(value);
      _jsonPath.push(value);
    }
    scanNext();
    return true;
  }
  function parseLiteral() {
    switch (_scanner.getToken()) {
      case 11:
        const tokenValue = _scanner.getTokenValue();
        let value = Number(tokenValue);
        if (isNaN(value)) {
          handleError(
            2
            /* ParseErrorCode.InvalidNumberFormat */
          );
          value = 0;
        }
        onLiteralValue(value);
        break;
      case 7:
        onLiteralValue(null);
        break;
      case 8:
        onLiteralValue(true);
        break;
      case 9:
        onLiteralValue(false);
        break;
      default:
        return false;
    }
    scanNext();
    return true;
  }
  function parseProperty() {
    if (_scanner.getToken() !== 10) {
      handleError(3, [], [
        2,
        5
        /* SyntaxKind.CommaToken */
      ]);
      return false;
    }
    parseString(false);
    if (_scanner.getToken() === 6) {
      onSeparator(":");
      scanNext();
      if (!parseValue()) {
        handleError(4, [], [
          2,
          5
          /* SyntaxKind.CommaToken */
        ]);
      }
    } else {
      handleError(5, [], [
        2,
        5
        /* SyntaxKind.CommaToken */
      ]);
    }
    _jsonPath.pop();
    return true;
  }
  function parseObject() {
    onObjectBegin();
    scanNext();
    let needsComma = false;
    while (_scanner.getToken() !== 2 && _scanner.getToken() !== 17) {
      if (_scanner.getToken() === 5) {
        if (!needsComma) {
          handleError(4, [], []);
        }
        onSeparator(",");
        scanNext();
        if (_scanner.getToken() === 2 && allowTrailingComma) {
          break;
        }
      } else if (needsComma) {
        handleError(6, [], []);
      }
      if (!parseProperty()) {
        handleError(4, [], [
          2,
          5
          /* SyntaxKind.CommaToken */
        ]);
      }
      needsComma = true;
    }
    onObjectEnd();
    if (_scanner.getToken() !== 2) {
      handleError(7, [
        2
        /* SyntaxKind.CloseBraceToken */
      ], []);
    } else {
      scanNext();
    }
    return true;
  }
  function parseArray() {
    onArrayBegin();
    scanNext();
    let isFirstElement = true;
    let needsComma = false;
    while (_scanner.getToken() !== 4 && _scanner.getToken() !== 17) {
      if (_scanner.getToken() === 5) {
        if (!needsComma) {
          handleError(4, [], []);
        }
        onSeparator(",");
        scanNext();
        if (_scanner.getToken() === 4 && allowTrailingComma) {
          break;
        }
      } else if (needsComma) {
        handleError(6, [], []);
      }
      if (isFirstElement) {
        _jsonPath.push(0);
        isFirstElement = false;
      } else {
        _jsonPath[_jsonPath.length - 1]++;
      }
      if (!parseValue()) {
        handleError(4, [], [
          4,
          5
          /* SyntaxKind.CommaToken */
        ]);
      }
      needsComma = true;
    }
    onArrayEnd();
    if (!isFirstElement) {
      _jsonPath.pop();
    }
    if (_scanner.getToken() !== 4) {
      handleError(8, [
        4
        /* SyntaxKind.CloseBracketToken */
      ], []);
    } else {
      scanNext();
    }
    return true;
  }
  function parseValue() {
    switch (_scanner.getToken()) {
      case 3:
        return parseArray();
      case 1:
        return parseObject();
      case 10:
        return parseString(true);
      default:
        return parseLiteral();
    }
  }
  scanNext();
  if (_scanner.getToken() === 17) {
    if (options.allowEmptyContent) {
      return true;
    }
    handleError(4, [], []);
    return false;
  }
  if (!parseValue()) {
    handleError(4, [], []);
    return false;
  }
  if (_scanner.getToken() !== 17) {
    handleError(9, [], []);
  }
  return true;
}
function stripComments(text, replaceCh) {
  let _scanner = createScanner(text), parts = [], kind, offset = 0, pos;
  do {
    pos = _scanner.getPosition();
    kind = _scanner.scan();
    switch (kind) {
      case 12:
      case 13:
      case 17:
        if (offset !== pos) {
          parts.push(text.substring(offset, pos));
        }
        if (replaceCh !== void 0) {
          parts.push(_scanner.getTokenValue().replace(/[^\r\n]/g, replaceCh));
        }
        offset = _scanner.getPosition();
        break;
    }
  } while (kind !== 17);
  return parts.join("");
}
function getNodeType(value) {
  switch (typeof value) {
    case "boolean":
      return "boolean";
    case "number":
      return "number";
    case "string":
      return "string";
    case "object": {
      if (!value) {
        return "null";
      } else if (Array.isArray(value)) {
        return "array";
      }
      return "object";
    }
    default:
      return "null";
  }
}
var ParseOptions;
var init_parser = __esm({
  "node_modules/jsonc-parser/lib/esm/impl/parser.js"() {
    "use strict";
    init_scanner();
    (function(ParseOptions2) {
      ParseOptions2.DEFAULT = {
        allowTrailingComma: false
      };
    })(ParseOptions || (ParseOptions = {}));
  }
});

// node_modules/jsonc-parser/lib/esm/impl/edit.js
function setProperty(text, originalPath, value, options) {
  const path = originalPath.slice();
  const errors = [];
  const root = parseTree(text, errors);
  let parent = void 0;
  let lastSegment = void 0;
  while (path.length > 0) {
    lastSegment = path.pop();
    parent = findNodeAtLocation(root, path);
    if (parent === void 0 && value !== void 0) {
      if (typeof lastSegment === "string") {
        value = { [lastSegment]: value };
      } else {
        value = [value];
      }
    } else {
      break;
    }
  }
  if (!parent) {
    if (value === void 0) {
      throw new Error("Can not delete in empty document");
    }
    return withFormatting(text, { offset: root ? root.offset : 0, length: root ? root.length : 0, content: JSON.stringify(value) }, options);
  } else if (parent.type === "object" && typeof lastSegment === "string" && Array.isArray(parent.children)) {
    const existing = findNodeAtLocation(parent, [lastSegment]);
    if (existing !== void 0) {
      if (value === void 0) {
        if (!existing.parent) {
          throw new Error("Malformed AST");
        }
        const propertyIndex = parent.children.indexOf(existing.parent);
        let removeBegin;
        let removeEnd = existing.parent.offset + existing.parent.length;
        if (propertyIndex > 0) {
          let previous = parent.children[propertyIndex - 1];
          removeBegin = previous.offset + previous.length;
        } else {
          removeBegin = parent.offset + 1;
          if (parent.children.length > 1) {
            let next = parent.children[1];
            removeEnd = next.offset;
          }
        }
        return withFormatting(text, { offset: removeBegin, length: removeEnd - removeBegin, content: "" }, options);
      } else {
        return withFormatting(text, { offset: existing.offset, length: existing.length, content: JSON.stringify(value) }, options);
      }
    } else {
      if (value === void 0) {
        return [];
      }
      const newProperty = `${JSON.stringify(lastSegment)}: ${JSON.stringify(value)}`;
      const index = options.getInsertionIndex ? options.getInsertionIndex(parent.children.map((p) => p.children[0].value)) : parent.children.length;
      let edit;
      if (index > 0) {
        let previous = parent.children[index - 1];
        edit = { offset: previous.offset + previous.length, length: 0, content: "," + newProperty };
      } else if (parent.children.length === 0) {
        edit = { offset: parent.offset + 1, length: 0, content: newProperty };
      } else {
        edit = { offset: parent.offset + 1, length: 0, content: newProperty + "," };
      }
      return withFormatting(text, edit, options);
    }
  } else if (parent.type === "array" && typeof lastSegment === "number" && Array.isArray(parent.children)) {
    const insertIndex = lastSegment;
    if (insertIndex === -1) {
      const newProperty = `${JSON.stringify(value)}`;
      let edit;
      if (parent.children.length === 0) {
        edit = { offset: parent.offset + 1, length: 0, content: newProperty };
      } else {
        const previous = parent.children[parent.children.length - 1];
        edit = { offset: previous.offset + previous.length, length: 0, content: "," + newProperty };
      }
      return withFormatting(text, edit, options);
    } else if (value === void 0 && parent.children.length >= 0) {
      const removalIndex = lastSegment;
      const toRemove = parent.children[removalIndex];
      let edit;
      if (parent.children.length === 1) {
        edit = { offset: parent.offset + 1, length: parent.length - 2, content: "" };
      } else if (parent.children.length - 1 === removalIndex) {
        let previous = parent.children[removalIndex - 1];
        let offset = previous.offset + previous.length;
        let parentEndOffset = parent.offset + parent.length;
        edit = { offset, length: parentEndOffset - 2 - offset, content: "" };
      } else {
        edit = { offset: toRemove.offset, length: parent.children[removalIndex + 1].offset - toRemove.offset, content: "" };
      }
      return withFormatting(text, edit, options);
    } else if (value !== void 0) {
      let edit;
      const newProperty = `${JSON.stringify(value)}`;
      if (!options.isArrayInsertion && parent.children.length > lastSegment) {
        const toModify = parent.children[lastSegment];
        edit = { offset: toModify.offset, length: toModify.length, content: newProperty };
      } else if (parent.children.length === 0 || lastSegment === 0) {
        edit = { offset: parent.offset + 1, length: 0, content: parent.children.length === 0 ? newProperty : newProperty + "," };
      } else {
        const index = lastSegment > parent.children.length ? parent.children.length : lastSegment;
        const previous = parent.children[index - 1];
        edit = { offset: previous.offset + previous.length, length: 0, content: "," + newProperty };
      }
      return withFormatting(text, edit, options);
    } else {
      throw new Error(`Can not ${value === void 0 ? "remove" : options.isArrayInsertion ? "insert" : "modify"} Array index ${insertIndex} as length is not sufficient`);
    }
  } else {
    throw new Error(`Can not add ${typeof lastSegment !== "number" ? "index" : "property"} to parent of type ${parent.type}`);
  }
}
function withFormatting(text, edit, options) {
  if (!options.formattingOptions) {
    return [edit];
  }
  let newText = applyEdit(text, edit);
  let begin = edit.offset;
  let end = edit.offset + edit.content.length;
  if (edit.length === 0 || edit.content.length === 0) {
    while (begin > 0 && !isEOL(newText, begin - 1)) {
      begin--;
    }
    while (end < newText.length && !isEOL(newText, end)) {
      end++;
    }
  }
  const edits = format(newText, { offset: begin, length: end - begin }, { ...options.formattingOptions, keepLines: false });
  for (let i = edits.length - 1; i >= 0; i--) {
    const edit2 = edits[i];
    newText = applyEdit(newText, edit2);
    begin = Math.min(begin, edit2.offset);
    end = Math.max(end, edit2.offset + edit2.length);
    end += edit2.content.length - edit2.length;
  }
  const editLength = text.length - (newText.length - end) - begin;
  return [{ offset: begin, length: editLength, content: newText.substring(begin, end) }];
}
function applyEdit(text, edit) {
  return text.substring(0, edit.offset) + edit.content + text.substring(edit.offset + edit.length);
}
var init_edit = __esm({
  "node_modules/jsonc-parser/lib/esm/impl/edit.js"() {
    "use strict";
    init_format();
    init_parser();
  }
});

// node_modules/jsonc-parser/lib/esm/main.js
var main_exports = {};
__export(main_exports, {
  ParseErrorCode: () => ParseErrorCode,
  ScanError: () => ScanError,
  SyntaxKind: () => SyntaxKind,
  applyEdits: () => applyEdits,
  createScanner: () => createScanner2,
  findNodeAtLocation: () => findNodeAtLocation2,
  findNodeAtOffset: () => findNodeAtOffset2,
  format: () => format2,
  getLocation: () => getLocation2,
  getNodePath: () => getNodePath2,
  getNodeValue: () => getNodeValue2,
  modify: () => modify,
  parse: () => parse2,
  parseTree: () => parseTree2,
  printParseErrorCode: () => printParseErrorCode,
  stripComments: () => stripComments2,
  visit: () => visit2
});
function printParseErrorCode(code) {
  switch (code) {
    case 1:
      return "InvalidSymbol";
    case 2:
      return "InvalidNumberFormat";
    case 3:
      return "PropertyNameExpected";
    case 4:
      return "ValueExpected";
    case 5:
      return "ColonExpected";
    case 6:
      return "CommaExpected";
    case 7:
      return "CloseBraceExpected";
    case 8:
      return "CloseBracketExpected";
    case 9:
      return "EndOfFileExpected";
    case 10:
      return "InvalidCommentToken";
    case 11:
      return "UnexpectedEndOfComment";
    case 12:
      return "UnexpectedEndOfString";
    case 13:
      return "UnexpectedEndOfNumber";
    case 14:
      return "InvalidUnicode";
    case 15:
      return "InvalidEscapeCharacter";
    case 16:
      return "InvalidCharacter";
  }
  return "<unknown ParseErrorCode>";
}
function format2(documentText, range, options) {
  return format(documentText, range, options);
}
function modify(text, path, value, options) {
  return setProperty(text, path, value, options);
}
function applyEdits(text, edits) {
  let sortedEdits = edits.slice(0).sort((a, b) => {
    const diff = a.offset - b.offset;
    if (diff === 0) {
      return a.length - b.length;
    }
    return diff;
  });
  let lastModifiedOffset = text.length;
  for (let i = sortedEdits.length - 1; i >= 0; i--) {
    let e = sortedEdits[i];
    if (e.offset + e.length <= lastModifiedOffset) {
      text = applyEdit(text, e);
    } else {
      throw new Error("Overlapping edit");
    }
    lastModifiedOffset = e.offset;
  }
  return text;
}
var createScanner2, ScanError, SyntaxKind, getLocation2, parse2, parseTree2, findNodeAtLocation2, findNodeAtOffset2, getNodePath2, getNodeValue2, visit2, stripComments2, ParseErrorCode;
var init_main = __esm({
  "node_modules/jsonc-parser/lib/esm/main.js"() {
    "use strict";
    init_format();
    init_edit();
    init_scanner();
    init_parser();
    createScanner2 = createScanner;
    (function(ScanError2) {
      ScanError2[ScanError2["None"] = 0] = "None";
      ScanError2[ScanError2["UnexpectedEndOfComment"] = 1] = "UnexpectedEndOfComment";
      ScanError2[ScanError2["UnexpectedEndOfString"] = 2] = "UnexpectedEndOfString";
      ScanError2[ScanError2["UnexpectedEndOfNumber"] = 3] = "UnexpectedEndOfNumber";
      ScanError2[ScanError2["InvalidUnicode"] = 4] = "InvalidUnicode";
      ScanError2[ScanError2["InvalidEscapeCharacter"] = 5] = "InvalidEscapeCharacter";
      ScanError2[ScanError2["InvalidCharacter"] = 6] = "InvalidCharacter";
    })(ScanError || (ScanError = {}));
    (function(SyntaxKind2) {
      SyntaxKind2[SyntaxKind2["OpenBraceToken"] = 1] = "OpenBraceToken";
      SyntaxKind2[SyntaxKind2["CloseBraceToken"] = 2] = "CloseBraceToken";
      SyntaxKind2[SyntaxKind2["OpenBracketToken"] = 3] = "OpenBracketToken";
      SyntaxKind2[SyntaxKind2["CloseBracketToken"] = 4] = "CloseBracketToken";
      SyntaxKind2[SyntaxKind2["CommaToken"] = 5] = "CommaToken";
      SyntaxKind2[SyntaxKind2["ColonToken"] = 6] = "ColonToken";
      SyntaxKind2[SyntaxKind2["NullKeyword"] = 7] = "NullKeyword";
      SyntaxKind2[SyntaxKind2["TrueKeyword"] = 8] = "TrueKeyword";
      SyntaxKind2[SyntaxKind2["FalseKeyword"] = 9] = "FalseKeyword";
      SyntaxKind2[SyntaxKind2["StringLiteral"] = 10] = "StringLiteral";
      SyntaxKind2[SyntaxKind2["NumericLiteral"] = 11] = "NumericLiteral";
      SyntaxKind2[SyntaxKind2["LineCommentTrivia"] = 12] = "LineCommentTrivia";
      SyntaxKind2[SyntaxKind2["BlockCommentTrivia"] = 13] = "BlockCommentTrivia";
      SyntaxKind2[SyntaxKind2["LineBreakTrivia"] = 14] = "LineBreakTrivia";
      SyntaxKind2[SyntaxKind2["Trivia"] = 15] = "Trivia";
      SyntaxKind2[SyntaxKind2["Unknown"] = 16] = "Unknown";
      SyntaxKind2[SyntaxKind2["EOF"] = 17] = "EOF";
    })(SyntaxKind || (SyntaxKind = {}));
    getLocation2 = getLocation;
    parse2 = parse;
    parseTree2 = parseTree;
    findNodeAtLocation2 = findNodeAtLocation;
    findNodeAtOffset2 = findNodeAtOffset;
    getNodePath2 = getNodePath;
    getNodeValue2 = getNodeValue;
    visit2 = visit;
    stripComments2 = stripComments;
    (function(ParseErrorCode2) {
      ParseErrorCode2[ParseErrorCode2["InvalidSymbol"] = 1] = "InvalidSymbol";
      ParseErrorCode2[ParseErrorCode2["InvalidNumberFormat"] = 2] = "InvalidNumberFormat";
      ParseErrorCode2[ParseErrorCode2["PropertyNameExpected"] = 3] = "PropertyNameExpected";
      ParseErrorCode2[ParseErrorCode2["ValueExpected"] = 4] = "ValueExpected";
      ParseErrorCode2[ParseErrorCode2["ColonExpected"] = 5] = "ColonExpected";
      ParseErrorCode2[ParseErrorCode2["CommaExpected"] = 6] = "CommaExpected";
      ParseErrorCode2[ParseErrorCode2["CloseBraceExpected"] = 7] = "CloseBraceExpected";
      ParseErrorCode2[ParseErrorCode2["CloseBracketExpected"] = 8] = "CloseBracketExpected";
      ParseErrorCode2[ParseErrorCode2["EndOfFileExpected"] = 9] = "EndOfFileExpected";
      ParseErrorCode2[ParseErrorCode2["InvalidCommentToken"] = 10] = "InvalidCommentToken";
      ParseErrorCode2[ParseErrorCode2["UnexpectedEndOfComment"] = 11] = "UnexpectedEndOfComment";
      ParseErrorCode2[ParseErrorCode2["UnexpectedEndOfString"] = 12] = "UnexpectedEndOfString";
      ParseErrorCode2[ParseErrorCode2["UnexpectedEndOfNumber"] = 13] = "UnexpectedEndOfNumber";
      ParseErrorCode2[ParseErrorCode2["InvalidUnicode"] = 14] = "InvalidUnicode";
      ParseErrorCode2[ParseErrorCode2["InvalidEscapeCharacter"] = 15] = "InvalidEscapeCharacter";
      ParseErrorCode2[ParseErrorCode2["InvalidCharacter"] = 16] = "InvalidCharacter";
    })(ParseErrorCode || (ParseErrorCode = {}));
  }
});

// src/extension-core.js
var require_extension_core = __commonJS({
  "src/extension-core.js"(exports2, module2) {
    var vscode = require("vscode");
    var fs = require("fs");
    var path = require("path");
    var jsonc = (init_main(), __toCommonJS(main_exports));
    var editModeActive = false;
    function formatToCustomShorthand(nativeKeybinding) {
      if (!nativeKeybinding) return "";
      const specialKeysMap = {
        "arrowup": "UP",
        "arrowdown": "DOWN",
        "arrowleft": "LEFT",
        "arrowright": "RIGHT",
        "escape": "ESC",
        "enter": "ENTER",
        "tab": "TAB",
        "space": "SPACE",
        "backspace": "BACKSPACE",
        "delete": "DEL",
        "insert": "INS",
        "pageup": "PGUP",
        "pagedown": "PGDN",
        "home": "HOME",
        "end": "END",
        "capslock": "CAPS"
      };
      const chords = nativeKeybinding.trim().split(/\s+/);
      const formattedChords = chords.map((chord) => {
        const lower = chord.toLowerCase();
        const elements = lower.split("+");
        const baseKey = elements.find((el) => !["ctrl", "alt", "shift", "cmd", "meta", "win"].includes(el));
        if (!baseKey) return chord;
        let formattedBase = specialKeysMap[baseKey] || baseKey.toUpperCase();
        let flags = "";
        if (lower.includes("win")) flags += "w";
        if (lower.includes("ctrl") || lower.includes("cmd") || lower.includes("meta")) flags += "c";
        if (lower.includes("alt")) flags += "a";
        if (lower.includes("shift")) flags += "s";
        return flags ? `${formattedBase}.${flags}` : formattedBase;
      });
      return formattedChords.join(" ");
    }
    function parseShorthandToNative(shorthand) {
      if (!shorthand) return "";
      const reversedSpecialKeys = {
        "UP": "arrowup",
        "DOWN": "arrowdown",
        "LEFT": "arrowleft",
        "RIGHT": "arrowright",
        "ESC": "escape",
        "ENTER": "enter",
        "TAB": "tab",
        "SPACE": "space",
        "BACKSPACE": "backspace",
        "DEL": "delete",
        "INS": "insert",
        "PGUP": "pageup",
        "PGDN": "pagedown",
        "HOME": "home",
        "END": "end",
        "CAPS": "capslock"
      };
      const chords = shorthand.trim().split(/\s+/);
      const nativeChords = chords.map((chord) => {
        if (!chord.includes(".")) {
          return reversedSpecialKeys[chord] || chord.toLowerCase();
        }
        const [baseKey, flags] = chord.split(".");
        const parts = [];
        if (flags.includes("w")) parts.push("win");
        if (flags.includes("c")) parts.push(process.platform === "darwin" ? "cmd" : "ctrl");
        if (flags.includes("a")) parts.push("alt");
        if (flags.includes("s")) parts.push("shift");
        parts.push(reversedSpecialKeys[baseKey] || baseKey.toLowerCase());
        return parts.join("+");
      });
      return nativeChords.join(" ");
    }
    function getKeybindingsFilePath() {
      const appData = process.env.APPDATA;
      const home = process.env.HOME || process.env.USERPROFILE;
      const isCursor = vscode.env.appName.toLowerCase().includes("cursor");
      const folderName = isCursor ? "Cursor" : "Code";
      if (process.platform === "win32") {
        return path.join(appData, folderName, "User", "keybindings.json");
      } else if (process.platform === "darwin") {
        return path.join(home, "Library", "Application Support", folderName, "User", "keybindings.json");
      } else {
        return path.join(home, ".config", folderName, "User", "keybindings.json");
      }
    }
    function loadFullKeybindingsArray() {
      const configPath = getKeybindingsFilePath();
      if (!fs.existsSync(configPath)) return [];
      try {
        const fileContent = fs.readFileSync(configPath, "utf8");
        const parsed = jsonc.parse(fileContent);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    function saveKeybindingsArray(arr) {
      const configPath = getKeybindingsFilePath();
      try {
        fs.writeFileSync(configPath, JSON.stringify(arr, null, 4), "utf8");
        return true;
      } catch (e) {
        vscode.window.showErrorMessage(`Failed to save keybindings updates: ${e.message}`);
        return false;
      }
    }
    module2.exports = {
      getEditMode: () => editModeActive,
      setEditMode: (val) => {
        editModeActive = val;
      },
      formatToCustomShorthand,
      parseShorthandToNative,
      getKeybindingsFilePath,
      loadFullKeybindingsArray,
      saveKeybindingsArray
    };
  }
});

// src/extension-macros-html.js
var require_extension_macros_html = __commonJS({
  "src/extension-macros-html.js"(exports2, module2) {
    function getWebviewContent(commandId, title, chord1Base, chord1Flags, chord2Base, chord2Flags, whenClause, currentKeys, currentWhen, initialNativeKey) {
      const escapeJS = (str) => {
        if (str === null || str === void 0) return "";
        return String(str).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r/g, "\\r").replace(/\n/g, "\\n");
      };
      const formatCurrentKeys = (keys) => {
        if (!keys || keys === "None") {
          return `<div><span style="opacity: 0.7;">Binding:</span> <strong>None</strong></div>`;
        }
        const parts = keys.split("  |  ");
        let html = "";
        for (const part of parts) {
          const lastOpenParen = part.lastIndexOf(" (");
          if (lastOpenParen !== -1 && part.endsWith(")")) {
            const shorthand = part.substring(0, lastOpenParen).trim();
            const nativeKey = part.substring(lastOpenParen + 2, part.length - 1).trim();
            html += `<div><span style="opacity: 0.7;">Binding:</span> <strong>${shorthand}</strong></div>`;
            html += `<div><span style="opacity: 0.7;">Binding:</span> <strong>${nativeKey}</strong></div>`;
          } else {
            html += `<div><span style="opacity: 0.7;">Binding:</span> <strong>${part}</strong></div>`;
          }
        }
        return html;
      };
      const webviewJS = `
    const vscode = acquireVsCodeApi();

    const baseInput1 = document.getElementById('baseKey');
    const shortcodeInput1 = document.getElementById('shortcode');
    const checkboxes1 = {
        w: document.getElementById('modW'),
        c: document.getElementById('modC'),
        a: document.getElementById('modA'),
        s: document.getElementById('modS')
    };

    const baseInput2 = document.getElementById('baseKey2');
    const shortcodeInput2 = document.getElementById('shortcode2');
    const checkboxes2 = {
        w: document.getElementById('modW2'),
        c: document.getElementById('modC2'),
        a: document.getElementById('modA2'),
        s: document.getElementById('modS2')
    };

    const whenInput = document.getElementById('whenClause');
    const fullShorthandInput = document.getElementById('fullShorthandInput');
    const statusBox = document.getElementById('statusBox');
    
    const btnCancel = document.getElementById('btnCancel');
    const btnClone = document.getElementById('btnClone'); // Unbind
    const btnSaveClone = document.getElementById('btnSaveClone'); // Add
    const btnSubmit = document.getElementById('btnSubmit'); // Save

    const btnClear1 = document.getElementById('btnClear1');
    const btnClear2 = document.getElementById('btnClear2');
    
    // Left side actions
    const btnReset = document.getElementById('btnReset');
    const btnClear = document.getElementById('btnClear');
    const btnCopyBinding = document.getElementById('btnCopyBinding');
    const btnPasteBinding = document.getElementById('btnPasteBinding');

    // Row 1 (Current)
    const btnEditJson = document.getElementById('btnEditJson');
    const btnKbUiCmd = document.getElementById('btnKbUiCmd');
    const btnKbUiKey = document.getElementById('btnKbUiKey');
    const btnKbUiUser = document.getElementById('btnKbUiUser');
    const btnKbUiDefault = document.getElementById('btnKbUiDefault');
    const btnKbUiExtension = document.getElementById('btnKbUiExtension');
    const btnKbUiExt = document.getElementById('btnKbUiExt');

    // Row 2 (New)
    const btnEditJsonNew = document.getElementById('btnEditJsonNew');
    const btnKbUiCmdNew = document.getElementById('btnKbUiCmdNew');
    const btnKbUiKeyNew = document.getElementById('btnKbUiKeyNew');
    const btnKbUiUserNew = document.getElementById('btnKbUiUserNew');
    const btnKbUiDefaultNew = document.getElementById('btnKbUiDefaultNew');
    const btnKbUiExtensionNew = document.getElementById('btnKbUiExtensionNew');
    const btnKbUiExtNew = document.getElementById('btnKbUiExtNew');

    const currentWhenClauseLabel = document.getElementById('currentWhenClauseLabel');

    let lastValidatedNativeKey = '';
    let isSynchronizing = false;

    function cleanBaseKeyInput(val) {
        if (!val) return '';
        let cleaned = val.toLowerCase()
            .replace(/(ctrl|alt|shift|win|cmd|meta)\\\\+/g, '')
            .replace(/\\\\.[casw]+/g, '')
            .replace(/\\\\+/g, '')
            .trim();
        if (cleaned === 'insert' || cleaned === 'ins') {
            return 'insert';
        }
        return cleaned.toUpperCase();
    }

    function cleanShortcodeInput(val) {
        if (!val) return '';
        let cleaned = val.toLowerCase().replace(/[^wcas]/g, '');
        let res = '';
        if (cleaned.includes('w')) res += 'w';
        if (cleaned.includes('c')) res += 'c';
        if (cleaned.includes('a')) res += 'a';
        if (cleaned.includes('s')) res += 's';
        return res;
    }

    function getFullShorthand() {
        const base1 = baseInput1.value.trim();
        const flags1 = shortcodeInput1.value.trim().toLowerCase();
        const part1 = flags1 ? base1 + '.' + flags1 : base1;

        const base2 = baseInput2.value.trim();
        const flags2 = shortcodeInput2.value.trim().toLowerCase();
        const part2 = base2 ? (flags2 ? base2 + '.' + flags2 : base2) : '';

        if (!base1) return '';
        return part2 ? part1 + ' ' + part2 : part1;
    }

    function formatCurrentKeysJS(keys) {
        if (!keys || keys === 'None') {
            return '<div><span style="opacity: 0.7;">Binding:</span> <strong>None</strong></div>';
        }
        const parts = keys.split('  |  ');
        let html = '';
        for (const part of parts) {
            const lastOpenParen = part.lastIndexOf(' (');
            if (lastOpenParen !== -1 && part.endsWith(')')) {
                const shorthand = part.substring(0, lastOpenParen).trim();
                const nativeKey = part.substring(lastOpenParen + 2, part.length - 1).trim();
                html += '<div><span style="opacity: 0.7;">Binding:</span> <strong>' + shorthand + '</strong></div>';
                html += '<div><span style="opacity: 0.7;">Binding:</span> <strong>' + nativeKey + '</strong></div>';
            } else {
                html += '<div><span style="opacity: 0.7;">Binding:</span> <strong>' + part + '</strong></div>';
            }
        }
        return html;
    }

    function hasBindingChanged() {
        if (!window.CE_INITIAL_STATE) return false;
        const initialB1 = (window.CE_INITIAL_STATE.chord1Base || '').toLowerCase().trim();
        const initialF1 = (window.CE_INITIAL_STATE.chord1Flags || '').toLowerCase().trim();
        const initialB2 = (window.CE_INITIAL_STATE.chord2Base || '').toLowerCase().trim();
        const initialF2 = (window.CE_INITIAL_STATE.chord2Flags || '').toLowerCase().trim();
        const initialWhen = (window.CE_INITIAL_STATE.whenClause || '').trim();

        const currentB1 = baseInput1.value.toLowerCase().trim();
        const currentF1 = shortcodeInput1.value.toLowerCase().trim();
        const currentB2 = baseInput2.value.toLowerCase().trim();
        const currentF2 = shortcodeInput2.value.toLowerCase().trim();
        const currentWhen = whenInput.value.trim();

        return (
            initialB1 !== currentB1 ||
            initialF1 !== currentF1 ||
            initialB2 !== currentB2 ||
            initialF2 !== currentF2 ||
            initialWhen !== currentWhen
        );
    }

    function updateButtonStates(isValid) {
        const changed = hasBindingChanged();
        
        const changedIndicator = document.getElementById('changedIndicator');
        if (changedIndicator) {
            changedIndicator.style.display = changed ? 'inline-block' : 'none';
        }

        if (!isValid) {
            btnSubmit.disabled = true;
            btnSaveClone.disabled = true;
            btnClone.disabled = true;
        } else {
            btnSubmit.disabled = !changed;
            btnSaveClone.disabled = !changed;
            btnClone.disabled = false;
        }
    }

    function validateBaseKeys() {
        const knownKeys = [
            'up', 'down', 'left', 'right', 'escape', 'esc', 'enter', 'tab', 'space',
            'backspace', 'delete', 'del', 'insert', 'ins', 'pageup', 'pgup', 'pagedown', 'pgdn',
            'home', 'end', 'capslock', 'caps'
        ];

        const isValidBaseKey = (k) => {
            const lower = k.toLowerCase().trim();
            if (!lower) return false;
            return /^[a-z0-9]$/.test(lower) || /^f\\\\d+$/.test(lower) || knownKeys.includes(lower);
        };

        const val1 = baseInput1.value.trim();
        if (val1 && !isValidBaseKey(val1)) {
            baseInput1.style.borderColor = '#f14c4c';
            baseInput1.style.outline = '1px solid #f14c4c';
            baseInput1.title = 'Syntax Error: Base Key is not recognized. (e.g. A-Z, 0-9, F1-F24, ENTER, LEFT)';
        } else {
            baseInput1.style.borderColor = '';
            baseInput1.style.outline = '';
            baseInput1.title = '';
        }

        const val2 = baseInput2.value.trim();
        if (val2 && !isValidBaseKey(val2)) {
            baseInput2.style.borderColor = '#f14c4c';
            baseInput2.style.outline = '1px solid #f14c4c';
            baseInput2.title = 'Syntax Error: Base Key is not recognized. (e.g. A-Z, 0-9, F1-F24, ENTER, LEFT)';
        } else {
            baseInput2.style.borderColor = '';
            baseInput2.style.outline = '';
            baseInput2.title = '';
        }
    }

    function triggerValidation(updateShorthandText = true) {
        validateBaseKeys();
        const textValue = getFullShorthand();
        
        if (updateShorthandText) {
            fullShorthandInput.value = textValue;
        }

        const changed = hasBindingChanged();
        const changedIndicator = document.getElementById('changedIndicator');
        if (changedIndicator) {
            changedIndicator.style.display = changed ? 'inline-block' : 'none';
        }

        if (!textValue) {
            statusBox.style.display = 'none';
            btnSubmit.disabled = true;
            btnClone.disabled = true;
            btnSaveClone.disabled = true;
            return;
        }
        vscode.postMessage({ command: 'validate', value: textValue });
    }

    function parseAndPopulateShorthand(shorthandStr) {
        const chords = (shorthandStr || '').trim().split(/\\\\s+/);
        let b1 = '', f1 = '', b2 = '', f2 = '';

        if (chords.length >= 1 && chords[0]) {
            const match = chords[0].match(/(.*)\\\\.([wcas]*)$/i);
            if (match) {
                b1 = match[1];
                f1 = match[2];
            } else {
                b1 = chords[0];
                f1 = '';
            }
        }
        if (chords.length >= 2 && chords[1]) {
            const match = chords[1].match(/(.*)\\\\.([wcas]*)$/i);
            if (match) {
                b2 = match[1];
                f2 = match[2];
            } else {
                b2 = chords[1];
                f2 = '';
            }
        }

        baseInput1.value = cleanBaseKeyInput(b1);
        shortcodeInput1.value = cleanShortcodeInput(f1);
        checkboxes1.w.checked = f1.includes('w');
        checkboxes1.c.checked = f1.includes('c');
        checkboxes1.a.checked = f1.includes('a');
        checkboxes1.s.checked = f1.includes('s');

        baseInput2.value = cleanBaseKeyInput(b2);
        shortcodeInput2.value = cleanShortcodeInput(f2);
        checkboxes2.w.checked = f2.includes('w');
        checkboxes2.c.checked = f2.includes('c');
        checkboxes2.a.checked = f2.includes('a');
        checkboxes2.s.checked = f2.includes('s');
    }

    function syncFromFullShorthand() {
        if (isSynchronizing) return;
        isSynchronizing = true;
        parseAndPopulateShorthand(fullShorthandInput.value);
        isSynchronizing = false;
        triggerValidation(false);
    }

    function syncFromUIForm1() {
        if (isSynchronizing) return;
        isSynchronizing = true;

        let val = baseInput1.value.trim();
        let w = false, c = false, a = false, s = false;
        let hasModifiers = false;

        if (val.includes('+')) {
            const elements = val.toLowerCase().split('+');
            const newElements = [];
            elements.forEach(el => {
                const p = el.trim();
                if (p === 'win' || p === 'windows') { w = true; hasModifiers = true; }
                else if (p === 'ctrl' || p === 'control' || p === 'cmd' || p === 'meta') { c = true; hasModifiers = true; }
                else if (p === 'alt') { a = true; hasModifiers = true; }
                else if (p === 'shift') { s = true; hasModifiers = true; }
                else if (p) { newElements.push(p); }
            });
            val = newElements.join('+');
        }

        if (val.includes('.')) {
            const parts = val.toLowerCase().split('.');
            if (parts.length === 2) {
                val = parts[0].trim();
                const flags = parts[1].trim();
                if (flags.includes('w')) { w = true; hasModifiers = true; }
                if (flags.includes('c')) { c = true; hasModifiers = true; }
                if (flags.includes('a')) { a = true; hasModifiers = true; }
                if (flags.includes('s')) { s = true; hasModifiers = true; }
            }
        }

        if (hasModifiers) {
            checkboxes1.w.checked = w;
            checkboxes1.c.checked = c;
            checkboxes1.a.checked = a;
            checkboxes1.s.checked = s;
        }

        baseInput1.value = cleanBaseKeyInput(val);
        let f = '';
        if (checkboxes1.w.checked) f += 'w';
        if (checkboxes1.c.checked) f += 'c';
        if (checkboxes1.a.checked) f += 'a';
        if (checkboxes1.s.checked) f += 's';
        shortcodeInput1.value = f;

        isSynchronizing = false;
        triggerValidation(true);
    }

    function syncFromShortcode1() {
        if (isSynchronizing) return;
        isSynchronizing = true;

        shortcodeInput1.value = cleanShortcodeInput(shortcodeInput1.value);
        checkboxes1.w.checked = shortcodeInput1.value.includes('w');
        checkboxes1.c.checked = shortcodeInput1.value.includes('c');
        checkboxes1.a.checked = shortcodeInput1.value.includes('a');
        checkboxes1.s.checked = shortcodeInput1.value.includes('s');

        isSynchronizing = false;
        triggerValidation(true);
    }

    function syncFromUIForm2() {
        if (isSynchronizing) return;
        isSynchronizing = true;

        let val = baseInput2.value.trim();
        let w = false, c = false, a = false, s = false;
        let hasModifiers = false;

        if (val.includes('+')) {
            const elements = val.toLowerCase().split('+');
            const newElements = [];
            elements.forEach(el => {
                const p = el.trim();
                if (p === 'win' || p === 'windows') { w = true; hasModifiers = true; }
                else if (p === 'ctrl' || p === 'control' || p === 'cmd' || p === 'meta') { c = true; hasModifiers = true; }
                else if (p === 'alt') { a = true; hasModifiers = true; }
                else if (p === 'shift') { s = true; hasModifiers = true; }
                else if (p) { newElements.push(p); }
            });
            val = newElements.join('+');
        }

        if (val.includes('.')) {
            const parts = val.toLowerCase().split('.');
            if (parts.length === 2) {
                val = parts[0].trim();
                const flags = parts[1].trim();
                if (flags.includes('w')) { w = true; hasModifiers = true; }
                if (flags.includes('c')) { c = true; hasModifiers = true; }
                if (flags.includes('a')) { a = true; hasModifiers = true; }
                if (flags.includes('s')) { s = true; hasModifiers = true; }
            }
        }

        if (hasModifiers) {
            checkboxes2.w.checked = w;
            checkboxes2.c.checked = c;
            checkboxes2.a.checked = a;
            checkboxes2.s.checked = s;
        }

        baseInput2.value = cleanBaseKeyInput(val);
        let f = '';
        if (checkboxes2.w.checked) f += 'w';
        if (checkboxes2.c.checked) f += 'c';
        if (checkboxes2.a.checked) f += 'a';
        if (checkboxes2.s.checked) f += 's';
        shortcodeInput2.value = f;

        isSynchronizing = false;
        triggerValidation(true);
    }

    function syncFromShortcode2() {
        if (isSynchronizing) return;
        isSynchronizing = true;

        shortcodeInput2.value = cleanShortcodeInput(shortcodeInput2.value);
        checkboxes2.w.checked = shortcodeInput2.value.includes('w');
        checkboxes2.c.checked = shortcodeInput2.value.includes('c');
        checkboxes2.a.checked = shortcodeInput2.value.includes('a');
        checkboxes2.s.checked = shortcodeInput2.value.includes('s');

        isSynchronizing = false;
        triggerValidation(true);
    }

    fullShorthandInput.addEventListener('input', syncFromFullShorthand);

    baseInput1.addEventListener('input', syncFromUIForm1);
    Object.values(checkboxes1).forEach(cb => {
        cb.addEventListener('change', syncFromUIForm1);
        cb.addEventListener('click', syncFromUIForm1);
    });
    shortcodeInput1.addEventListener('input', syncFromShortcode1);
    shortcodeInput1.addEventListener('change', syncFromShortcode1);
    shortcodeInput1.addEventListener('keyup', syncFromShortcode1);

    baseInput2.addEventListener('input', syncFromUIForm2);
    Object.values(checkboxes2).forEach(cb => {
        cb.addEventListener('change', syncFromUIForm2);
        cb.addEventListener('click', syncFromUIForm2);
    });
    shortcodeInput2.addEventListener('input', syncFromShortcode2);
    shortcodeInput2.addEventListener('change', syncFromShortcode2);
    shortcodeInput2.addEventListener('keyup', syncFromShortcode2);

    if (btnClear1) {
        btnClear1.addEventListener('click', () => {
            isSynchronizing = true;
            baseInput1.value = '';
            checkboxes1.w.checked = false;
            checkboxes1.c.checked = false;
            checkboxes1.a.checked = false;
            checkboxes1.s.checked = false;
            shortcodeInput1.value = '';
            isSynchronizing = false;
            triggerValidation(true);
        });
    }

    if (btnClear2) {
        btnClear2.addEventListener('click', () => {
            isSynchronizing = true;
            baseInput2.value = '';
            checkboxes2.w.checked = false;
            checkboxes2.c.checked = false;
            checkboxes2.a.checked = false;
            checkboxes2.s.checked = false;
            shortcodeInput2.value = '';
            isSynchronizing = false;
            triggerValidation(true);
        });
    }

    if (btnClear) {
        btnClear.addEventListener('click', () => {
            isSynchronizing = true;
            baseInput1.value = '';
            checkboxes1.w.checked = false;
            checkboxes1.c.checked = false;
            checkboxes1.a.checked = false;
            checkboxes1.s.checked = false;
            shortcodeInput1.value = '';

            baseInput2.value = '';
            checkboxes2.w.checked = false;
            checkboxes2.c.checked = false;
            checkboxes2.a.checked = false;
            checkboxes2.s.checked = false;
            shortcodeInput2.value = '';

            whenInput.value = '';
            lastValidatedNativeKey = '';
            statusBox.style.display = 'none';
            statusBox.textContent = '';
            isSynchronizing = false;
            triggerValidation(true);
        });
    }

    window.addEventListener('message', event => {
        const message = event.data;
        if (message.type === 'init') {
            isSynchronizing = true;
            let b1 = '';
            let f1 = '';
            let b2 = '';
            let f2 = '';
            const shorthandStr = message.shorthand || '';
            const baseKeyStr = message.baseKey || '';
            const flagsStr = message.flags || '';
            const baseKey2Str = message.baseKey2 || '';
            const flags2Str = message.flags2 || '';

            if (shorthandStr) {
                const chords = shorthandStr.trim().split(/\\\\s+/);
                if (chords.length >= 1 && chords[0]) {
                    const match = chords[0].match(/(.*)\\\\.([wcas]*)$/);
                    if (match) {
                        b1 = match[1];
                        f1 = match[2];
                    } else {
                        b1 = chords[0];
                        f1 = '';
                    }
                }
                if (chords.length >= 2 && chords[1]) {
                    const match = chords[1].match(/(.*)\\\\.([wcas]*)$/);
                    if (match) {
                        b2 = match[1];
                        f2 = match[2];
                    } else {
                        b2 = chords[1];
                        f2 = '';
                    }
                }
            }
            if (!b1 && baseKeyStr) {
                b1 = baseKeyStr;
            }
            if (!f1 && flagsStr) {
                f1 = flagsStr;
            }
            if (!b2 && baseKey2Str) {
                b2 = baseKey2Str;
            }
            if (!f2 && flags2Str) {
                f2 = flags2Str;
            }

            if (b1.toLowerCase() === 'insert' || b1.toLowerCase() === 'ins') {
                baseInput1.value = 'insert';
            } else {
                baseInput1.value = b1.toUpperCase();
            }
            shortcodeInput1.value = f1.toLowerCase();
            checkboxes1.w.checked = f1.includes('w');
            checkboxes1.c.checked = f1.includes('c');
            checkboxes1.a.checked = f1.includes('a');
            checkboxes1.s.checked = f1.includes('s');

            if (b2.toLowerCase() === 'insert' || b2.toLowerCase() === 'ins') {
                baseInput2.value = 'insert';
            } else {
                baseInput2.value = b2.toUpperCase();
            }
            shortcodeInput2.value = f2.toLowerCase();
            checkboxes2.w.checked = f2.includes('w');
            checkboxes2.c.checked = f2.includes('c');
            checkboxes2.a.checked = f2.includes('a');
            checkboxes2.s.checked = f2.includes('s');

            const incomingWhen = message.whenClause !== undefined ? message.whenClause : (message.when !== undefined ? message.when : undefined);
            whenInput.value = incomingWhen !== undefined ? incomingWhen : 'editorTextFocus';

            isSynchronizing = false;
            triggerValidation(true);
        } else if (message.type === 'status') {
            statusBox.textContent = message.text;
            statusBox.style.display = 'block';
            statusBox.style.padding = '8px 12px';
            statusBox.style.borderRadius = '4px';
            
            if (message.status === 'error') {
                statusBox.style.background = 'rgba(241, 76, 76, 0.15)';
                statusBox.style.color = '#f14c4c';
                lastValidatedNativeKey = '';
                updateButtonStates(false);
            } else {
                statusBox.style.background = 'rgba(137, 209, 137, 0.15)';
                statusBox.style.color = '#88d188';
                lastValidatedNativeKey = message.nativeKey || '';
                updateButtonStates(true);
            }
        } else if (message.type === 'updateLabels') {
            const container = document.getElementById('currentKeysContainer');
            if (container) {
                container.innerHTML = formatCurrentKeysJS(message.currentKeys || 'None');
            }
            if (currentWhenClauseLabel) currentWhenClauseLabel.textContent = message.currentWhen;
        } else if (message.type === 'pasteBindingData') {
            isSynchronizing = true;
            baseInput1.value = message.chord1Base || '';
            shortcodeInput1.value = message.chord1Flags || '';
            checkboxes1.w.checked = shortcodeInput1.value.includes('w');
            checkboxes1.c.checked = shortcodeInput1.value.includes('c');
            checkboxes1.a.checked = shortcodeInput1.value.includes('a');
            checkboxes1.s.checked = shortcodeInput1.value.includes('s');

            baseInput2.value = message.chord2Base || '';
            shortcodeInput2.value = message.chord2Flags || '';
            checkboxes2.w.checked = shortcodeInput2.value.includes('w');
            checkboxes2.c.checked = shortcodeInput2.value.includes('c');
            checkboxes2.a.checked = shortcodeInput2.value.includes('a');
            checkboxes2.s.checked = shortcodeInput2.value.includes('s');

            whenInput.value = message.when || '';
            isSynchronizing = false;
            triggerValidation(true);
        }
    });

    // Handle form change/keyup events to check if changed or valid
    const formInputs = [baseInput1, baseInput2, shortcodeInput1, shortcodeInput2, whenInput];
    formInputs.forEach(inp => {
        inp.addEventListener('input', () => {
            const textValue = getFullShorthand();
            updateButtonStates(!!textValue);
        });
        inp.addEventListener('keyup', () => {
            const textValue = getFullShorthand();
            updateButtonStates(!!textValue);
        });
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
        // Trigger unbind action using the new/form UI parameters or current parameters
        vscode.postMessage({
            command: 'unbind',
            nativeKey: lastValidatedNativeKey || (window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.initialNativeKey : ''),
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

    // Row 1 (Current) Action Handlers
    btnEditJson.addEventListener('click', () => {
        vscode.postMessage({
            command: 'editJson',
            nativeKey: window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.initialNativeKey : '',
            when: window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.whenClause : ''
        });
    });

    btnKbUiCmd.addEventListener('click', () => {
        const cmd = window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '';
        vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: [cmd] });
    });

    btnKbUiKey.addEventListener('click', () => {
        const key = window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.initialNativeKey : '';
        vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: ['@key:"' + key + '"'] });
    });

    btnKbUiUser.addEventListener('click', () => {
        vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: ['@source:user'] });
    });

    btnKbUiDefault.addEventListener('click', () => {
        vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: ['@source:default'] });
    });

    btnKbUiExtension.addEventListener('click', () => {
        vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: ['@source:extension'] });
    });

    btnKbUiExt.addEventListener('click', () => {
        const commandId = window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '';
        let targetExtensionId = '';
        const dotIndex = commandId.indexOf('.');
        if (dotIndex !== -1) {
            targetExtensionId = commandId.substring(0, dotIndex);
        }
        vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: ['@ext:' + targetExtensionId] });
    });


    // Row 2 (New) Action Handlers
    btnEditJsonNew.addEventListener('click', () => {
        vscode.postMessage({
            command: 'editJson',
            nativeKey: lastValidatedNativeKey,
            when: whenInput.value
        });
    });

    btnKbUiCmdNew.addEventListener('click', () => {
        const cmd = window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '';
        vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: [cmd] });
    });

    btnKbUiKeyNew.addEventListener('click', () => {
        vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: ['@key:"' + (lastValidatedNativeKey || '') + '"'] });
    });

    btnKbUiUserNew.addEventListener('click', () => {
        vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: ['@source:user'] });
    });

    btnKbUiDefaultNew.addEventListener('click', () => {
        vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: ['@source:default'] });
    });

    btnKbUiExtensionNew.addEventListener('click', () => {
        vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: ['@source:extension'] });
    });

    btnKbUiExtNew.addEventListener('click', () => {
        const commandId = window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '';
        let targetExtensionId = '';
        const dotIndex = commandId.indexOf('.');
        if (dotIndex !== -1) {
            targetExtensionId = commandId.substring(0, dotIndex);
        }
        vscode.postMessage({ command: 'executeCommand', commandName: 'workbench.action.openGlobalKeybindings', args: ['@ext:' + targetExtensionId] });
    });


    btnCopyBinding.addEventListener('click', () => {
        const textValue = getFullShorthand();
        if (!textValue) return;
        vscode.postMessage({
            command: 'copyBinding',
            value: JSON.stringify({
                key: lastValidatedNativeKey || '',
                command: window.CE_INITIAL_STATE ? window.CE_INITIAL_STATE.commandId : '',
                when: whenInput.value
            }, null, 4)
        });
    });

    btnPasteBinding.addEventListener('click', () => {
        vscode.postMessage({ command: 'pasteBinding' });
    });

    function resetToInitial() {
        if (!window.CE_INITIAL_STATE) return;
        isSynchronizing = true;

        let b1 = window.CE_INITIAL_STATE.chord1Base || '';
        if (b1.toLowerCase() === 'insert' || b1.toLowerCase() === 'ins') {
            baseInput1.value = 'insert';
        } else {
            baseInput1.value = b1.toUpperCase();
        }
        shortcodeInput1.value = window.CE_INITIAL_STATE.chord1Flags || '';
        checkboxes1.w.checked = shortcodeInput1.value.includes('w');
        checkboxes1.c.checked = shortcodeInput1.value.includes('c');
        checkboxes1.a.checked = shortcodeInput1.value.includes('a');
        checkboxes1.s.checked = shortcodeInput1.value.includes('s');

        let b2 = window.CE_INITIAL_STATE.chord2Base || '';
        if (b2.toLowerCase() === 'insert' || b2.toLowerCase() === 'ins') {
            baseInput2.value = 'insert';
        } else {
            baseInput2.value = b2.toUpperCase();
        }
        shortcodeInput2.value = window.CE_INITIAL_STATE.chord2Flags || '';
        checkboxes2.w.checked = shortcodeInput2.value.includes('w');
        checkboxes2.c.checked = shortcodeInput2.value.includes('c');
        checkboxes2.a.checked = shortcodeInput2.value.includes('a');
        checkboxes2.s.checked = shortcodeInput2.value.includes('s');

        whenInput.value = window.CE_INITIAL_STATE.whenClause !== undefined ? window.CE_INITIAL_STATE.whenClause : '';
        isSynchronizing = false;
        triggerValidation(true);
    }

    if (btnReset) {
        btnReset.addEventListener('click', resetToInitial);
    }

    if (window.CE_INITIAL_STATE) {
        resetToInitial();
        const container = document.getElementById('currentKeysContainer');
        if (container) {
            container.innerHTML = formatCurrentKeysJS(window.CE_INITIAL_STATE.currentKeys || 'None');
        }
        if (currentWhenClauseLabel) currentWhenClauseLabel.textContent = window.CE_INITIAL_STATE.currentWhen || 'No context';
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
        
        .actions-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            padding-top: 16px;
            margin-top: 10px;
        }
        .helper-row {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .helper-row-label {
            font-weight: bold;
            font-size: 0.9em;
            width: 70px;
            opacity: 0.85;
        }
        .helper-buttons {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
        }
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
        <div style="font-weight: bold; font-size: 1.1em; margin-bottom: 2px; display: flex; align-items: center; justify-content: space-between;">
            <span>Action: ` + (title || "") + `</span>
            <span id="changedIndicator" style="display: none; background: #e5c07b; color: #1e1e1e; padding: 2px 6px; border-radius: 3px; font-size: 0.8em; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">Changed</span>
        </div>
        <div id="currentKeysContainer">` + formatCurrentKeys(currentKeys) + `</div>
        <div><span style="opacity: 0.7;">Current When:</span> <strong id="currentWhenClauseLabel">` + (currentWhen || "No context") + `</strong></div>
        <div style="margin-top: 8px; display: flex; align-items: center; gap: 8px;">
            <span style="opacity: 0.85; font-weight: bold;">Key:</span>
            <input type="text" id="fullShorthandInput" placeholder="e.g., INS.a E" title="Editable full binding in cas shorthand format (e.g., INS.a E). Modifying this field instantly parses and populates the individual key controls below, and vice versa.">
        </div>
    </div>
    
    <div class="chords-grid">
        <!-- Chord 1 Panel -->
        <div class="chord-panel">
            <div class="chord-header">
                <span>Key 1 (Main Chord)</span>
                <button type="button" class="secondary small" id="btnClear1" title="Clear the Base Key, modifier checkboxes, and shortcode box for the primary chord.">Clear</button>
            </div>
            
            <div style="display: grid; grid-template-columns: 2fr 1fr 2fr; gap: 12px; align-items: end;">
                <div class="form-group">
                    <label for="baseKey" style="font-weight: 500; font-size: 0.9em; opacity: 0.85;">Base Key</label>
                    <input type="text" id="baseKey" placeholder="e.g., K, F11, ENTER, LEFT" title="Specify the primary key identifier. Non-recognized keys will be highlighted with red border borders.">
                </div>
                <div class="form-group">
                    <label for="shortcode" style="font-weight: 500; font-size: 0.9em; opacity: 0.85;">Code</label>
                    <input type="text" id="shortcode" placeholder="cas" title="Compact modifier flags: w (Windows), c (Control), a (Alt), s (Shift)">
                </div>
                <div class="form-group">
                    <label style="font-weight: 500; font-size: 0.9em; opacity: 0.85; margin-bottom: 6px;">Mods</label>
                    <div class="checkbox-group" style="display: flex; gap: 6px; align-items: center; justify-content: flex-start; margin-bottom: 2px;">
                        <label class="checkbox-item" title="Windows modifier key flag"><input type="checkbox" id="modW" value="w">W</label>
                        <label class="checkbox-item" title="Control modifier key flag"><input type="checkbox" id="modC" value="c">C</label>
                        <label class="checkbox-item" title="Alt modifier key flag"><input type="checkbox" id="modA" value="a">A</label>
                        <label class="checkbox-item" title="Shift modifier key flag"><input type="checkbox" id="modS" value="s">S</label>
                    </div>
                </div>
            </div>
        </div>

        <!-- Chord 2 Panel -->
        <div class="chord-panel">
            <div class="chord-header">
                <span>Key 2 (Optional Second Chord)</span>
                <button type="button" class="secondary small" id="btnClear2" title="Clear the Base Key, modifier checkboxes, and shortcode box for the secondary optional chord.">Clear</button>
            </div>
            
            <div style="display: grid; grid-template-columns: 2fr 1fr 2fr; gap: 12px; align-items: end;">
                <div class="form-group">
                    <label for="baseKey2" style="font-weight: 500; font-size: 0.9em; opacity: 0.85;">Base Key</label>
                    <input type="text" id="baseKey2" placeholder="e.g., W, ESC, DOWN" title="Specify the secondary key identifier for chord combinations. Non-recognized keys will be highlighted with red border borders.">
                </div>
                <div class="form-group">
                    <label for="shortcode2" style="font-weight: 500; font-size: 0.9em; opacity: 0.85;">Code</label>
                    <input type="text" id="shortcode2" placeholder="cas" title="Compact modifier flags: w (Windows), c (Control), a (Alt), s (Shift)">
                </div>
                <div class="form-group">
                    <label style="font-weight: 500; font-size: 0.9em; opacity: 0.85; margin-bottom: 6px;">Mods</label>
                    <div class="checkbox-group" style="display: flex; gap: 6px; align-items: center; justify-content: flex-start; margin-bottom: 2px;">
                        <label class="checkbox-item" title="Windows modifier key flag"><input type="checkbox" id="modW2" value="w">W</label>
                        <label class="checkbox-item" title="Control modifier key flag"><input type="checkbox" id="modC2" value="c">C</label>
                        <label class="checkbox-item" title="Alt modifier key flag"><input type="checkbox" id="modA2" value="a">A</label>
                        <label class="checkbox-item" title="Shift modifier key flag"><input type="checkbox" id="modS2" value="s">S</label>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="form-group" style="margin-top: 8px;">
        <label for="whenClause" style="font-weight: 500;">Context Clause Constraint (When)</label>
        <input type="text" id="whenClause" placeholder="e.g., editorTextFocus" title="Specifies the context condition when the keybinding is active (e.g., editorTextFocus, terminalFocus).">
    </div>

    <div id="statusBox" style="display: none;"></div>

    <div class="actions-group">
        <!-- Row 1: Current Helpers -->
        <div class="helper-row">
            <span class="helper-row-label">Current:</span>
            <div class="helper-buttons">
                <button type="button" class="secondary small" id="btnEditJson" title="Open the user keybindings.json configuration file and highlight the exact location of the current active binding record.">Edit Json</button>
                <button type="button" class="secondary small" id="btnKbUiCmd" title="Open the native VS Code Keyboard Shortcuts panel with a search filter focused specifically on the command ID of this action.">KB UI Cmd</button>
                <button type="button" class="secondary small" id="btnKbUiKey" title="Open the native VS Code Keyboard Shortcuts panel pre-filtered for the current keyboard shortcut assignment.">KB UI Key</button>
                <button type="button" class="secondary small" id="btnKbUiUser" title="Open the native VS Code Keyboard Shortcuts panel displaying only your custom user-configured keybindings.">KB UI User</button>
                <button type="button" class="secondary small" id="btnKbUiDefault" title="Open the native VS Code Keyboard Shortcuts panel displaying all default built-in keybindings.">KB UI Default</button>
                <button type="button" class="secondary small" id="btnKbUiExtension" title="Open the native VS Code Keyboard Shortcuts panel filtering to show keybindings contributed by extensions.">KB UI Extension</button>
                <button type="button" class="secondary small" id="btnKbUiExt" title="Open the native VS Code Keyboard Shortcuts panel showing only the keybindings contributed by the extension namespace of this command.">KB UI Ext</button>
            </div>
        </div>

        <!-- Row 2: New Helpers -->
        <div class="helper-row" style="margin-bottom: 8px;">
            <span class="helper-row-label">New:</span>
            <div class="helper-buttons">
                <button type="button" class="secondary small" id="btnEditJsonNew" title="Open keybindings.json file and look up or highlight entries matching the newly configured key combination and context.">Edit Json</button>
                <button type="button" class="secondary small" id="btnKbUiCmdNew" title="Open the native VS Code Keyboard Shortcuts panel filtering specifically for this action's command.">KB UI Cmd</button>
                <button type="button" class="secondary small" id="btnKbUiKeyNew" title="Open the native VS Code Keyboard Shortcuts panel with search pre-filled for the new key combination typed in the form.">KB UI Key</button>
                <button type="button" class="secondary small" id="btnKbUiUserNew" title="Open the native VS Code Keyboard Shortcuts panel displaying custom user keybinding modifications.">KB UI User</button>
                <button type="button" class="secondary small" id="btnKbUiDefaultNew" title="Open the native VS Code Keyboard Shortcuts panel to view default VS Code keyboard mappings.">KB UI Default</button>
                <button type="button" class="secondary small" id="btnKbUiExtensionNew" title="Open the native VS Code Keyboard Shortcuts panel showing extension-supplied default bindings.">KB UI Extension</button>
                <button type="button" class="secondary small" id="btnKbUiExtNew" title="Open the native VS Code Keyboard Shortcuts panel filtered specifically to the extension package that contributes this command.">KB UI Ext</button>
            </div>
        </div>

        <!-- Row 3: Standard Actions -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 12px;">
            <!-- Align Left -->
            <div style="display: flex; gap: 8px;">
                <button type="button" class="secondary" id="btnReset" title="Discard current unsaved changes and reset the entire form and validation state back to the original values.">Reset</button>
                <button type="button" class="secondary" id="btnClear" title="Clear all input fields, checkboxes, modifier labels, and validation indicators to let you configure a clean, empty key combination.">Clear</button>
                <button type="button" class="secondary" id="btnCopyBinding" title="Copy the current key combination, command ID, and context clause to your system clipboard formatted as a valid VS Code keybindings JSON object.">Copy Binding</button>
                <button type="button" class="secondary" id="btnPasteBinding" title="Read a keybinding JSON object from your system clipboard and instantly parse its properties to populate this form.">Paste Binding</button>
            </div>
            
            <!-- Align Right -->
            <div style="display: flex; gap: 8px;">
                <button type="button" class="secondary" id="btnCancel" title="Close this configuration view and return to the main command picker menu.">Cancel</button>
                <button type="button" class="secondary" id="btnClone" disabled title="Unbind and remove this keyboard shortcut mapping.">Unbind</button>
                <button type="button" class="secondary" id="btnSaveClone" disabled title="Add the newly configured key combination as an additional secondary shortcut for this action, preserving existing bindings.">Add</button>
                <button type="button" id="btnSubmit" disabled title="Save and apply the updated key combination assignment for this action (replacing any matched existing binding).">Save</button>
            </div>
        </div>
    </div>

    <script>
        window.CE_INITIAL_STATE = {
            commandId: "` + escapeJS(commandId) + `",
            chord1Base: "` + escapeJS(chord1Base) + `",
            chord1Flags: "` + escapeJS(chord1Flags) + `",
            chord2Base: "` + escapeJS(chord2Base) + `",
            chord2Flags: "` + escapeJS(chord2Flags) + `",
            whenClause: "` + escapeJS(whenClause) + `",
            currentKeys: "` + escapeJS(currentKeys) + `",
            currentWhen: "` + escapeJS(currentWhen) + `",
            initialNativeKey: "` + escapeJS(initialNativeKey) + `"
        };
        ` + webviewJS + `
    </script>
</body>
</html>`;
    }
    module2.exports = { getWebviewContent };
  }
});

// src/extension-macros-validator.js
var require_extension_macros_validator = __commonJS({
  "src/extension-macros-validator.js"(exports2, module2) {
    var core = require_extension_core();
    function validateAndParseInput(inputString) {
      const value = inputString.trim();
      if (!value) {
        return { isValid: false, nativeKey: "", errorReason: "Input cannot be empty." };
      }
      const knownKeys = [
        "up",
        "down",
        "left",
        "right",
        "escape",
        "esc",
        "enter",
        "tab",
        "space",
        "backspace",
        "delete",
        "del",
        "insert",
        "ins",
        "pageup",
        "pgup",
        "pagedown",
        "pgdn",
        "home",
        "end",
        "capslock",
        "caps"
      ];
      const isValidBaseKey = (k) => {
        const lower = k.toLowerCase();
        return /^[a-z0-9]$/.test(lower) || /^f\d+$/.test(lower) || knownKeys.includes(lower);
      };
      if (value.includes("+")) {
        const chords2 = value.split(/\s+/);
        for (const chord of chords2) {
          const elements = chord.toLowerCase().split("+");
          const baseKeys = elements.filter((el) => !["ctrl", "alt", "shift", "cmd", "meta", "win"].includes(el));
          if (baseKeys.length === 0) {
            return { isValid: false, nativeKey: "", errorReason: `Native format error: Chord "${chord}" is missing a character key.` };
          }
          if (baseKeys.length > 1) {
            return { isValid: false, nativeKey: "", errorReason: `Native format error: Too many base keys ("${baseKeys.join(", ")}") inside chord.` };
          }
          if (!isValidBaseKey(baseKeys[0])) {
            return { isValid: false, nativeKey: "", errorReason: `Syntax Error: "${baseKeys[0]}" is not recognized.` };
          }
        }
        return { isValid: true, nativeKey: value.toLowerCase(), errorReason: null };
      }
      const chords = value.split(/\s+/);
      for (const chord of chords) {
        if (!chord.includes(".")) {
          if (!isValidBaseKey(chord)) {
            return { isValid: false, nativeKey: "", errorReason: `Shortcode format error: "${chord}" is not valid.` };
          }
          continue;
        }
        const [baseKey, flags] = chord.split(".");
        if (!baseKey || !isValidBaseKey(baseKey)) {
          return { isValid: false, nativeKey: "", errorReason: `Syntax Error: "${baseKey || "empty"}" is not recognized.` };
        }
        if (!flags) {
          return { isValid: false, nativeKey: "", errorReason: `Shortcode error: Modifier flags suffix is blank.` };
        }
        const invalidFlags = [...flags.toLowerCase()].filter((char) => !["w", "c", "a", "s"].includes(char));
        if (invalidFlags.length > 0) {
          return { isValid: false, nativeKey: "", errorReason: `Shortcode error: Invalid flags ("${invalidFlags.join(", ")}"). Use w, c, a, s.` };
        }
      }
      try {
        const structuralNativeText = core.parseShorthandToNative(value);
        return { isValid: true, nativeKey: structuralNativeText, errorReason: null };
      } catch {
        return { isValid: false, nativeKey: "", errorReason: "Failed to transform shortcode notation." };
      }
    }
    module2.exports = { validateAndParseInput };
  }
});

// src/extension-macros-form.js
var require_extension_macros_form = __commonJS({
  "src/extension-macros-form.js"(exports2, module2) {
    var vscode = require("vscode");
    var fs = require("fs");
    var jsonc = (init_main(), __toCommonJS(main_exports));
    var htmlTemplate = require_extension_macros_html();
    async function promptAssignKey(context, commandItem, originalArgs, isEditMode) {
      const core = require_extension_core();
      const ui2 = require_extension_ui();
      let fullBindings = core.loadFullKeybindingsArray();
      const existingTargets = fullBindings.filter((b) => b.command === commandItem.commandId);
      let targetToEdit = null;
      if (isEditMode) {
        if (existingTargets.length === 0) {
          vscode.window.showWarningMessage("No bindings exist to edit. Swapping to fresh Assignment Mode.");
        } else if (existingTargets.length === 1) {
          targetToEdit = existingTargets[0];
        } else {
          const choice = await vscode.window.showQuickPick(
            existingTargets.map((t) => ({ label: t.key, detail: t.when || "No context clause", raw: t })),
            { placeHolder: "Select specific configuration signature row to modify:" }
          );
          if (!choice) {
            ui2.renderPrimaryMenu(context, originalArgs);
            return;
          }
          targetToEdit = choice.raw;
        }
      }
      let derivedTitle = commandItem.label || commandItem.commandId || "Unknown Command";
      let chord1Base = "";
      let chord1Flags = "";
      let chord2Base = "";
      let chord2Flags = "";
      let initialWhen = "editorTextFocus";
      const sourceToFill = targetToEdit || existingTargets[0];
      if (sourceToFill) {
        const fullShorthand = core.formatToCustomShorthand(sourceToFill.key);
        initialWhen = sourceToFill.when !== void 0 ? sourceToFill.when : "";
        const chords = fullShorthand.trim().split(/\s+/);
        if (chords.length >= 1 && chords[0]) {
          const match = chords[0].match(/(.*)\.([wcas]*)$/);
          if (match) {
            chord1Base = match[1];
            chord1Flags = match[2].replace(/[^wcas]/g, "");
          } else {
            chord1Base = chords[0];
          }
        }
        if (chords.length >= 2 && chords[1]) {
          const match = chords[1].match(/(.*)\.([wcas]*)$/);
          if (match) {
            chord2Base = match[1];
            chord2Flags = match[2].replace(/[^wcas]/g, "");
          } else {
            chord2Base = chords[1];
          }
        }
      }
      const currentKeysLabel = existingTargets.map((t) => `${core.formatToCustomShorthand(t.key)} (${t.key})`).join("  |  ") || "None";
      const currentWhenLabel = (targetToEdit ? targetToEdit.when : existingTargets[0] ? existingTargets[0].when : "editorTextFocus") || "editorTextFocus";
      const panelTitle = isEditMode ? `Edit Binding: ${derivedTitle}` : `Assign Key: ${derivedTitle}`;
      const viewType = "ceCommandPickerForm";
      const panel = vscode.window.createWebviewPanel(
        viewType,
        panelTitle,
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
          retainContextWhenHidden: true
        }
      );
      panel.webview.html = htmlTemplate.getWebviewContent(
        commandItem.commandId,
        commandItem.commandId || derivedTitle,
        chord1Base,
        chord1Flags,
        chord2Base,
        chord2Flags,
        initialWhen,
        currentKeysLabel,
        currentWhenLabel,
        sourceToFill ? sourceToFill.key : ""
      );
      panel.webview.onDidReceiveMessage(
        async (message) => {
          switch (message.command) {
            case "executeCommand":
              if (message.args) {
                vscode.commands.executeCommand(message.commandName, ...message.args);
              } else {
                vscode.commands.executeCommand(message.commandName);
              }
              break;
            case "validate":
              const checkText = message.value.trim();
              const validator = require_extension_macros_validator();
              const verification = validator.validateAndParseInput(checkText);
              if (!verification.isValid) {
                panel.webview.postMessage({ type: "status", status: "error", text: verification.errorReason });
              } else {
                const collisions = fullBindings.filter((b) => b.key.toLowerCase() === verification.nativeKey.toLowerCase() && b.command !== commandItem.commandId);
                if (collisions.length > 0) {
                  panel.webview.postMessage({ type: "status", status: "warning", text: `\u26A0\uFE0F Collision! Maps to: ${collisions.map((c) => c.command).join(", ")}` });
                } else {
                  panel.webview.postMessage({ type: "status", status: "success", text: `\u2713 Translates to native: "${verification.nativeKey}"`, nativeKey: verification.nativeKey });
                }
              }
              break;
            case "submit":
              let currentBindings = core.loadFullKeybindingsArray();
              const nativeKey = message.nativeKey;
              const finalWhen = message.when.trim();
              const actionType = message.actionType || "save";
              if (actionType === "clone") {
                const freshMapping = { key: nativeKey, command: commandItem.commandId };
                if (finalWhen) freshMapping.when = finalWhen;
                currentBindings.push(freshMapping);
              } else if (isEditMode && targetToEdit) {
                currentBindings = currentBindings.map((b) => {
                  if (b.key === targetToEdit.key && b.command === targetToEdit.command && b.when === targetToEdit.when) {
                    const freshObj = { key: nativeKey, command: commandItem.commandId };
                    if (finalWhen) freshObj.when = finalWhen;
                    return freshObj;
                  }
                  return b;
                });
              } else {
                const freshMapping = { key: nativeKey, command: commandItem.commandId };
                if (finalWhen) freshMapping.when = finalWhen;
                currentBindings.push(freshMapping);
              }
              if (core.saveKeybindingsArray(currentBindings)) {
                vscode.window.showInformationMessage(`Successfully saved key updates matching web form values (${actionType}).`);
              }
              if (actionType === "saveAndClone") {
                fullBindings = core.loadFullKeybindingsArray();
                const updatedExistingTargets = fullBindings.filter((b) => b.command === commandItem.commandId);
                const updatedKeysLabel = updatedExistingTargets.map((t) => `${core.formatToCustomShorthand(t.key)} (${t.key})`).join("  |  ") || "None";
                const updatedWhenLabel = (targetToEdit ? targetToEdit.when : updatedExistingTargets[0] ? updatedExistingTargets[0].when : "editorTextFocus") || "editorTextFocus";
                panel.webview.postMessage({
                  type: "updateLabels",
                  currentKeys: updatedKeysLabel,
                  currentWhen: updatedWhenLabel
                });
              } else {
                panel.dispose();
                ui2.renderPrimaryMenu(context, originalArgs);
              }
              break;
            case "cancel":
              panel.dispose();
              ui2.renderPrimaryMenu(context, originalArgs);
              break;
            case "editJson":
              try {
                const currentTarget = targetToEdit || (existingTargets.length > 0 ? existingTargets[0] : null);
                const checkKey = message.nativeKey || (currentTarget ? currentTarget.key : "");
                const checkWhen = message.when !== void 0 ? message.when.trim() : currentTarget ? currentTarget.when || "" : "";
                const configPath = core.getKeybindingsFilePath();
                if (!fs.existsSync(configPath)) {
                  vscode.window.showWarningMessage("keybindings.json file does not exist.");
                  break;
                }
                const fileContent = fs.readFileSync(configPath, "utf8");
                const rootNode = jsonc.parseTree(fileContent);
                let bestMatchNode = null;
                if (rootNode && rootNode.children) {
                  rootNode.children.forEach((itemNode) => {
                    if (itemNode.type === "object" && itemNode.children) {
                      let currentCmd = "";
                      let currentKey = "";
                      let currentWhen = "";
                      let commandNode = null;
                      itemNode.children.forEach((propertyNode) => {
                        if (propertyNode.type === "property" && propertyNode.children && propertyNode.children.length === 2) {
                          const keyName = propertyNode.children[0].value;
                          const valueNode = propertyNode.children[1];
                          if (keyName === "command") {
                            currentCmd = valueNode.value;
                            commandNode = valueNode;
                          } else if (keyName === "key") {
                            currentKey = valueNode.value;
                          } else if (keyName === "when") {
                            currentWhen = valueNode.value;
                          }
                        }
                      });
                      if (currentCmd === commandItem.commandId) {
                        const normCheck = currentKey.replace(/\s+/g, "").toLowerCase();
                        const normTarget = checkKey.replace(/\s+/g, "").toLowerCase();
                        if (normCheck === normTarget) {
                          const targetWhen = checkWhen;
                          const actualWhen = (currentWhen || "").trim();
                          if (targetWhen === actualWhen) {
                            bestMatchNode = commandNode || itemNode;
                          }
                        }
                      }
                    }
                  });
                  if (!bestMatchNode) {
                    rootNode.children.forEach((itemNode) => {
                      if (itemNode.type === "object" && itemNode.children) {
                        let currentCmd = "";
                        let commandNode = null;
                        itemNode.children.forEach((propertyNode) => {
                          if (propertyNode.type === "property" && propertyNode.children && propertyNode.children.length === 2) {
                            const keyName = propertyNode.children[0].value;
                            const valueNode = propertyNode.children[1];
                            if (keyName === "command") {
                              currentCmd = valueNode.value;
                              commandNode = valueNode;
                            }
                          }
                        });
                        if (currentCmd === commandItem.commandId) {
                          bestMatchNode = commandNode || itemNode;
                        }
                      }
                    });
                  }
                }
                const doc = await vscode.workspace.openTextDocument(configPath);
                const editor = await vscode.window.showTextDocument(doc);
                if (bestMatchNode) {
                  const targetPos = doc.positionAt(bestMatchNode.offset);
                  const nextSelection = new vscode.Selection(targetPos, targetPos);
                  editor.selection = nextSelection;
                  editor.revealRange(new vscode.Range(targetPos, targetPos), vscode.TextEditorRevealType.InCenter);
                  vscode.window.showInformationMessage("Opened keybindings.json at the current binding.");
                } else {
                  vscode.window.showInformationMessage("Opened keybindings.json file.");
                }
              } catch (e) {
                vscode.window.showErrorMessage(`Failed to open keybindings file: ${e.message}`);
              }
              break;
            case "unbind":
              const currentTargetUnbind = targetToEdit || (existingTargets.length > 0 ? existingTargets[0] : null);
              const unbindKey = message.nativeKey || (currentTargetUnbind ? currentTargetUnbind.key : "");
              const unbindWhen = message.when !== void 0 ? message.when.trim() : currentTargetUnbind ? currentTargetUnbind.when || "" : "";
              if (unbindKey) {
                let bindingsList = core.loadFullKeybindingsArray();
                const initialLength = bindingsList.length;
                bindingsList = bindingsList.filter((b) => {
                  const normB = b.key.replace(/\s+/g, "").toLowerCase();
                  const normTarget = unbindKey.replace(/\s+/g, "").toLowerCase();
                  const matchesKey = normB === normTarget;
                  const matchesCmd = b.command === commandItem.commandId;
                  const matchesWhen = (b.when || "") === (unbindWhen || "");
                  return !(matchesKey && matchesCmd && matchesWhen);
                });
                if (bindingsList.length < initialLength) {
                  if (core.saveKeybindingsArray(bindingsList)) {
                    vscode.window.showInformationMessage(`Successfully removed keybinding mapping for: ${commandItem.commandId}`);
                  }
                } else {
                  vscode.window.showWarningMessage("No matching keybinding found to unbind.");
                }
              } else {
                vscode.window.showWarningMessage("No existing keybinding found to unbind.");
              }
              panel.dispose();
              ui2.renderPrimaryMenu(context, originalArgs);
              break;
            case "copyBinding":
              if (message.value) {
                await vscode.env.clipboard.writeText(message.value);
                vscode.window.showInformationMessage("Copied keybinding JSON block to clipboard.");
              }
              break;
            case "pasteBinding":
              try {
                const text = await vscode.env.clipboard.readText();
                const parsed = JSON.parse(text.trim());
                if (parsed && typeof parsed === "object") {
                  if (parsed.key) {
                    const fullShorthand = core.formatToCustomShorthand(parsed.key);
                    const chords = fullShorthand.trim().split(/\s+/);
                    let c1Base = "";
                    let c1Flags = "";
                    let c2Base = "";
                    let c2Flags = "";
                    if (chords.length >= 1 && chords[0]) {
                      const match = chords[0].match(/(.*)\.([wcas]*)$/);
                      if (match) {
                        c1Base = match[1];
                        c1Flags = match[2];
                      } else {
                        c1Base = chords[0];
                      }
                    }
                    if (chords.length >= 2 && chords[1]) {
                      const match = chords[1].match(/(.*)\.([wcas]*)$/);
                      if (match) {
                        c2Base = match[1];
                        c2Flags = match[2];
                      } else {
                        c2Base = chords[1];
                      }
                    }
                    panel.webview.postMessage({
                      type: "pasteBindingData",
                      chord1Base: c1Base,
                      chord1Flags: c1Flags,
                      chord2Base: c2Base,
                      chord2Flags: c2Flags,
                      when: parsed.when !== void 0 ? parsed.when : ""
                    });
                    vscode.window.showInformationMessage("Successfully pasted keybinding JSON from clipboard.");
                  } else {
                    vscode.window.showErrorMessage('Invalid keybinding JSON: missing "key" property.');
                  }
                } else {
                  vscode.window.showErrorMessage("Clipboard content is not a valid JSON object.");
                }
              } catch (e) {
                vscode.window.showErrorMessage("Failed to parse clipboard text as JSON.");
              }
              break;
          }
        },
        void 0,
        context.subscriptions
      );
    }
    module2.exports = { promptAssignKey };
  }
});

// src/extension-macros-purge.js
var require_extension_macros_purge = __commonJS({
  "src/extension-macros-purge.js"(exports2, module2) {
    var vscode = require("vscode");
    var core = require_extension_core();
    var ui2 = require_extension_ui();
    async function promptRemoveKey(commandItem, originalArgs) {
      const fullBindings = core.loadFullKeybindingsArray();
      const targetedMatches = fullBindings.filter((b) => b.command === commandItem.commandId);
      if (targetedMatches.length === 0) {
        vscode.window.showWarningMessage("No active configuration maps registered to purge.");
        ui2.renderPrimaryMenu(originalArgs);
        return;
      }
      const multiPick = vscode.window.createQuickPick();
      multiPick.canSelectMany = true;
      multiPick.title = `Purge Registries: ${commandItem.label}`;
      multiPick.placeholder = "Check items to remove from user files, then click Enter...";
      multiPick.items = targetedMatches.map((m) => ({
        label: m.key,
        detail: m.when || "No target runtime when context constraint rules",
        rawObj: m
      }));
      multiPick.onDidAccept(() => {
        const toDelete = multiPick.selectedItems;
        if (!toDelete || toDelete.length === 0) {
          multiPick.hide();
          ui2.renderPrimaryMenu(originalArgs);
          return;
        }
        let bindingsWorkspace = core.loadFullKeybindingsArray();
        bindingsWorkspace = bindingsWorkspace.filter(
          (b) => !toDelete.some((del) => del.rawObj.key === b.key && del.rawObj.command === b.command && del.rawObj.when === b.when)
        );
        multiPick.hide();
        multiPick.dispose();
        if (core.saveKeybindingsArray(bindingsWorkspace)) {
          vscode.window.showInformationMessage(`Purged ${toDelete.length} active key targets successfully.`);
        }
        ui2.renderPrimaryMenu(originalArgs);
      });
      multiPick.onDidHide(() => multiPick.dispose());
      multiPick.show();
    }
    module2.exports = { promptRemoveKey };
  }
});

// src/extension-navigation.js
var require_extension_navigation = __commonJS({
  "src/extension-navigation.js"(exports2, module2) {
    var vscode = require("vscode");
    var fs = require("fs");
    var jsonc = (init_main(), __toCommonJS(main_exports));
    var core = require_extension_core();
    var ui2 = require_extension_ui();
    async function navigateToBindingJson(commandItem, originalArgs) {
      const configPath = core.getKeybindingsFilePath();
      if (!fs.existsSync(configPath)) {
        vscode.window.showWarningMessage("keybindings.json file does not exist.");
        ui2.renderPrimaryMenu(originalArgs);
        return;
      }
      try {
        const fileContent = fs.readFileSync(configPath, "utf8");
        const rootNode = jsonc.parseTree(fileContent);
        if (!rootNode || !rootNode.children) {
          vscode.window.showWarningMessage("Could not parse valid JSON structural nodes.");
          ui2.renderPrimaryMenu(originalArgs);
          return;
        }
        const validMatches = [];
        rootNode.children.forEach((itemNode) => {
          if (itemNode.type === "object" && itemNode.children) {
            let currentCmd = "";
            let currentKey = "";
            let currentWhen = "";
            let commandNode = null;
            itemNode.children.forEach((propertyNode) => {
              if (propertyNode.type === "property" && propertyNode.children && propertyNode.children.length === 2) {
                const keyName = propertyNode.children[0].value;
                const valueNode = propertyNode.children[1];
                if (keyName === "command") {
                  currentCmd = valueNode.value;
                  commandNode = valueNode;
                } else if (keyName === "key") {
                  currentKey = valueNode.value;
                } else if (keyName === "when") {
                  currentWhen = valueNode.value;
                }
              }
            });
            if (currentCmd === commandItem.commandId && !currentCmd.startsWith("-")) {
              validMatches.push({
                key: currentKey,
                when: currentWhen || "No context clause rules",
                offset: commandNode ? commandNode.offset : itemNode.offset
              });
            }
          }
        });
        if (validMatches.length === 0) {
          vscode.window.showWarningMessage("No matching JSON file objects found for this command ID.");
          ui2.renderPrimaryMenu(originalArgs);
          return;
        }
        let selectedTarget = null;
        if (validMatches.length === 1) {
          selectedTarget = validMatches[0];
        } else {
          const choice = await vscode.window.showQuickPick(
            validMatches.map((m) => ({
              label: m.key,
              detail: m.when,
              rawMatch: m
            })),
            { placeHolder: "Multiple matches found. Select target JSON node to find and view:" }
          );
          if (!choice) {
            ui2.renderPrimaryMenu(originalArgs);
            return;
          }
          selectedTarget = choice.rawMatch;
        }
        const textDoc = await vscode.workspace.openTextDocument(configPath);
        const editor = await vscode.window.showTextDocument(textDoc);
        const targetPos = textDoc.positionAt(selectedTarget.offset);
        const nextSelection = new vscode.Selection(targetPos, targetPos);
        editor.selection = nextSelection;
        editor.revealRange(new vscode.Range(targetPos, targetPos), vscode.TextEditorRevealType.InCenter);
      } catch (error) {
        vscode.window.showErrorMessage(`Failed to perform deep-link cursor alignment: ${error.message}`);
        ui2.renderPrimaryMenu(originalArgs);
      }
    }
    module2.exports = { navigateToBindingJson };
  }
});

// src/extension-ui.js
var require_extension_ui = __commonJS({
  "src/extension-ui.js"(exports2, module2) {
    var vscode = require("vscode");
    var core = require_extension_core();
    var formMacro = require_extension_macros_form();
    var purgeMacro = require_extension_macros_purge();
    var navMacro = require_extension_navigation();
    function activate2(context) {
      let disposable = vscode.commands.registerCommand("ce-command-picker.show", async function(args) {
        if (!args || !Array.isArray(args)) {
          vscode.window.showWarningMessage("CE Command Picker requires an array argument of command IDs.");
          return;
        }
        renderPrimaryMenu(context, args);
      });
      context.subscriptions.push(disposable);
    }
    function renderPrimaryMenu(context, targetCommandIds) {
      const fullBindings = core.loadFullKeybindingsArray();
      const quickPick = vscode.window.createQuickPick();
      const pickerItems = [];
      pickerItems.push({
        label: core.getEditMode() ? "$(close) Exit Edit Mode" : "$(edit) Edit Mode Toggle",
        detail: core.getEditMode() ? "Currently active. Click to swap to standard execution mode." : "Click to enable deep editing macro configurations.",
        isControlItem: true
      });
      targetCommandIds.forEach((cmdId) => {
        let humanLabel = cmdId.replace(/^[\w-]+\./, "").replace(/([A-Z])/g, " $1").replace(/[_-]/g, " ");
        humanLabel = humanLabel.charAt(0).toUpperCase() + humanLabel.slice(1);
        const matches = fullBindings.filter((b) => b.command === cmdId && !b.command.startsWith("-"));
        const shorthand = matches.length > 0 ? matches.map((m) => core.formatToCustomShorthand(m.key)).join(", ") : "unassigned";
        pickerItems.push({
          label: humanLabel,
          detail: shorthand,
          commandId: cmdId
        });
      });
      quickPick.items = pickerItems;
      quickPick.placeholder = core.getEditMode() ? "[EDIT MODE IS ACTIVE] Select target to change configurations..." : "Select a command to execute...";
      quickPick.title = core.getEditMode() ? "CE Command Picker (Editing Framework)" : "CE Command Picker";
      quickPick.onDidChangeActive((activeItems) => {
        if (activeItems && activeItems.length > 0 && !activeItems.isControlItem) {
          quickPick.title = activeItems.commandId;
        } else {
          quickPick.title = core.getEditMode() ? "CE Command Picker (Editing Framework)" : "CE Command Picker";
        }
      });
      quickPick.onDidAccept(() => {
        const selectedItems = quickPick.selectedItems;
        if (!selectedItems || selectedItems.length === 0) return;
        const selection = selectedItems[0];
        if (selection.isControlItem) {
          core.setEditMode(!core.getEditMode());
          quickPick.hide();
          quickPick.dispose();
          renderPrimaryMenu(context, targetCommandIds);
          return;
        }
        quickPick.hide();
        quickPick.dispose();
        if (core.getEditMode()) {
          showSecondaryActionMenu(context, selection, targetCommandIds);
        } else {
          vscode.commands.executeCommand(selection.commandId);
        }
      });
      quickPick.onDidHide(() => quickPick.dispose());
      quickPick.show();
    }
    function showSecondaryActionMenu(context, commandItem, originalArgs) {
      const secondaryQuickPick = vscode.window.createQuickPick();
      secondaryQuickPick.items = [
        { label: "$(arrow-left) Back", detail: "Exit edit profile and return to main picker list", actionKey: "BACK" },
        { label: "Execute", detail: `Run command: ${commandItem.commandId}`, actionKey: "EXECUTE" },
        { label: "Copy Command", detail: "Copy raw command ID string layout", actionKey: "COPY_CMD" },
        { label: "Copy Bindings", detail: "Copy full system JSON config structures", actionKey: "COPY_BIND" },
        { label: "Assign Key", detail: "Write a newly structured key map parameter", actionKey: "ASSIGN_KEY" },
        { label: "Edit Binding", detail: "Modify existing parameters matching this action ID", actionKey: "EDIT_BINDING" },
        { label: "Goto Binding UI", detail: "Open native Keyboard Shortcuts editor at this command", actionKey: "GOTO_BINDING_UI" },
        { label: "Remove Key", detail: "Selectively purge structural mappings", actionKey: "REMOVE_KEY" },
        { label: "Goto Binding JSON", detail: "Locate structural code array within standard settings files", actionKey: "GOTO_JSON" }
      ];
      secondaryQuickPick.title = `Action Plan: ${commandItem.label}`;
      secondaryQuickPick.placeholder = "Select configuration script profile...";
      secondaryQuickPick.onDidAccept(async () => {
        const selectedActions = secondaryQuickPick.selectedItems;
        if (!selectedActions || selectedActions.length === 0) return;
        const action = selectedActions[0];
        secondaryQuickPick.hide();
        secondaryQuickPick.dispose();
        switch (action.actionKey) {
          case "BACK":
            renderPrimaryMenu(context, originalArgs);
            break;
          case "EXECUTE":
            vscode.commands.executeCommand(commandItem.commandId);
            break;
          case "COPY_CMD":
            await vscode.env.clipboard.writeText(commandItem.commandId);
            vscode.window.showInformationMessage(`Copied: ${commandItem.commandId}`);
            renderPrimaryMenu(context, originalArgs);
            break;
          case "COPY_BIND":
            const matches = core.loadFullKeybindingsArray().filter((b) => b.command === commandItem.commandId);
            await vscode.env.clipboard.writeText(JSON.stringify(matches, null, 4));
            vscode.window.showInformationMessage(`Copied ${matches.length} layout block object profiles.`);
            renderPrimaryMenu(context, originalArgs);
            break;
          case "ASSIGN_KEY":
            formMacro.promptAssignKey(context, commandItem, originalArgs, false);
            break;
          case "EDIT_BINDING":
            formMacro.promptAssignKey(context, commandItem, originalArgs, true);
            break;
          case "GOTO_BINDING_UI": {
            await vscode.commands.executeCommand("workbench.action.openGlobalKeybindings", commandItem.commandId);
            break;
          }
          case "REMOVE_KEY":
            purgeMacro.promptRemoveKey(context, commandItem, originalArgs);
            break;
          case "GOTO_JSON":
            navMacro.navigateToBindingJson(context, commandItem, originalArgs);
            break;
        }
      });
      secondaryQuickPick.onDidHide(() => secondaryQuickPick.dispose());
      secondaryQuickPick.show();
    }
    function deactivate2() {
    }
    module2.exports = { activate: activate2, deactivate: deactivate2, renderPrimaryMenu };
  }
});

// src/index.js
var index_exports = {};
__export(index_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(index_exports);
var ui = require_extension_ui();
function activate(context) {
  ui.activate(context);
}
function deactivate() {
  if (typeof ui.deactivate === "function") {
    ui.deactivate();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
