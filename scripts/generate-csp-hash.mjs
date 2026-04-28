import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = join(fileURLToPath(import.meta.url), '..');

/**
 * Computes the SHA-256 hash of a file's content.
 *
 * @param {string} filePath - Absolute path to the file.
 * @returns {string} - The base64-encoded hash.
 */
export function computeHash(filePath) {
  const content = readFileSync(filePath, 'utf8');
  return createHash('sha256').update(content).digest('base64');
}

// If run directly, print the hash for the theme bootstrap script.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const bootstrapPath = join(__dirname, '../src/scripts/theme-bootstrap.txt');
  console.log(computeHash(bootstrapPath));
}
