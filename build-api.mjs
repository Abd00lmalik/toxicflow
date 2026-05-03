/**
 * Pre-compiles api-src/**\/*.ts → api/**\/*.js with viem bundled inline.
 * Run: node build-api.mjs
 *
 * Vercel serves the compiled .js files as serverless functions without
 * needing to compile TypeScript — avoiding pnpm hoisting / esbuild-viem issues.
 */
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resolve esbuild from the pnpm virtual store
const require = createRequire(import.meta.url);
let build;
try {
  ({ build } = require('./node_modules/.pnpm/esbuild@0.27.3/node_modules/esbuild/lib/main.js'));
} catch {
  // Fallback: try direct require
  ({ build } = require('esbuild'));
}

// Find all .ts files in api-src/
const apiSrcDir = path.join(__dirname, 'api-src');
const apiOutDir = path.join(__dirname, 'api');

function findTs(dir, base = '') {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      results.push(...findTs(path.join(dir, entry.name), rel));
    } else if (entry.name.endsWith('.ts')) {
      results.push({ abs: path.join(dir, entry.name), rel });
    }
  }
  return results;
}

const entries = findTs(apiSrcDir);
if (!entries.length) {
  console.error('No .ts files found in api-src/');
  process.exit(1);
}

console.log(`Compiling ${entries.length} functions...`);

for (const { abs, rel } of entries) {
  const outPath = path.join(apiOutDir, rel.replace(/\.ts$/, '.js'));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  await build({
    entryPoints: [abs],
    bundle: true,
    platform: 'node',
    target: 'node18',
    format: 'cjs',
    outfile: outPath,
    external: [],
    minify: false,
    sourcemap: false,
    define: {},
  });
  console.log(`  ✓ ${rel} → ${path.relative(__dirname, outPath)}`);
}

console.log('API build complete.');
