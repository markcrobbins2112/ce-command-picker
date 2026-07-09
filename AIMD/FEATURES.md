---
title: FEATURES
---

<!-- markdownlint-disable MD013 -->

# FEATURES

## 📑 AI Primary Files
- 🔹 [AGENTS.md](../AGENTS.md)
- 🔹 [ARCHIVE.md](ARCHIVE.md)
- 🔹 [BUILD.md](BUILD.md)
- 🔹 [CODE.md](CODE.md)
- 🔹 [DESIGN.md](DESIGN.md)
- 🔸 [FEATURES.md](FEATURES.md)
- 🔹 [LOG.md](LOG.md)
- 🔹 [MANUAL.md](MANUAL.md)
- 🔹 [README.md](../README.md)
- 🔹 [SPEC.md](SPEC.md)
- 🔹 [TASKS.md](TASKS.md)
- 🔹 [TERMS.md](TERMS.md)
- 🔹 [TESTING.md](TESTING.md)
- 🔹 [VERSIONS.md](VERSIONS.md)

## 🔍 Table of Contents
- [[#📦 Feature Groups]] ^toc-groups
- [[#🗄️ All Features]] ^toc-all-features
- [[#📉 Deprecated / Removed Features]] ^toc-deprecated
- [[#🚀 Go to...]] ^toc-goto

Welcome to CE Command Picker! This extension enables you to instantiate fully customizable command selection palettes on-the-fly directly by passing array arguments into standard keybinding contexts. It cuts down keyboard layout clutter, makes complex internal sequences memorable, and adapts elegantly across your entire engineering workspace.

## 📦 Feature Groups
[[#^toc-groups|TOC]]

### ⌨️ 1. Keybinding Registry Extraction & Translation ^z1
This capability tier focuses on parsing and formatting keybinding files directly from local machine configurations to find exact shortcut overrides matching targeted operations.
- **[Cross-Platform Path Configuration](#cross-platform-path-configuration)** - Automatically resolves unique, distinct global settings folders between standard VS Code instances and Cursor wrappers.
- **[Robust JSONC Parsing](#robust-jsonc-parsing)** - Sanitizes and builds stable mapping tables from target files without breaking over standard inline comments or unhygienic user commas.

### 🎨 2. High-Density Suffix Layout Presentation ^z2
This feature group governs formatting mechanisms that clean up raw runtime commands and structural tokens into legible, scannable dropdown views.
- **[Chord & Modifier Condensation](#chord--modifier-condensation)** - Reduces elaborate multi-stroke combinations and sequential strokes down to clean single-character trailing flags.
- **[Special Character Symbolic Replacement](#special-character-symbolic-replacement)** - Swaps raw terminal labels like navigation terms or positional descriptors out for pure visual glyph indicators.
- **[Split-Column Grid Real Estate Layout](#split-column-grid-real-estate-layout)** - Positions columns evenly across the palette using an explicit `{keybinding} {human readable} {right aligned id}` display rule.

---

## 🗄️ All Features
[[#^toc-all-features|TOC]]

### Chord & Modifier Condensation
- **Group:** [[#^z1|Keybinding Registry Extraction & Translation]]
This layout logic splits multi-step chord sequences on whitespace intervals and reduces long modifier strings down to individual characters grouped after a delimiter period (e.g. `ctrl+alt+shift+x` converts directly into `X.cas`).

### Cross-Platform Path Configuration
- **Group:** [[#^z1|Keybinding Registry Extraction & Translation]]
The extension evaluates environmental attributes at initialization via `vscode.env.appName`. If a `cursor` environment match is found, the system switches configuration folder parameters dynamically from `Code` to `Cursor` across Windows, macOS, and Linux profiles.

### Robust JSONC Parsing
- **Group:** [[#^z1|Keybinding Registry Extraction & Translation]]
The data compilation pipeline routes reading streams through `jsonc-parser`. This design preserves runtime uptime even when user-modified `keybindings.json` configurations contain comments or formatting errors that inherently crash default `JSON.parse` blocks.

### Special Character Symbolic Replacement
- **Group:** [[#^z2|High-Density Suffix Layout Presentation]]
A literal mapping dictionary intercepts raw non-character inputs. System values like `arrowdown` parse cleanly into arrows (`↓`), structural function commands evaluate into wrapped tags (`[F12]`), and control labels render in neat block lettering (`ESC`, `ENTER`).

### Split-Column Grid Real Estate Layout
- **Group:** [[#^z2|High-Density Suffix Layout Presentation]]
The picker maps items to standard container structures cleanly by storing both the shortcut suffix token and formatted text string together into the primary `label` item field. It pushes the long technical string into the `description` object property, forcing VS Code to right-align it naturally on the viewport grid.

---

## 📉 Deprecated / Removed Features
[[#^toc-deprecated|TOC]]
- **[!] Trailing Detail Row Shortcuts:** Earlier iterations bound shortcut details to a bottom-level `detail` field block underneath each picker target line. This created multi-line list rows that bloated panel navigation and wasted valuable vertical real estate.
  - **Replacement Pattern:** Replaced completely by moving the translated shorthand directly to the front of the main `label` element as a bracketed prefix header, shifting raw identifier values to the far right.

---
## 🚀 Go to...
[[#^toc-goto|TOC]]
- 🔹 [AGENTS.md](../AGENTS.md)
- 🔹 [ARCHIVE.md](ARCHIVE.md)
- 🔹 [BUILD.md](BUILD.md)
- 🔹 [CODE.md](CODE.md)
- 🔹 [DESIGN.md](DESIGN.md)
- 🔸 [FEATURES.md](FEATURES.md)
- 🔹 [LOG.md](LOG.md)
- 🔹 [MANUAL.md](MANUAL.md)
- 🔹 [README.md](../README.md)
- 🔹 [SPEC.md](SPEC.md)
- 🔹 [TASKS.md](TASKS.md)
- 🔹 [TERMS.md](TERMS.md)
- 🔹 [TESTING.md](TESTING.md)
- 🔹 [VERSIONS.md](VERSIONS.md)
