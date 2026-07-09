---
title: README
---

<!-- markdownlint-disable MD013 -->

# CE Command Picker

Isolated command pickers via keybinding arguments.

![icon](icon.png)
[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/markcrobbins)

## 📑 AI Primary Files
- 🔹 [AGENTS.md](AGENTS.md)
- 🔹 [ARCHIVE.md](AIMD/ARCHIVE.md)
- 🔹 [BUILD.md](AIMD/BUILD.md)
- 🔹 [CODE.md](AIMD/CODE.md)
- 🔹 [DESIGN.md](AIMD/DESIGN.md)
- 🔹 [FEATURES.md](AIMD/FEATURES.md)
- 🔹 [LOG.md](AIMD/LOG.md)
- 🔹 [MANUAL.md](AIMD/MANUAL.md)
- 🔸 [README.md](README.md)
- 🔹 [SPEC.md](AIMD/SPEC.md)
- 🔹 [TASKS.md](AIMD/TASKS.md)
- 🔹 [TERMS.md](AIMD/TERMS.md)
- 🔹 [TESTING.md](AIMD/TESTING.md)
- 🔹 [VERSIONS.md](AIMD/VERSIONS.md)

## 🔍 Table of Contents
- [[#🎯 Project Abstract & Core Value]] ^toc-abstract
- [[#🛠️ Technology Stack at a Glance]] ^toc-stack
- [[#📋 Keybinding Configuration Examples]] ^toc-examples
- [[#🏷️ Picker Suffix Mapping Reference]] ^toc-mappings
- [[#🗺️ Project Layout Blueprint]] ^toc-blueprint
- [[#⚡ Quick Start for AI Developers]] ^toc-quickstart
- [[#Go to...]] ^toc-goto

## 🎯 Project Abstract & Core Value
[[#^toc-abstract|TOC]]
- A high-utility productivity tool built explicitly for **VS Code** and **Cursor** that spawns localized quick-pick command panels completely on-the-fly via shortcut parameters. 
- It completely replaces cluttered interface navigation by turning complex multi-key command lists into streamlined drop-down ribbons.
- It features an ultra-clean alignment scheme displaying items in a strict format: **`{keybinding} {command human readable} {right aligned command id}`**.

---

## 🛠️ Technology Stack at a Glance
[[#^toc-stack|TOC]]
- **Target Operating System:** Cross-platform (Windows 10/11, macOS Darwin, Linux)
- **Core Languages & Runtimes:** Node.js, JavaScript (ES6+), VS Code Extension API
- **Integrations:** Global application keybindings file parsing (`keybindings.json`), runtime environment parsing (`vscode.env.appName`) for seamless side-by-side VS Code and Cursor operation
- **Dependencies:** `jsonc-parser` (Handles custom multi-line commentary/trailing commas in user settings registries without failing)

---

## 📋 Keybinding Configuration Examples
[[#^toc-examples|TOC]]

Configure arrays directly inside your global `keybindings.json` file. The interface formats your items dynamically inside the dropdown viewport.

### Example 1: Version Control Panel (`Alt+G`)
```json
{
  "key": "alt+g",
  "command": "ce-command-picker.show",
  "args": [
    "git.stage",
    "git.unstage",
    "git.commit",
    "git.push",
    "git.pull"
  ]
}
```
*   **Picker Output Format Look:**
    *   `[K.c C.c] Commit` ➔ *(Far Right ID)* ➔ `git.commit`

### Example 2: Editor Split Layouts (`Ctrl+Shift+W`)
```json
{
  "key": "ctrl+shift+w",
  "command": "ce-command-picker.show",
  "args": [
    "workbench.action.splitEditor",
    "workbench.action.closeEditorsInGroup",
    "workbench.action.toggleSidebarVisibility"
  ]
}
```
*   **Picker Output Format Look:**
    *   `[\.cs] Split Editor` ➔ *(Far Right ID)* ➔ `workbench.action.splitEditor`

---

## 🏷️ Picker Suffix Mapping Reference
[[#^toc-mappings|TOC]]

The translation engine converts massive user shortcut profiles down into standardized, tightly aligned visual tag headers:

| Standard Shortcut Sequence | Shorthand Suffix Display | Description |
| :--- | :--- | :--- |
| `ctrl+alt+shift+x` | **`X.cas`** | Suffix keys group Control, Alt, and Shift |
| `ctrl+shift+p` | **`P.cs`** | Clean modifier sorting |
| `ctrl+k ctrl+c` | **`K.c C.c`** | Sequenced multi-key chords fully separated |
| `ctrl+arrowdown` | **`↓.c`** | Special key arrow icon injection |
| `shift+alt+f12` | **`[F12].as`** | Explicit functional component brackets |

---

## 🗺️ Project Layout Blueprint
[[#^toc-blueprint|TOC]]
- **`AGENTS.md`** ➔ System prompts and operational boundaries for AI teammates.
- **`AIMD/ARCHIVE.md`** ➔ Scriptorium for scrapped ideas and sunset components.
- **`AIMD/BUILD.md`** ➔ Compiler pipelines, flags, and packaging steps.
- **`AIMD/CODE.md`** ➔ Syntax style guidelines and error-handling mandates.
- **`AIMD/DESIGN.md`** ➔ Structural topology, design patterns, and data flows.
- **`AIMD/FEATURES.md`** ➔ Capability matrices and functional product roadmap.
- **`AIMD/LOG.md`** ➔ Chronological audit trail of development decisions.
- **`AIMD/MANUAL.md`** ➔ Installation, user runbooks, and diagnostic workflows.
- **`README.md`** ➔ Primary entry point and structural system abstract.
- **`AIMD/SPEC.md`** ➔ Technical constraints, parameters, and protocol definitions.
- **`AIMD/TASKS.md`** ➔ Dynamic task board and backlog management queue.
- **`AIMD/TERMS.md`** ➔ Technical glossary, definitions, and vocabulary indexes.
- **`AIMD/TESTING.md`** ➔ Automation suites, edge cases, and QA assertion routines.
- **`AIMD/VERSIONS.md`** ➔ Change trackers and version milestone evolution lists.

---

## ⚡ Quick Start for AI Developers
[[#^toc-quickstart|TOC]]

### 1. Verify Environment & Workspace Check
Ensure node packages and global extensions are available:
```bash
npm install
```

### 2. Compile Local Package Bundle
Generate the independent `.vsix` installer module manually:
```bash
npm run package
```

---
## 🚀 Go to...
[[#^toc-goto|TOC]]
- 🔹 [AGENTS.md](AGENTS.md)
- 🔹 [ARCHIVE.md](AIMD/ARCHIVE.md)
- 🔹 [BUILD.md](AIMD/BUILD.md)
- 🔹 [CODE.md](AIMD/CODE.md)
- 🔹 [DESIGN.md](AIMD/DESIGN.md)
- 🔹 [FEATURES.md](AIMD/FEATURES.md)
- 🔹 [LOG.md](AIMD/LOG.md)
- 🔹 [MANUAL.md](AIMD/MANUAL.md)
- 🔸 [README.md](README.md)
- 🔹 [SPEC.md](AIMD/SPEC.md)
- 🔹 [TASKS.md](AIMD/TASKS.md)
- 🔹 [TERMS.md](AIMD/TERMS.md)
- 🔹 [TESTING.md](AIMD/TESTING.md)
- 🔹 [VERSIONS.md](AIMD/VERSIONS.md)
