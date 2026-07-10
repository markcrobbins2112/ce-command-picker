---
title: SPEC
---

<!-- # TEMPLATE: SPEC.template.md -->
<!-- 
# SPEC
# Any text bounded by double curly braces {{like this}} is a placeholder for you to fill out.
# Replace those placeholders with real paths, rules, and project constraints.
#
# INSTRUCTIONS FOR THE AI AGENT:
# This file tracks formal specifications, comparing originally requested guidelines 
# against actual implemented items. Document architectural challenges, optimization rules,
# compatibility constraints, and platform limits.
-->

<!-- markdownlint-disable MD013 -->

# SPEC

## 📑 AI Primary Files
- 🔹 [AGENTS.md](../AGENTS.md)
- 🔹 [ARCHIVE.md](ARCHIVE.md)
- 🔹 [BUILD.md](BUILD.md)
- 🔹 [CODE.md](CODE.md)
- 🔹 [DESIGN.md](DESIGN.md)
- 🔹 [FEATURES.md](FEATURES.md)
- 🔹 [LOG.md](LOG.md)
- 🔹 [MANUAL.md](MANUAL.md)
- 🔹 [README.md](../README.md)
- 🔸 [SPEC.md](SPEC.md)
- 🔹 [TASKS.md](TASKS.md)
- 🔹 [TERMS.md](TERMS.md)
- 🔹 [TESTING.md](TESTING.md)
- 🔹 [VERSIONS.md](VERSIONS.md)

## 🔍 Table of Contents
- [[#🔗 External Application Protocols & URI Schemes]] ^toc-uri
- [[#💻 Native OS Integration Details]] ^toc-os
- [[#📋 Originally Requested Specifications]] ^toc-requested
- [[#🎯 Implemented Technical Concerns & Optimization Features]] ^toc-optimization
- [[#🚦 Internal Function Signatures & System Exit Codes]] ^toc-codes
- [[#Go to...]] ^toc-goto

This document compiles the user requirements and instructions from `AGENTS.md` and related files and provides detailed documentation of how the extension was architected and built.

---

## 🔗 External Application Protocols & URI Schemes
[[#^toc-uri|TOC]]

### VS Code/Cursor URI Link Contract
- **Target Schema:** `cursor://file/{absoluteFilePath}` / `vscode://file/{absoluteFilePath}`
- **Query String Map:**

  | Parameter | Type | Required | Description / Constraints |
  | :--- | :--- | :--- | :--- |
  | `file` | `String` | Yes | Absolute target path to open. Must be URL-encoded (UTF-8). |
  | `line` | `Integer` | No | Optional line offset parameter to position cursor cursor. |

---

## 💻 Native OS Integration Details
[[#^toc-os|TOC]]

### Registry / Configuration Mappings
- **System Hook Target:** `%APPDATA%/Code/User/keybindings.json` (or `%APPDATA%/Cursor/User/keybindings.json` depending on active host ID)
- **Properties Mapping:**
  - `keybindings.json` (Default): Contains all local key assignments and command bindings
  - `"icon"`: Custom package SVG or glyph displayed in the Extension Marketplace

### File & Folder Attribute Masks
- **Configuration Context Target:** `keybindings.json` (Standard user settings files loaded dynamically).
- **Directory Workspace Parent:** Settings parent folders must have write permissions to support visual updates via the Webview panel.

---

## 📋 Originally Requested Specifications
[[#^toc-requested|TOC]]
- **Isolated Command Pickers**: Allow the creation of distinct, modular picker palettes defined via arguments arrays passed through customized keybindings.
- **Deep In-Editor Key Assignments**: Enable users to edit, clear, copy, or browse the active settings files inside their host editor frame.

---

## 🎯 Implemented Technical Concerns & Optimization Features
[[#^toc-optimization|TOC]]
- **Dynamic Webview ViewType Cache-Busting**:
  - **The Problem**: Chromium's internal service worker caching mechanism in VS Code frequently caches active iframes, resulting in old assignment options or stale key mappings being loaded when switching between edit views.
  - **The Solution / Code Implementation**: Implemented dynamic high-resolution millisecond timestamp rotation in `extension-macros-form.js` (`ceIdForm-${Date.now()}`) to bypass Chromium's cached layer completely and force clean iframe garbage collection.
- **AST-Based JSONC Parser Navigation**:
  - **The Problem**: Standard string regex lookup on `keybindings.json` can easily corrupt user comments or fail to accurately position the cursor due to multiline key definitions or leading spaces.
  - **The Solution / Code Implementation**: Utilizes the robust AST-based `jsonc-parser` in `extension-navigation.js` to parse comment-supported files, extracting exact character offset coordinates to perform safe, non-destructive cursor movements.

---

## 🚦 Internal Function Signatures & System Exit Codes
[[#^toc-codes|TOC]]

### Engine Error / Exit Status Codes

| Code (Integer) | Semantic Definition | Trigger Condition |
| :--- | :--- | :--- |
| `0` | `Success` | Complete flawless lifecycle termination. |
| `1` | `ERR_MISSING_ARGS` | Extension invoked without passing valid target commands array. |
| `2` | `ERR_INVALID_KEYBINDINGS_JSON` | User keybindings JSON configuration was unreadable or corrupt. |
| `3` | `ERR_TARGET_NOT_FOUND` | AST lookups failed to locate the specified target command definition. |

### Data Models & State Layouts
```json
[
    {
        "key": "ctrl+alt+k w",
        "command": "ce-command-picker.show",
        "args": [
            "workbench.action.terminal.toggleTerminal",
            "workbench.action.files.save"
        ]
    }
]
```

---
## 🚀 Go to...
[[#^toc-goto|TOC]]
- 🔹 [AGENTS.md](../AGENTS.md)
- 🔹 [ARCHIVE.md](ARCHIVE.md)
- 🔹 [BUILD.md](BUILD.md)
- 🔹 [CODE.md](CODE.md)
- 🔹 [DESIGN.md](DESIGN.md)
- 🔹 [FEATURES.md](FEATURES.md)
- 🔹 [LOG.md](LOG.md)
- 🔹 [MANUAL.md](MANUAL.md)
- 🔹 [README.md](../README.md)
- 🔸 [SPEC.md](SPEC.md)
- 🔹 [TASKS.md](TASKS.md)
- 🔹 [TERMS.md](TERMS.md)
- 🔹 [TESTING.md](TESTING.md)
- 🔹 [VERSIONS.md](VERSIONS.md)

<!-- # TEMPLATE: SPEC.template.md -->
