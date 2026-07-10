---
title: DESIGN
---

<!-- # TEMPLATE: DESIGN.template.md -->
<!-- 
# DESIGN
# Any text bounded by double curly braces {{like this}} is a placeholder for you to fill out.
# Replace those placeholders with real paths, rules, and project constraints.
#
# INSTRUCTIONS FOR THE AI AGENT:
# Use this document as the single source of truth for the system's design patterns, constraints, and data flow. 
# Do not propose code or modifications that violate the patterns, structural layouts, or database schemas defined below.
-->

<!-- markdownlint-disable MD013 -->

# DESIGN

## 📑 AI Primary Files
- 🔹 [AGENTS.md](../AGENTS.md)
- 🔹 [ARCHIVE.md](ARCHIVE.md)
- 🔹 [BUILD.md](BUILD.md)
- 🔹 [CODE.md](CODE.md)
- 🔸 [DESIGN.md](DESIGN.md)
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
- [[#🗺️ System Topology & Context Map]] ^toc-topology
- [[#💻 High-Level Components & Communication]] ^toc-components
- [[#💾 Data Architecture & Schema Rules]] ^toc-data
- [[#📂 Core File Structure Layout]] ^toc-layout
- [[#🚦 Design Principles & Guardrails]] ^toc-guardrails
- [[#🚀 Go to...]] ^toc-goto

## 🗺️ System Topology & Context Map
[[#^toc-topology|TOC]]
- **Architecture Style:** Modular CommonJS Extension Architecture. Decoupled controller layers (core parsing, UI menus, webview forms, validators, custom navigation).
- **Primary Language Stack:** Node.js, JavaScript (ES6+ CommonJS modules syntax) and HTML5/CSS3.
- **Frameworks & Core Runtimes:** VS Code Extension API (`vscode`), Node.js, and Chromium (Webviews).

## 💻 High-Level Components & Communication
[[#^toc-components|TOC]]
- **Frontend/Client:** Webview Panel (for side-by-side key assignment and validation forms with dynamic viewType rotation to break cache) & VS Code Quick Pick UI (for menus and palettes).
- **Backend Core:** `extension-core.js` manages settings resolution paths, reading from/writing to `keybindings.json`, parsing shortcode notations, and converting to native formats.
- **External Integration:** Directly integrates with the local operating system's IDE settings filesystem via VS Code/Cursor API and `fs`.

---

## 💾 Data Architecture & Schema Rules
[[#^toc-data|TOC]]
- **Storage Type:** Flat JSON with comments (JSONC) format (`keybindings.json`).
- **State Constraints:** Standard environment configuration folders, dynamically switching between VS Code (`Code`) and Cursor (`Cursor`) configuration directories based on active app detection.

## 📂 Core File Structure Layout
[[#^toc-layout|TOC]]
```text
📂 Project Root/
├── 📂 src/                    # Core business logic execution modules
│   ├── 📂 webview/            # HTML/CSS/JS client-side assets for forms
│   ├── extension-core.js      # Keybindings JSON data operations and translations
│   ├── extension-ui.js        # VS Code Quick Pick command palette controllers
│   └── ...                    # Validators, navigation helpers, macro controllers
└── 📂 AIMD/                   # Project documentation index sheets
```

---

## 🚦 Design Principles & Guardrails
[[#^toc-guardrails|TOC]]
- **Dependency Minimization:** Avoid adding external packages/libraries unless natively impossible.
- **Separation of Concerns:** Keep presentation/UI entirely decoupled from system-level business logic.
- **Security Constraints:** Strict syntactical parsing and validation on keyboard input configurations (using custom validators) before serialization to protect user `keybindings.json` profiles from corruption or structure breaks.

---
## 🚀 Go to...
[[#^toc-goto|TOC]]
- 🔹 [AGENTS.md](../AGENTS.md)
- 🔹 [ARCHIVE.md](ARCHIVE.md)
- 🔹 [BUILD.md](BUILD.md)
- 🔹 [CODE.md](CODE.md)
- 🔸 [DESIGN.md](DESIGN.md)
- 🔹 [FEATURES.md](FEATURES.md)
- 🔹 [LOG.md](LOG.md)
- 🔹 [MANUAL.md](MANUAL.md)
- 🔹 [README.md](../README.md)
- 🔹 [SPEC.md](SPEC.md)
- 🔹 [TASKS.md](TASKS.md)
- 🔹 [TERMS.md](TERMS.md)
- 🔹 [TESTING.md](TESTING.md)
- 🔹 [VERSIONS.md](VERSIONS.md)

<!-- # TEMPLATE: DESIGN.template.md -->
