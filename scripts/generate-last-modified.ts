import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

/* eslint-disable no-console */

/**
 * Option B — Site-wide last-content-modified.
 *
 * This script finds the most recent git commit date across all content-driving files
 * (MDX projects and i18n locales) and writes it to a JSON file for the Footer to consume.
 */

const DATA_DIR = join(process.cwd(), 'src/data');
const OUTPUT_FILE = join(DATA_DIR, 'site-modified.json');

function getLastModified() {
  try {
    // Find most recent commit date for relevant content files
    // --format=%cI provides the committer date in ISO 8601 format
    const result = execSync(
      'git log -1 --format=%cI -- src/content/**/*.mdx src/i18n/locales/*.ts',
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    ).trim();

    if (result) {
      return result;
    }
  } catch {
    console.warn(
      'Warning: Failed to get last modified date from git (possibly shallow clone or no git). Falling back to current time.'
    );
  }

  return new Date().toISOString();
}

const lastModified = getLastModified();

try {
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(OUTPUT_FILE, JSON.stringify({ lastModified }, null, 2));
  console.log(`Last modified date: ${lastModified}`);
} catch (error) {
  console.error('Error writing last modified file:', error);
  process.exit(1);
}
