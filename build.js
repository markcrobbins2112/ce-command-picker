// START OF FILE: build.js
const esbuild = require('esbuild');
const path = require('path');

console.log('🚀 Initializing CE Command Picker compilation pipeline via esbuild...\n');

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
    // 🌟 FIX FOR JSONC-PARSER: Forces nested dynamic assets directly into the CJS bundle footprint
    mainFields: ['module', 'main']
}).then(() => {
    console.log('🎉 Compilation finished successfully!');
    console.log('📝 Unified, scope-safe runtime output assembled at: ./extension.js\n');
}).catch((err) => {
    console.error('❌ Build script compilation error cascade popped:', err);
    process.exit(1);
});
// END OF FILE: build.js
