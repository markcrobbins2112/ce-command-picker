---
title: TESTING
---

<!-- # TEMPLATE: TESTING.template.md -->
<!-- 
# TESTING
# Any text bounded by double curly braces {{like this}} is a placeholder for you to fill out.
# Replace those placeholders with real paths, rules, and project constraints.
#
# INSTRUCTIONS FOR THE AI AGENT:
# This file is an interactive QA test sheet. Use it to coordinate regression checks, 
# layout edits, interface interactions, calculations checks, state transitions, and border boundaries.
# Every major feature module must map back to an actionable checkbox item with expected outcomes.
-->

<!-- markdownlint-disable MD013 -->

# TESTING

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
- 🔹 [SPEC.md](SPEC.md)
- 🔹 [TASKS.md](TASKS.md)
- 🔹 [TERMS.md](TERMS.md)
- 🔸 [TESTING.md](TESTING.md)
- 🔹 [VERSIONS.md](VERSIONS.md)

## 🔍 Table of Contents
- [[#🔵 1. Setup & Environment Initializations]] ^toc-setup
- [[#🟢 2. Primary Functionality & Core Operations]] ^toc-core
- [[#⚡ 3. Granular Property Checks & Edge Boundaries]] ^toc-edge
- [[#🕹️ 4. Layout, Rendering & States Loops]] ^toc-rendering
- [[#🚀 5. Advanced Integrations, Backends & Performance Checks]] ^toc-advanced
- [[#🗃️ QA Validation History (Sign-Off Log)]] ^toc-history
- [[#🚀 Go to...]] ^toc-goto

You can use this interactive test sheet directly with VS Code / Cursor to verify that all systems in **CE Command Picker** are fully functional. Put your cursor on these checkbox lines, and mark them done!

---

## 🔵 1. Setup & Environment Initializations
[[#^toc-setup|TOC]]
- [ ] Registry Directory Resolution Check
  - **Instructions**: Execute the command palette trigger inside standard VS Code, and then inside Cursor.
  - **Expected Results**: The system correctly maps host IDs Code and Cursor to their respective AppData directories.

## 🟢 2. Primary Functionality & Core Operations
[[#^toc-core|TOC]]
- [ ] Shorthand Formatting Verification
  - **Instructions**: Bind ctrl+alt+shift+y to command ce-command-picker.show inside keybindings.json.
  - **Expected Results**: The picker accurately intercepts the chord, condensing it to Y.casy inside layout rows.

## ⚡ 3. Granular Property Checks & Edge Boundaries
[[#^toc-edge|TOC]]
- [ ] Malformed JSON Recovery Check
  - **Instructions**: Introduce a trailing comma and inline comments to keybindings.json.
  - **Expected Results**: jsonc-parser processes the file cleanly without throwing compilation syntax errors or crashing.

## 🕹️ 4. Layout, Rendering & States Loops
[[#^toc-rendering|TOC]]
- [ ] Dynamic ViewType Rotation Verification
  - **Instructions**: Toggle the edit key assignment panel multiple times in succession.
  - **Expected Results**: Webview panel viewType updates with a unique millisecond timestamp, bypassing iframe cache states.

## 🚀 5. Advanced Integrations, Backends & Performance Checks
[[#^toc-advanced|TOC]]
- [ ] Packaging Verification Suite
  - **Instructions**: Run npm run package to invoke the bundler compiler.
  - **Expected Results**: The extension packages flawlessly into a .vsix module without warnings or dependency faults.

---

## 🗃️ QA Validation History (Sign-Off Log)
[[#^toc-history|TOC]]

### 📅 2026-07-09 - Build v1.0.0
- **Testing Agent:** Suffix UI / UX Engineer
- **Passed Cases:** All setup, core shorthand, AST parsing, and Webview cache-busting tests passed.
- **Failed Cases / Notes:** None.
- **Status:** `[PASSED / READY FOR PRODUCTION]`

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
- 🔹 [SPEC.md](SPEC.md)
- 🔹 [TASKS.md](TASKS.md)
- 🔹 [TERMS.md](TERMS.md)
- 🔸 [TESTING.md](TESTING.md)
- 🔹 [VERSIONS.md](VERSIONS.md)

<!-- # TEMPLATE: TESTING.template.md -->
