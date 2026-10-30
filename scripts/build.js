import { build } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateAllIcons } from './generate-icons.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

async function run() {
  console.log('🚀 Starting Elemently Build Pipeline...');

  // 1. Generate Icons
  console.log('🎨 Generating branding icons...');
  generateAllIcons(path.join(rootDir, 'public/icons'));

  // 2. Build Sidepanel and Popup (HTML entries)
  console.log('⚡ Building Sidepanel & Popup UI...');
  await build({
    root: rootDir,
    configFile: false,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(rootDir, 'src'),
      },
    },
    build: {
      outDir: distDir,
      emptyOutDir: true,
      rollupOptions: {
        input: {
          sidepanel: path.resolve(rootDir, 'src/sidepanel/index.html'),
          popup: path.resolve(rootDir, 'src/popup/index.html'),
        },
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
    },
  });

  // 3. Build Content Script as self-contained IIFE
  console.log('📄 Building Content Script (IIFE)...');
  await build({
    root: rootDir,
    configFile: false,
    build: {
      outDir: distDir,
      emptyOutDir: false,
      lib: {
        entry: path.resolve(rootDir, 'src/content/index.ts'),
        name: 'ElementlyContent',
        formats: ['iife'],
        fileName: () => 'content.js',
      },
      rollupOptions: {
        output: {
          extend: true,
        },
      },
    },
  });

  // 4. Build Background Service Worker
  console.log('⚙️ Building Background Service Worker (ESM)...');
  await build({
    root: rootDir,
    configFile: false,
    build: {
      outDir: distDir,
      emptyOutDir: false,
      lib: {
        entry: path.resolve(rootDir, 'src/background/index.ts'),
        formats: ['es'],
        fileName: () => 'background.js',
      },
      rollupOptions: {
        output: {
          extend: true,
        },
      },
    },
  });

  // 5. Copy Icons to dist
  console.log('📦 Copying icons to dist...');
  const distIconsDir = path.join(distDir, 'icons');
  if (!fs.existsSync(distIconsDir)) {
    fs.mkdirSync(distIconsDir, { recursive: true });
  }
  const publicIconsDir = path.join(rootDir, 'public/icons');
  for (const file of fs.readdirSync(publicIconsDir)) {
    fs.copyFileSync(path.join(publicIconsDir, file), path.join(distIconsDir, file));
  }

  // 6. Copy and format manifest.json
  console.log('📋 Generating Manifest V3...');
  const manifest = {
    manifest_version: 3,
    name: 'Elemently – Web Design Inspector & Developer Toolkit',
    short_name: 'Elemently',
    version: '1.0.0',
    description: 'Explore Every Element. Professional Web Design Inspector, CSS & Typography Analyzer, Accessibility Checker & DevTools for Chrome.',
    icons: {
      16: 'icons/icon16.png',
      32: 'icons/icon32.png',
      48: 'icons/icon48.png',
      128: 'icons/icon128.png',
    },
    action: {
      default_title: 'Elemently – Explore Every Element',
      default_icon: {
        16: 'icons/icon16.png',
        32: 'icons/icon32.png',
        48: 'icons/icon48.png',
        128: 'icons/icon128.png',
      },
      default_popup: 'src/popup/index.html',
    },
    side_panel: {
      default_path: 'src/sidepanel/index.html',
    },
    background: {
      service_worker: 'background.js',
      type: 'module',
    },
    permissions: [
      'sidePanel',
      'storage',
      'activeTab',
      'scripting',
      'tabs',
    ],
    content_scripts: [
      {
        matches: ['<all_urls>'],
        js: ['content.js'],
        run_at: 'document_idle',
      },
    ],
    web_accessible_resources: [
      {
        resources: ['icons/*', 'assets/*'],
        matches: ['<all_urls>'],
      },
    ],
  };

  fs.writeFileSync(path.join(distDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');

  // Copy manifest to root public as well
  fs.writeFileSync(path.join(rootDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf-8');

  console.log('✅ Elemently Build Complete! Output in ./dist');
}

run().catch((err) => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});

