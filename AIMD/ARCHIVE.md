---
title: ARCHIVE
---

<!-- # TEMPLATE: ARCHIVE.template.md -->
<!-- 
# ARCHIVE
# Any text bounded by double curly braces {{like this}} is a placeholder for you to fill out.
# Replace those placeholders with sunset modules or deprecated code logic.
#
# INSTRUCTIONS FOR THE AI AGENT:
# Use this document to review retired systems, obsolete specifications, and discarded logic paths. 
# Do not resurrect code snippets or architectural patterns from this file into the active codebase unless requested.
-->

<!-- markdownlint-disable MD013 -->

# ARCHIVE

## 📑 AI Primary Files
- 🔹 [AGENTS.md](../AGENTS.md)
- 🔸 [ARCHIVE.md](ARCHIVE.md)
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
- 🔹 [VERSIONS.md](VERSIONS.md)

## 🔍 Table of Contents
- [[#🚪 Retired Features & Components]] ^toc-retired
- [[#💾 Legacy Code Snippets & Discarded Scripts]] ^toc-snippets
- [[#📑 Obsolete Specifications & Scrapped Ideas]] ^toc-scrapped
- [[#🚀 Go to...]] ^toc-goto

## 🚪 Retired Features & Components
[[#^toc-retired|TOC]]

### ❌ Trailing Detail Row Shortcuts
- **Active Lifespan:** `v1.0.0` to `v1.1.0` (Retired on 2026-07-08)
- **Reason for Retirement:** Earlier versions bound custom shortcode shortcuts to the bottom `detail` text field under each command item inside the Quick Pick list layout. This created dual-row list structures that bloated the visual interface and wasted viewport vertical space, impairing high-speed terminal-like keyboard interactions.
- **Superseded By:** Moving shortcode representation directly to the front of the main `label` parameter using unified brackets (e.g. `[X.cas] Label`), while moving the raw technical command ID to the rightmost viewport grid slot (`description`).

---

## 💾 Legacy Code Snippets & Discarded Scripts
[[#^toc-snippets|TOC]]

### 📜 Obsolete Raw Detail Property Binding
- **Context:** Decoupled quick pick visual renderer structure before the unified display bracket refactoring.
- **Why it was replaced:** Storing separate details increased UI layout density, resulting in slow text scanning and layout fragmentation.
- **Legacy Implementation:**
  ```javascript
  // --- OBSOLETE DO NOT USE ---
  targetCommandIds.forEach(cmdId => {
      const shorthand = matches.map(m => core.formatToCustomShorthand(m.key)).join(', ');
      pickerItems.push({
          label: humanLabel,
          detail: shorthand, // Obsolete detail row mapping that caused double line vertical bloating
          commandId: cmdId
      });
  });
  ```

---

## 📑 Obsolete Specifications & Scrapped Ideas
[[#^toc-scrapped|TOC]]

### 💡 Inline Configuration Editing inside Quick Pick UI
- **Proposed on:** 2026-07-05
- **The Concept:** Allow users to directly type and modify custom shortcode strings inside the VS Code command search bar when entering edit mode, saving updates on press of the Enter key.
- **Why it failed/was dropped:** The native VS Code Quick Pick API restricts input textbox override behaviors. The input bar acts strictly as a list item filter and cannot handle multi-field configurations (such as modifying BOTH key combos and context-specific "when" clauses simultaneously). This led to the architectural transition to side-by-side Webview panels.

---
## 🚀 Go to...
[[#^toc-goto|TOC]]
- 🔹 [AGENTS.md](../AGENTS.md)
- 🔸 [ARCHIVE.md](ARCHIVE.md)
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
- 🔹 [VERSIONS.md](VERSIONS.md)

<!-- # TEMPLATE: ARCHIVE.template.md -->
