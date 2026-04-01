/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';

const distAssetsDir = path.resolve('dist/assets');
const maxBytes = 220 * 1024;

function collectFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return collectFiles(fullPath);
    return [fullPath];
  });
}

if (!fs.existsSync(distAssetsDir)) {
  console.error('Missing dist/assets. Run npm run build before size:check.');
  process.exit(1);
}

const jsAndCssFiles = collectFiles(distAssetsDir).filter(file => /\.(js|css)$/.test(file));
const totalBytes = jsAndCssFiles.reduce((sum, file) => sum + fs.statSync(file).size, 0);

console.log(`Bundle size (JS+CSS): ${(totalBytes / 1024).toFixed(2)} KiB`);
console.log(`Budget: ${(maxBytes / 1024).toFixed(2)} KiB`);

if (totalBytes > maxBytes) {
  console.error('Bundle size budget exceeded.');
  process.exit(1);
}

console.log('Bundle size is within budget.');
