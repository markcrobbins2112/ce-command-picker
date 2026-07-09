const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Locate the correct system target directory for Cursor configurations dynamically
const homeDir = process.env.HOME || process.env.USERPROFILE;
const targetBaseDir = process.platform === 'win32' 
    ? path.join(process.env.APPDATA, 'Cursor', 'extensions')
    : path.join(homeDir, '.cursor', 'extensions');

const targetFolder = path.join(targetBaseDir, 'ce-command-picker-1.0.0');

console.log(`🚀 Targeting destination array: ${targetFolder}`);

try {
    // 2. Ensure the structural path layers exist on disk
    if (!fs.existsSync(targetBaseDir)) {
        fs.mkdirSync(targetBaseDir, { recursive: true });
    }

    // 3. Clear older deployment artifacts if they exist to prevent caching drops
    if (fs.existsSync(targetFolder)) {
        console.log('🧹 Purging older local compilation modules...');
        fs.rmSync(targetFolder, { recursive: true, force: true });
    }
    fs.mkdirSync(targetFolder, { recursive: true });

    // 4. Inject core package files into the system runtime layer
    const filesToCopy = ['package.json', 'extension.js', 'README.md'];
    filesToCopy.forEach(file => {
        const srcPath = path.join(__dirname, file);
        if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, path.join(targetFolder, file));
            console.log(`📦 Synced layout element: ${file}`);
        }
    });

    console.log('✅ Deployment compiled successfully! Reload your window instance to activate.');
} catch (err) {
    console.error('❌ Compilation failure encountered:', err.message);
    process.exit(1);
}
