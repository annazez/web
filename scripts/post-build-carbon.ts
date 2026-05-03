import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

/**
 * Sustainable Web Design model v4 constants
 */
const DATA_CENTRE_KWH_PER_GB = 0.055;
const NETWORKS_KWH_PER_GB = 0.059;
const DEVICES_KWH_PER_GB = 0.08;
const GRID_G_CO2E_PER_KWH = 494;

const TOTAL_KWH_PER_GB = DATA_CENTRE_KWH_PER_GB + NETWORKS_KWH_PER_GB + DEVICES_KWH_PER_GB;
const G_CO2E_PER_GB = TOTAL_KWH_PER_GB * GRID_G_CO2E_PER_KWH;
const G_CO2E_PER_BYTE = G_CO2E_PER_GB / (1024 * 1024 * 1024);

function getFilesize(filePath: string): number {
  try {
    return fs.statSync(filePath).size;
  } catch {
    return 0;
  }
}

function processHtmlFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Marker for carbon footprint
  const marker = 'id="carbon-footprint-value"';
  if (!content.includes(marker)) return;

  console.log(`Processing ${filePath}...`);

  // Calculate size of HTML itself
  let totalBytes = getFilesize(filePath);

  // Simple heuristic: find linked assets in the same dist dir
  // This is an approximation of what the browser would download
  const assetRegex = /(?:src|href)="([^"]+?\.(?:js|css|png|jpg|jpeg|svg|webp|ico|woff2?))"/g;
  let match;
  const processedAssets = new Set<string>();

  while ((match = assetRegex.exec(content)) !== null) {
    const assetPath = match[1];
    if (assetPath.startsWith('http') || assetPath.startsWith('//')) continue;

    // Normalize path
    const absoluteAssetPath = path.resolve(
      path.dirname(filePath),
      assetPath.startsWith('/') ? path.join(distDir, assetPath) : assetPath
    );

    if (absoluteAssetPath.startsWith(distDir) && !processedAssets.has(absoluteAssetPath)) {
      totalBytes += getFilesize(absoluteAssetPath);
      processedAssets.add(absoluteAssetPath);
    }
  }

  const gramsCo2 = totalBytes * G_CO2E_PER_BYTE;
  const formatted =
    gramsCo2 >= 0.01 ? `${gramsCo2.toFixed(2)} g CO₂e` : `${gramsCo2.toFixed(4)} g CO₂e`;

  // Replace the loading/placeholder content
  const regex = /<span id="carbon-footprint-value"[^>]*>.*?<\/span>/;
  content = content.replace(regex, `<span id="carbon-footprint-value">${formatted}</span>`);

  fs.writeFileSync(filePath, content);
}

function walkDir(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith('.html')) {
      processHtmlFile(fullPath);
    }
  }
}

console.log('Calculating carbon footprint for static pages...');
if (fs.existsSync(distDir)) {
  walkDir(distDir);
  console.log('Carbon footprint injection complete.');
} else {
  console.error('dist directory not found. Run build first.');
}
