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
    function getWebviewContent(title) {
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
        color: var(--vscode-button-secondaryForeground);
    }
    button.secondary:hover { background-color: var(--vscode-button-secondaryHoverBackground); }
    `;
      const webviewJS = `
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

        const match = text.match(/(.*)\\.([wcas]*)$/i);
        if (match) {
            baseInput.value = match[1].toUpperCase();
            setUIFlags(match[2] || '');
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
        if (message.type === 'init') {
            isSynchronizing = true;
            baseInput.value = message.baseKey || '';
            shortcodeInput.value = message.shorthand || '';
            whenInput.value = message.whenClause || 'editorTextFocus';
            setUIFlags(message.flags || '');
            isSynchronizing = false;
            triggerValidation(shortcodeInput.value);
        } else if (message.type === 'status') {
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
    `;
      const scriptBase64 = Buffer.from(webviewJS).toString("base64");
      return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CE Form Dialog</title>
    <style>
        ` + webviewCSS + `
    </style>
</head>
<body>
    <h2>Action Target: ` + (title || "") + `</h2>
    
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

    <!-- \u2705 FIXED: Inject script using a base64 data URI to skip service-worker proxy caches completely -->
    <script src="data:text/javascript;base64,` + scriptBase64 + `"></script>
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
          if (!isValidBaseKey(baseKeys)) {
            return { isValid: false, nativeKey: "", errorReason: `Syntax Error: "${baseKeys}" is not recognized.` };
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
    var htmlTemplate = require_extension_macros_html();
    async function promptAssignKey(context, commandItem, originalArgs, isEditMode) {
      const core = require_extension_core();
      const ui2 = require_extension_ui();
      const fullBindings = core.loadFullKeybindingsArray();
      const existingTargets = fullBindings.filter((b) => b.command === commandItem.commandId);
      let targetToEdit = null;
      if (isEditMode) {
        if (existingTargets.length === 0) {
          vscode.window.showWarningMessage("No bindings exist to edit. Swapping to fresh Assignment Mode.");
        } else if (existingTargets.length === 1) {
          targetToEdit = existingTargets;
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
      let initialBaseKey = "";
      let initialShorthand = "";
      let initialFlags = "";
      let initialWhen = "editorTextFocus";
      if (targetToEdit) {
        initialShorthand = core.formatToCustomShorthand(targetToEdit.key);
        initialWhen = targetToEdit.when || "editorTextFocus";
        const match = initialShorthand.match(/(.*)\.([wcas]*)$/);
        if (match && match[1] && match[2]) {
          initialBaseKey = match[1];
          initialFlags = match[2];
        } else {
          initialBaseKey = initialShorthand;
        }
      }
      const panelTitle = isEditMode ? `Edit Binding: ${derivedTitle}` : `Assign Key: ${derivedTitle}`;
      const panel = vscode.window.createWebviewPanel(
        "ceCommandPickerForm",
        panelTitle,
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
          retainContextWhenHidden: true
        }
      );
      panel.webview.html = htmlTemplate.getWebviewContent(commandItem.commandId || derivedTitle);
      setTimeout(() => {
        if (panel && panel.webview) {
          panel.webview.postMessage({
            type: "init",
            baseKey: initialBaseKey,
            shorthand: initialShorthand,
            flags: initialFlags,
            whenClause: initialWhen
          });
        }
      }, 100);
      panel.webview.onDidReceiveMessage(
        async (message) => {
          switch (message.command) {
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
              if (isEditMode && targetToEdit) {
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
                vscode.window.showInformationMessage("Successfully saved key updates matching web form values.");
              }
              panel.dispose();
              ui2.renderPrimaryMenu(context, originalArgs);
              break;
            case "cancel":
              panel.dispose();
              ui2.renderPrimaryMenu(context, originalArgs);
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
