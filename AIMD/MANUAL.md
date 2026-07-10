---
title: MANUAL
---

<!-- # TEMPLATE: MANUAL.template.md -->
<!-- 
# MANUAL
# Any text bounded by double curly braces {{like this}} is a placeholder for you to fill out.
# Replace those placeholders with real paths, rules, and project constraints.
#
# INSTRUCTIONS FOR THE AI AGENT:
# This file is the developer's handbook. It maps structural topologies, data flow,
# core algorithms, algebraic formulas, configuration guidelines, and technical specifications.
-->

<!-- markdownlint-disable MD013 -->

# MANUAL

## 📑 AI Primary Files
- 🔹 [AGENTS.md](../AGENTS.md)
- 🔹 [ARCHIVE.md](ARCHIVE.md)
- 🔹 [BUILD.md](BUILD.md)
- 🔹 [CODE.md](CODE.md)
- 🔹 [DESIGN.md](DESIGN.md)
- 🔹 [FEATURES.md](FEATURES.md)
- 🔹 [LOG.md](LOG.md)
- 🔸 [MANUAL.md](MANUAL.md)
- 🔹 [README.md](../README.md)
- 🔹 [SPEC.md](SPEC.md)
- 🔹 [TASKS.md](TASKS.md)
- 🔹 [TERMS.md](TERMS.md)
- 🔹 [TESTING.md](TESTING.md)
- 🔹 [VERSIONS.md](VERSIONS.md)

