---
title: VERSIONS
---

<!-- # TEMPLATE: VERSIONS.template.md -->
<!-- 
# VERSIONS
# Any text bounded by double curly braces {{like this}} is a placeholder for you to fill out.
# Replace those placeholders with semantic version history and deployment updates.
#
# INSTRUCTIONS FOR THE AI AGENT:
# Use this document to trace the evolution of the software across versions. 
# When deploying a new stable release or version milestone, document it at the TOP of this file using semantic versioning.
-->

<!-- markdownlint-disable MD013 -->

# VERSIONS

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
- 🔹 [TESTING.md](TESTING.md)
- 🔸 [VERSIONS.md](VERSIONS.md)

## 🔍 Table of Contents
- [[#🚀 Stable Releases & Milestones]] ^toc-stable
- [[#🏗️ Pre-Release Iterations (Alpha/Beta Sandbox)]] ^toc-prerelease
- [[#🚀 Go to...]] ^toc-goto

## 🚀 Stable Releases & Milestones
[[#^toc-stable|TOC]]

### 🏷️ v1.2.57 (2026-07-10) - In-Place Webview Paging and DOM Update Optimization
- **Added / Enhanced:**
  - Implemented real-time in-place webview update message handler (`updateItem`) to eliminate the heavy dispose/re-create webview cycles during pagination.
  - Refined the backend message routing in `promptAssignKey` to update captured closure state variables on-the-fly and keep save/unbind handlers synchronized with the current active item.
  - Provided direct client-side updates to title labels, checked-off indicators, validation baselines, and dynamic page counters with zero iframe flickering.

### 🏷️ v1.2.56 (2026-07-10) - Tab Group Isolation, Stateful Focus Restoration, Boundary Paging, and Dirty Checking Done Handler
- **Added / Enhanced:**
  - Implemented stateful input focus restoration using active document tracking so that focusing back to the webview retains whichever input was previously focused.
  - Isolated editor tab spawning inside opposite columns using the window tabGroups API to prevent any helper tab from ever opening in the webview's column.
  - Replaced panel closure on Save with saveSuccess status updates to allow continuous editing.
  - Added a Done button next to Save that closes the tab, with a dirty-checking warning in VS Code if the form has unsaved modifications.
  - Updated `< previous` and `> next` paging buttons to disable at boundaries (first and last item) and prevented wrap-around behavior.

### 🏷️ v1.2.55 (2026-07-10) - Dual-Mode Search Navigation, Double-Escaped Regex Repair, and Defensive Focus
- **Added / Enhanced:**
  - Implemented search-based checkoff navigation for the `<<[]` (unchecked backward), `[]>>` (unchecked forward), `<<[x]` (checked backward), and `[x]>>` (checked forward) paging buttons.
  - Added simple `<` (previous item) and `>` (next item) paging buttons to easily cycle through items one by one.
  - Engineered an automated dynamic state controller that enables/disables each of the 8 paging buttons based on matching target availability in their search direction.
  - Upgraded focus management to use a smart defensive algorithm that focuses `fullShorthandInput` on view state changes and window focus *only* when no other inputs or buttons are currently active.
- **Fixed / Patched:**
  - Repaired a critical base key extraction bug by correcting double-escaped backend regexes (`\\\\s` and `\\\\.`) in the frontend webview JavaScript code, returning full accuracy to chord parsing and population.

### 🏷️ v1.2.54 (2026-07-10) - Auto-Focus, Multi-Tab Close Fixes, Distinct Copy Actions, and Dual-Mode Paging
- **Added / Enhanced:**
  - Implemented automatic, timing-isolated focus mechanism for the `fullShorthandInput` keybinding input field when the webview is first drawn or focused.
  - Divided copy capabilities into distinct **Copy Current Binding** (captures the raw initial/original keybinding settings) and **Copy New Binding** (captures the user-modified form values) actions.
  - Re-engineered the queue navigation paging controls to support dual-mode traversal:
    - **Previous/Next without Checkoff** (`<<[]` and `[]>>`): Standard list paging.
    - **Previous/Next with Checkoff** (`<<[x]` and `[x]>>`): Marks the active item completed/checked-off and pages in one click.
  - Formulated descriptive, contextual tooltips for all custom paging icons.
  - Restructured the **Add** button (`btnSaveClone`) to always append new mappings to settings (mirroring clone), ensuring a new entry is generated instead of modifying the existing one.
- **Fixed / Patched:**
  - Patched `Close All KB Json` and `Close All KB UI` tab destruction algorithms to iterate over non-mutated target collections, successfully closing all open files and native settings pages rather than just the first found.
  - Prevented the **Save** button (`btnSubmit`) from reopening the primary Pick menu panel upon panel disposal, allowing seamless, silent completions.

### 🏷️ v1.2.53 (2026-07-10) - Custom Modifier Styling, Secondary Menu Reordering, and Collision Solver UI
- **Added / Enhanced:**
  - Integrated customizable dynamic modifier label styling: modC is red, modA is the blue alt-color (#2f2bfb), and if both Ctrl and Alt are checked, they both turn purple.
  - Implemented an elegant Windows key flag listener: when checked, all other modifier key labels dynamically shift to lighter color variations.
  - Reordered secondary menu options with specific hierarchy rules and completely removed the old "Assign Key" action.
  - Implemented automatic, dynamic launch-to-edit action buttons in webview validation status dialogues for each colliding command ID, enabling direct traversal into that action's editor UI.
  - Combined the Copy Binding button, instigator edit button (`ce-command-picker.show`), and the paging buttons on a single unified, responsive row.
- **Fixed / Patched:**
  - Resolved nested script syntax errors inside html template files by avoiding unescaped backtick characters.

### 🏷️ v1.2.46 (2026-07-10) - Changed Indicator State Normalization Fix
- **Fixed / Patched:**
  - Patched validation status dispatch in the extension-macros-form controller to pass the validated `nativeKey` along during keybinding collisions/warnings.
  - Implemented an elegant timing-isolated state normalization mechanism inside the webview JS that suppresses the 'Changed' badge indicator during the initial layout loading and form resets.

### 🏷️ v1.2.45 (2026-07-10) - Form Layout Grouping and Action Relocations
- **Added / Enhanced:**
  - Renamed 'Action:' to 'Command:' in web form panel.
  - Placed inline icon buttons to copy Command ID (next to Command label) and Shorthand Key (next to Key label).
  - Placed 'Copy Binding' helper next to Command heading and 'Reset' helper next to Shorthand input, and removed both from the bottom button row.
  - Restructured Base Key and Code input controls into a tight nested flex container (Base Key width 4em, Code width 2em).
  - Wrapped Mods checkbox controls into a tight nowrap container style.
  - Renamed context constraint label to simple 'When'.
- **Fixed / Patched:**
  - Standardized state comparisons in 'Changed' indicator to prevent showing badge on initial load.

### 🏷️ v1.2.42 (2026-07-10) - Bidirectional Shorthand Key Input & Layout Redesign
- **Added / Enhanced:**
  - Redesigned Key UI panel layouts to exact visual specifications: Base Key | Code | Mods [W] [C] [A] [S].
  - Introduced bidirectional shorthand 'Key:' field located immediately below 'Current When', allowing fast key mappings directly via string input.
  - Added visual "Changed" badge indicator indicating when inputs no longer mirror original current keybinding configuration state.
  - Divided helper actions into two cleanly labeled rows: 'Current' and 'New' for precise native VS Code Keyboard Shortcut configuration panel links.
  - Added extensive, rich tooltips describing functionalities of all available interface controls.
- **Fixed / Patched:**
  - Removed old unassigned KB UI Clear button.
  - Fixed Unbind action parameters to cleanly reference selected command bindings.
  - Bounded esbuild packaging configurations.

### 🏷️ v1.2.35 (2026-07-10) - Advanced Form Controls & Keyboard Shortcut Integrations
- **Added / Enhanced:**
  - Redesigned visual Current Key(s) displays to list active mappings cleanly as separate "Binding: shorthand" and "Binding: native" entries.
  - Added "Reset" action button positioned before "Clear" button, enabling synchronous state recoveries.
  - Integrated red validation alerts on Base Key inputs, visually emphasizing incorrect syntax while embedding detailed tooltips.
  - Added 8 dedicated, customizable Keyboard Shortcut UI helper buttons for immediate search filters.
  - Formulated comprehensive, descriptive tooltip titles for all available form actions.
- **Fixed / Patched:**
  - Renamed "Save Mappings" to "Save" and "Save and Clone" to "Add", configuring both to be disabled unless actual changes occur.
  - Refactored unbind actions: removed the redundant standalone Unbind button and mapped "Unbind" behavior cleanly into the Clone button.

### 🏷️ v1.2.34 (2026-07-10) - Form & Webview Logic Integration Patch
- **Added / Enhanced:**
  - Double-escaped regular expression structures (`\\+`, `\\.`, `\\s`) inside the template-enclosed webview JavaScript to guarantee safe client-side execution without parsing syntax errors.
  - Implemented exact multi-chord `baseKey` / `baseKey2` extraction with lowercase `'insert'` preservation to prevent unexpected automated test failures.
  - Full-sync checkboxes and shortcode boxes via multi-event listener handlers (`input`, `change`, `keyup`, `click`).
- **Fixed / Patched:**
  - Resolved `Uncaught SyntaxError: Invalid regular expression: /+/g: Nothing to repeat` error within webview sandboxes.
  - Fixed when-clause population and target assignment mapping.

### 🏷️ v1.1.0 (2026-07-09) - Webview Panel Optimization Update
- **Added / Enhanced:**
  - Implemented dynamic viewType timestamp-rotation to cleanly bypass Chromium Webview cache persistence.
  - Upgraded settings directory path resolvers to auto-detect Cursor host containers on macOS and Linux platforms.
- **Fixed / Patched:**
  - Fixed a chord notation conversion failure occurring when Shift and Alt modifier combinations are bound.
  - Corrected directory lock-ups when scanning corrupt configurations containing multiline non-conforming items.
- **Breaking Changes & Remediations:**
  - No breaking changes are introduced. This is a backward-compatible visual layout optimization update.

### 🏷️ v1.0.0 (2026-06-23) - Baseline Production Launch
- **Summary:** Baseline production-ready release of CE Command Picker, empowering engineers to run custom command selection lists side-by-side.
- **Core Capabilities:**
  - Isolated Command Picker command arguments translation.
  - Clean AST-based parsing using the native `jsonc-parser`.

---

## 🏗️ Pre-Release Iterations (Alpha/Beta Sandbox)
[[#^toc-prerelease|TOC]]

### 🏷️ v0.1.0-beta (2026-06-10)
- **Milestone:** Initial alpha integration testing demonstrating standard workspace registry mappings.

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
- 🔹 [TESTING.md](TESTING.md)
- 🔸 [VERSIONS.md](VERSIONS.md)

<!-- # TEMPLATE: VERSIONS.template.md -->
