---
title: TASKS
---

<!-- # TEMPLATE: TASKS.template.md -->
<!-- 
# TASKS
# Any text bounded by double curly braces {{like this}} is a placeholder for you to fill out.
# Replace those placeholders with real paths, rules, and project constraints.
#
# INSTRUCTIONS FOR THE AI AGENT:
# This file tracks immediate development tasks and feature checklists.
# Always update this backlog at the beginning of your turn (when new chat instructions 
# are received) and mark items completed ([x]) once verified.
-->

<!-- markdownlint-disable MD013 -->

# TASKS

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
- 🔸 [TASKS.md](TASKS.md)
- 🔹 [TERMS.md](TERMS.md)
- 🔹 [TESTING.md](TESTING.md)
- 🔹 [VERSIONS.md](VERSIONS.md)

## 🔍 Table of Contents
## 🔍 Table of Contents
- [[#💬 Incoming tasks from chat]] ^toc-chat
- [[#🔄 New Changes]] ^toc-changes
- [[#⚙️ New Settings]] ^toc-new-settings
- [[#🕹️ New Commands]] ^toc-new-commands
- [[#⌨️ New Bindings]] ^toc-new-bindings
- [[#🚀 New Features]] ^toc-new-features
- [[#🛑 Blocked Items & Impediments]] ^toc-blocked
- [[#🗃️ Completed Backlog (Archive)]] ^toc-backlog
- [[#🛠️ Settings]] ^toc-arch-settings
- [[#💻 Commands]] ^toc-arch-commands
- [[#🔗 Bindings]] ^toc-arch-bindings
- [[#📦 Features]] ^toc-arch-features
- [[#🚀 Go to...]] ^toc-goto

<!-- 
  INSTRUCTION: Detail direct feature and workflow requests from the user's chat stream.
  State tasks explicitly and breakdown complex tasks into sub-bullets.
-->
## 💬 Incoming tasks from chat
[[#^toc-chat|TOC]]
- [x] Auto-focus fullShorthandInput when tab/webview is focused or first drawn
- [x] Correct Close All KB Json function to close all keybindings.json file tabs
- [x] Correct Close All KB UI to successfully close all Keyboard Shortcuts tabs
- [x] Rename Copy Binding to Copy Current Binding, which copies original/current settings
- [x] Add Copy New Binding button next to Copy Current Binding, which copies form-constructed key values
- [x] Rename << and >> paging buttons to <<[] and []>> representing next/prev without checkoff
- [x] Add <<[x] and [x]>> paging buttons representing next/prev with checkoff
- [x] Adjust paging buttons tooltips accordingly
- [x] Fix Add button (btnSaveClone) to always create a new entry instead of editing the existing one
- [x] Fix Save button (btnSubmit) to not reopen the primary menu upon disposal
- [x] Remove Assign Key from secondary menu
- [x] Reorder secondary menu options
- [x] Set Alt color to #2f2bfb
- [x] Color modC label red and modA label blue
- [x] Color modC + modA labels purple when both are checked
- [x] Lighten other modifier label colors when Win key is checked
- [x] Offer a button to launch target editor UI when validation collision occurs
- [x] Layout Copy Binding button and Paging buttons on the same row
- [x] Add an Edit Picker Key button for `ce-command-picker.show` (instigator) on the Copy Binding/Paging row
- [x] Rename 'Action:' to 'Command:' in form panel
- [x] Add inline copy icon button before 'Command:' to copy command ID
- [x] Put 'Copy Binding' helper button next to 'Command:' header and remove from bottom row
- [x] Implement robust 'Changed' indicator normalization to hide badge on initial load
- [x] Put 'Reset' helper button after 'Key:' shorthand input field and remove from bottom row
- [x] Put copy icon button before 'Key:' label to copy shorthand string
- [x] Group Base Key (width 4em) and Code (width 2em) inputs in tight container
- [x] Format Mods checkbox-group with tight style and flex-wrap: nowrap
- [x] Rename Context Clause label to simple 'When' label
- [x] Synchronize and complete entire AIMD documentation suite

<!-- 
  INSTRUCTION: Checklists of ongoing file structural, layout, or backend changes.
-->
## 🔄 New Changes
[[#^toc-changes|TOC]]
- [x] Map all documentation template fields
  - Synchronized project specs and build pipelines with active codebase features.

<!-- 
  INSTRUCTION: Specify any new application configurations, environment overrides, 
  or system values in local settings containers (.json, .ini, .env).
-->
## ⚙️ New Settings
[[#^toc-new-settings|TOC]]
- [x] keybindings.json configuration
  - Customizable chord notation strings with modifier suffixes.

<!-- 
  INSTRUCTION: Tasks mapping to newly registered commands (e.g., VS Code commands, AHK actions).
-->
## 🕹️ New Commands
[[#^toc-new-commands|TOC]]
- [x] Command: `ce-command-picker.show`
  - Invokes dynamic command selection palettes passed as arguments.

<!-- 
  INSTRUCTION: Tasks mapping to newly configured keystroke hotkeys or shortcuts.
-->
## ⌨️ New Bindings
[[#^toc-new-bindings|TOC]]
- [x] Binding: Webview key assignment panel
  - Directly assigns modifiers and base keys to active user settings.

<!-- 
  INSTRUCTION: Checklists of newly requested major feature modules.
-->
## 🚀 New Features
[[#^toc-new-features|TOC]]
- [x] Clear Button resets the entire form region
  - Clears both chords, modifier flags, and when constraint fields instantly.
- [x] Shorthand Chord Condensation
  - Automatically minimizes long native bindings into a clean visual trailing suffix representation.

---

## 🛑 Blocked Items & Impediments
[[#^toc-blocked|TOC]]
- **No Blocked Tasks**: The execution, build, and documentation flows are functioning cleanly and without any impediments.

---

## 🗃️ Completed Backlog (Archive)
[[#^toc-backlog|TOC]]
- [x] **TASK-001 - Baseline Environment Layout Initialization** (By Extension System Architect on 2026-06-23)
- [x] **TASK-002 - Isolated Command Picker Parsing & Suffix Layouts** (By Suffix UI/UX Engineer on 2026-07-09)
- [x] **TASK-003 - Complete Technical Specification Synchronizations** (By Suffix UI/UX Engineer on 2026-07-09)

### 🛠️ Settings
[[#^toc-arch-settings|TOC]]
- **keybindings.json**: Stores dynamic pickers and target sequences.

### 💻 Commands
[[#^toc-arch-commands|TOC]]
- **ce-command-picker.show**: Central entry command trigger.

### 🔗 Bindings
[[#^toc-arch-bindings|TOC]]
- **User defined chords**: Automatically parsed and displayed.

### 📦 Features
[[#^toc-arch-features|TOC]]
- **Split-Column layout**: Pushes custom technical metadata to right aligned headers.

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
- 🔸 [TASKS.md](TASKS.md)
- 🔹 [TERMS.md](TERMS.md)
- 🔹 [TESTING.md](TESTING.md)
- 🔹 [VERSIONS.md](VERSIONS.md)

<!-- # TEMPLATE: TASKS.template.md -->