## 🔍 Table of Contents
- [[#📥 Installation & Initial Deployment]] ^toc-install
- [[#🏗️ 1. Architecture Overview]] ^toc-architecture
- [[#🧠 2. Core Modules & Systems]] ^toc-modules
- [[#🔎 3. Core Algorithm & Mathematical Formulas]] ^toc-math
- [[#🛰️ 4. Commands, Keybindings & Context Flags]] ^toc-commands
- [[#🔧 5. Workspace Build & Configuration]] ^toc-config
- [[#🔍 Diagnostics & Common Troubleshooting]] ^toc-diagnostics
- [[#Go to...]] ^toc-goto

This guide describes the structural architecture, module layout, internal algorithms, optimization behaviors, and technical specifications of the **CE Command Picker** codebase.

---

## 📥 Installation & Initial Deployment
[[#^toc-install|TOC]]

### Setup Sequence
- 1. **Compile/Build Assets:** Run the compile script or build pipeline as documented in `BUILD.md`.
- 2. **Apply Configurations:** Run administrative scripts or system configurations required for the base application environment.
- 3. **Register Components:** Execute target registry configurations or system file bindings to link the software with the host operating system.

---

<!-- 
  INSTRUCTION: Outline the structural relationship of files and modules.
  Include raw ASCII boxes or diagrams to make the architecture immediately obvious.
-->
## 🏗️ 1. Architecture Overview
[[#^toc-architecture|TOC]]
```text
 +-----------------------------------------------------------------+

 |                      VS Code / Cursor Host                      |
 +-------------------------------+---------------------------------+
                                 |
                                 v
 +-------------------------------+---------------------------------+

 |                  Primary UI (extension-ui.js)                   |
 +-------------------------------+---------------------------------+
                                 |
           +---------------------+---------------------+

           |                                           |
           v                                           v
 +---------+---------------------+           +---------+-----------+

 |    Native Command Execution   |           |    Webview Form Pane    |
 +-------------------------------+           +---------------------+
```
- **Initialization**: VS Code loads `index.js` which executes the `activate` block, registering the main listener command `ce-command-picker.show`.
- **Triggering**: A user presses a key combination bound to `ce-command-picker.show`, passing an array of target command IDs as arguments.
- **UI Selection (Execution Mode)**: `extension-ui.js` parses the active keybindings file and formats custom shortcode notations via `extension-core.js` to render a high-density split-column Quick Pick list. Selecting an item triggers standard command execution via `vscode.commands.executeCommand`.
- **UI Selection (Edit Mode)**: Swapping the control item enters deep editing mode. Selecting an item prompts a secondary Quick Pick action menu allowing copying IDs/bindings, editing or removing keys. Editing launches the cache-busting Webview form (`extension-macros-form.js`) for custom key allocation.

---

<!-- 
  INSTRUCTION: Document individual subsystems, class constructors, interfaces, 
  and persistent background loops that govern state transitions.
-->
## 🧠 2. Core Modules & Systems
[[#^toc-modules|TOC]]
- **`extension-core.js` (Settings Registry I/O)**: Handles environment path detection between standard Code and Cursor, loads/saves the full keybinding array from `keybindings.json`, and parses shortcode representations (like `X.cas`) back and forth from native strings (like `ctrl+alt+shift+x`).
- **`extension-ui.js` (Command Palette UI)**: Controls the creation and lifecycle of the primary and secondary VS Code Quick Pick menus, intercepting clicks and delegating actions dynamically.
- **`extension-macros-form.js` (Key Assignment Webview)**: Instantiates side-by-side forms, rotates the viewType to break caching, and listens for webview validation and submit requests.
- **`extension-macros-validator.js` (Format Validator)**: Verifies that custom shortcode structures or native configurations contain correct base keys and modifier suffix flags.
- **`extension-navigation.js` (Cursor Code Alignment)**: Parses the AST tree of `keybindings.json` using `jsonc-parser`, locating exact coordinate offsets of active command bindings to reposition the user's cursor inside settings files.

---

<!-- 
  INSTRUCTION: Specify any underlying physical or software math calculations used.
  Represent equations cleanly in LaTeX format (e.g. $$ formula $$) with detailed variable legends.
-->
## 🔎 3. Core Algorithm & Mathematical Formulas
[[#^toc-math|TOC]]
The extension employs a custom key-to-notation mapping algorithm to transform verbose native keybindings into dense shortcodes, and vice versa. It processes input configurations, splits modifiers, maps characters, and encodes modifier arrays.

$$\text{Shorthand} = \text{baseKey} \mathbin{.} \text{flags}$$

- **`baseKey`**: The character key or mapped special key (e.g. `UP`, `DOWN`, `ENTER`).
- **`flags`**: A string containing modifier symbols (`w` for Win, `c` for Ctrl/Cmd, `a` for Alt, `s` for Shift).

---

<!-- 
  INSTRUCTION: Detail the operational command registry. This lists all binding combinations,
  modifier mappings, context filters, and background triggering gates.
-->
## 🛰️ 4. Commands, Keybindings & Context Flags
[[#^toc-commands|TOC]]
- **Show CE Command Picker (`ce-command-picker.show`)**:
  - **Key combinations**: Dynamic user keybindings or custom keybinding arrays.
  - **Contextual triggers**: Activated when any key chord configured matches this command action.
  - **Logical callback**: Shows the command selection Quick Pick list UI.

---

<!-- 
  INSTRUCTION: Document configuration files format (.ini, .json, .env.example) 
  and properties mapping. Highlight how to customize settings.
-->
## 🔧 5. Workspace Build & Configuration
[[#^toc-config|TOC]]
- **Environment Variable:** `VSCODE_PORT` (Not used, the extension is purely offline and local)
  - **Purpose:** Identifies the absolute path to the main physical asset directory.
  - **Expected Format:** Port integer (e.g. `3000`).
- **`keybindings.json` (Settings File)**:
  - **Configuration Section/Field**: `key` and `command` elements under user keybindings.
  - **Description**: Controls custom keyboard shortcode triggers and linked Command Picker commands. Overriding these fields changes key chords without needing source updates.

---

## 🔍 Diagnostics & Common Troubleshooting
[[#^toc-diagnostics|TOC]]

### Known Failure States & Remediations

#### 🚨 Symptom: "The keybindings.json file could not be parsed."
- **Root Cause:** The user's `keybindings.json` file contains syntactic errors, such as missing braces, unmatched brackets, or non-conforming trailing commas.
- **Remediation:** Manually open and repair the JSON structure of `keybindings.json`, or utilize the extension's robust parser to identify and trace the incorrect block alignment.

#### 🚨 Symptom: Changes apply to files, but the visual interface does not update.
- **Root Cause:** The embedded Chromium Webview is serving a cached iteration of the form rendering lifecycle.
- **Remediation:** The system auto-rotates the viewType using high-resolution millisecond timestamps (`Date.now()`). If caching still occurs, close and reopen the assignment pane to force a complete garbage collection flush.

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
- 🔸 [MANUAL.md](MANUAL.md)
- 🔹 [README.md](../README.md)
- 🔹 [SPEC.md](SPEC.md)
- 🔹 [TASKS.md](TASKS.md)
- 🔹 [TERMS.md](TERMS.md)
- 🔹 [TESTING.md](TESTING.md)
- 🔹 [VERSIONS.md](VERSIONS.md)

<!-- # TEMPLATE: MANUAL.template.md -->
