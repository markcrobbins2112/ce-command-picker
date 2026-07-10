// START OF FILE: build.js

const esbuild = require('esbuild');
const path = require('path');
const execSync = require('child_process').execSync;
const fs = require('fs');

console.log('🚀 Initializing Version-Advancing CE Command Picker Pipeline...\n');

const packageJsonPath = path.join(__dirname, 'package.json');

// Step 1: Clean all VSIX artifacts in the workspace directory aggressively
try {
    console.log('🧹 Purging all leftover .vsix bundle files from workspace root...');
    const workspaceFiles = fs.readdirSync(__dirname);
    let deletedCount = 0;
    
    workspaceFiles.forEach(file => {
        if (file.endsWith('.vsix')) {
            const fullVsixPath = path.join(__dirname, file);
            // Ensure permissions are clear and delete the physical file
            fs.chmodSync(fullVsixPath, 0o666);
            fs.unlinkSync(fullVsixPath);
            deletedCount++;
        }
    });
    if (deletedCount > 0) {
        console.log(`✓ Successfully removed ${deletedCount} stale .vsix bundle archive(s).`);
    } else {
        console.log('💡 Note: No .vsix file fragments found to wipe.');
    }
} catch (err) {
    console.error('⚠️ Warning: File cleanup pass encountered an error:', err.message);
}

// Step 2: Read, increment last version digit, and save package.json
let manifestData;
try {
    const rawManifest = fs.readFileSync(packageJsonPath, 'utf8');
    manifestData = JSON.parse(rawManifest);
} catch (err) {
    console.error('❌ Critical: Failed to parse package.json manifest:', err.message);
    process.exit(1);
}

const oldVersion = manifestData.version || '1.0.0';
let versionParts = oldVersion.split('.');

if (versionParts.length === 3) {
    versionParts[2] = String(parseInt(versionParts[2], 10) + 1);
} else {
    console.error(`⚠️ Version parsing error: "${oldVersion}" is not semantic. Defaulting patch bump extension logic.`);
    versionParts[versionParts.length - 1] = String(parseInt(versionParts[versionParts.length - 1], 10) + 1);
}

const newVersion = versionParts.join('.');
manifestData.version = newVersion;

try {
    fs.writeFileSync(packageJsonPath, JSON.stringify(manifestData, null, 2), 'utf8');
    console.log(`📈 Advanced package version: ${oldVersion} ➔ ${newVersion}`);
} catch (err) {
    console.error('❌ Critical: Failed to write version update back to package.json:', err.message);
    process.exit(1);
}

const publisherName = manifestData.publisher || 'markrobbins';
const extensionName = manifestData.name || 'ce-command-picker';
const vsixFileName = `${extensionName}-${newVersion}.vsix`;
const fullExtensionId = `${publisherName}.${extensionName}`;

// Step 3: Direct CLI Verification Routing
let cliBinary = 'code';
try {
    // Explicitly ask the terminal shell if the 'cursor' binary command responds on the environment PATH
    execSync('cursor --version', { stdio: 'ignore' });
    cliBinary = 'cursor';
} catch (e) {
    try {
        execSync('code --version', { stdio: 'ignore' });
        cliBinary = 'code';
    } catch (err) {
        console.log('⚠️ CLI Warning: Neither "cursor" nor "code" commands found directly on PATH. Defaulting to cursor routing.');
        cliBinary = 'cursor';
    }
}

console.log(`\n🔍 Active system path router target: ${cliBinary.toUpperCase()}`);

// Step 4: Uninstall the old cached extension version to prevent memory locking loops
try {
    console.log(`🧹 Uninstalling current extension profile (${fullExtensionId})...`);
    execSync(`${cliBinary} --uninstall-extension ${fullExtensionId}`, { stdio: 'inherit' });
} catch (e) {
    console.log('💡 Note: Active workspace cache was already clear or extension wasn\'t found.');
}

// Step 5: Run the industrial esbuild compiler engine loop
console.log('\n📦 Compiling modular JS code blocks via esbuild...');
esbuild.build({
    entryPoints: [path.join(__dirname, 'src', 'index.js')],
    bundle: true,
    outfile: path.join(__dirname, 'extension.js'),
    platform: 'node',
    format: 'cjs',
    target: 'node16',
    external: ['vscode'], 
    minify: false,          
    sourcemap: false,
    mainFields: ['module', 'main']
}).then(() => {
    console.log('✓ Scope-safe runtime bundle generated successfully at ./extension.js');

    // Step 6: Package the newly updated code module into the fresh semantic .vsix file
    try {
        console.log(`\n🗜️ Packaging extension into ${vsixFileName}...`);
        execSync('npx vsce package', { stdio: 'inherit' });
        console.log(`✓ Distribution package successfully created.`);
    } catch (err) {
        console.error('❌ Market packaging routine failed completely:', err.message);
        process.exit(1);
    }

    // Step 7: Sideload the fresh compilation archive back into the application environment
    try {
        console.log(`\n💾 Re-installing updated extension version (${newVersion}) into ${cliBinary.toUpperCase()}...`);
        execSync(`${cliBinary} --install-extension "${path.join(__dirname, vsixFileName)}"`, { stdio: 'inherit' });
        
        console.log('\n======================================================');
        console.log('🎉 VERSION BUMP AND AUTOMATION PIPELINE SUCCESSFUL!');
        console.log(`🚀 New Build: ${newVersion}`);
        console.log('💡 Action Required: Run "Developer: Reload Window"');
        console.log('======================================================\n');
    } catch (err) {
        console.error('❌ Installation script target block failed:', err.message);
        process.exit(1);
    }

}).catch((err) => {
    console.error('❌ Build script compilation error cascade popped:', err);
    process.exit(1);
});

// END OF FILE: build.js
