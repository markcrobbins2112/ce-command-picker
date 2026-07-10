---
title: BUILD
---

<!-- # TEMPLATE: BUILD.template.md -->
<!-- 
# BUILD
# Any text bounded by double curly braces {{like this}} is a placeholder for you to fill out.
# Replace those placeholders with real paths, rules, and project constraints.
#
# INSTRUCTIONS FOR THE AI AGENT:
# This file serves as the system construction guide. It must document building blocks,
# dependencies installation commands, target directory structures, packing pipelines,
# and runtime execution.
-->

<!-- markdownlint-disable MD013 -->

# BUILD

## 📑 AI Primary Files
- 🔹 [AGENTS.md](../AGENTS.md)
- 🔹 [ARCHIVE.md](ARCHIVE.md)
- 🔸 [BUILD.md](BUILD.md)
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
- [[#📋 Prerequisites & Toolchain Setup]] ^toc-prereq
- [[#🛠️ Build & Packaging Pipeline]] ^toc-pipeline
- [[#🚀 Execution & Packing Commands]] ^toc-commands
- [[#🧪 Post-Build Verification Rules]] ^toc-verify
- [[#🚀 Go to...]] ^toc-goto

## 📋 Prerequisites & Toolchain Setup
[[#^toc-prereq|TOC]]
- **Compiler/Runtime:** Node.js v18.x / v20.x / v22.x, NPM Package Manager.
- **Global System Variables Required:**
  - `APPDATA` / `HOME` / `USERPROFILE`: Paths required by the extension logic to locate the active configuration directory (`Cursor` or `Code`) under standard system paths.
  - `PATH`: System executable routing variable, which must contain either `cursor` or `code` CLI binary commands to support automatic local installation/sideloading.

---

<!-- 
  INSTRUCTION: Detail the high-level architecture of the build system.
  Mention variables compilation pathways, compiler tools, preprocessors, etc.
-->
## 🛠️ Build & Packaging Pipeline
[[#^toc-pipeline|TOC]]
- **Clean Step**: The build utility reads the workspace root and clears any existing `.vsix` files to prevent package cache locks.
- **Semantic Versioning Step**: Automatically reads `/package.json`, extracts the current version value, auto-increments the trailing patch number (e.g. `1.2.24` -> `1.2.25`), and saves the file back to disk.
- **CLI Target Routing Step**: Probes the system path by checking execution of `cursor --version` or `code --version` to decide whether Cursor or Standard VS Code is the active environment target.
- **Uninstall Cached Version Step**: Invokes `${cliBinary} --uninstall-extension markrobbins.ce-command-picker` to clean up the existing local extension cache, avoiding memory/lock conflicts.
- **Compilation Bundler Step**: Runs the fast `esbuild` engine to transpile and bundle our modular JS files (`/src/index.js`) into a single-file CommonJS module located at `./extension.js`, using a `node` platform target.
- **Package Zip Step**: Automatically executes `npx vsce package` to create a compiled, compressed `.vsix` extension archive file matching the incremented version.
- **Installation Sideload Step**: Executes `${cliBinary} --install-extension <fresh_vsix_package>` to load the new build directly into the local host editor context.

### 📦 Key Components
- **`src/index.js`**: Central extension bootstrap entry point matching VS Code's activation events.
- **`build.js`**: Custom Node.js scripting orchestrator managing the cleanup, version-bump, compilation, and sideloading tasks.
- **`package.json`**: Extension configuration manifest specifying command contributions, dependencies, metadata, and build rules.
- **`esbuild`**: High-performance bundler and transpiler utilized to combine src modules into a single, light file.
- **`@vscode/vsce`**: The official VS Code extension packaging utility, which compiles the codebase into the target `.vsix` archive binary.

---

<!-- 
  INSTRUCTION: List the literal, usable CLI shell commands for restoring packages, 
  launching development modes, linting files, and packaging production bundles.
-->
## 🚀 Execution & Packing Commands
[[#^toc-commands|TOC]]
- **Install Dependencies**:
  ```bash
  npm install
  ```
- **Local Dev Server / Watch Mode**:
  ```bash
  # Runs the version-bump, clean, compile, package, and sideload loop
  node build.js
  ```
- **Verification / Linting**:
  ```bash
  # Compile-verify check without output packaging
  npx esbuild src/index.js --bundle --platform=node --external:vscode --dry
  ```
- **Production Package Compilation**:
  ```bash
  npm run build
  ```

---

## 🧪 Post-Build Verification Rules
[[#^toc-verify|TOC]]
- 1. **Size Checking:** Verify that the output executable or bundle size is greater than `0 KB`.
- 2. **Path Verification:** Check that the output file is located exactly within the target distribution directory layout.
- 3. **Smoke Test Command:** `node build.js` (Performs a full, successful compilation, version-increment, and sideload side packaging verification).

---
## 🚀 Go to...
[[#^toc-goto|TOC]]
- 🔹 [AGENTS.md](../AGENTS.md)
- 🔹 [ARCHIVE.md](ARCHIVE.md)
- 🔸 [BUILD.md](BUILD.md)
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

<!-- # TEMPLATE: BUILD.template.md -->
