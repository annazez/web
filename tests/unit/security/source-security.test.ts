import assert from 'node:assert';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { describe, it } from 'node:test';

const SRC_ROOT = join(process.cwd(), 'src');
const SOURCE_EXTS = new Set(['.astro', '.ts', '.tsx', '.js', '.jsx', '.md', '.mdx']);

function walkFiles(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const info = statSync(fullPath);

    if (info.isDirectory()) {
      files.push(...walkFiles(fullPath));
      continue;
    }

    if (SOURCE_EXTS.has(extname(fullPath))) {
      files.push(fullPath);
    }
  }

  return files;
}

function getTargetBlankAnchorTag(line: string): string | null {
  const match = line.match(/<a\s+[^>]*target="_blank"[^>]*>/i);
  return match ? match[0] : null;
}

describe('source security constraints', () => {
  const files = walkFiles(SRC_ROOT);

  it('does not use set:html in source files', () => {
    const offenders: string[] = [];

    for (const file of files) {
      if (file.endsWith('PerformanceDashboard.astro') || file.endsWith('Layout.astro')) {
        continue;
      }
      const text = readFileSync(file, 'utf8');
      if (text.includes('set:html=')) {
        offenders.push(file);
      }
    }

    assert.deepStrictEqual(
      offenders,
      [],
      `set:html is forbidden. Found in: ${offenders.join(', ')}`
    );
  });

  it('requires noopener and noreferrer on target=_blank anchors', () => {
    const offenders: string[] = [];

    for (const file of files) {
      const lines = readFileSync(file, 'utf8').split('\n');
      for (let i = 0; i < lines.length; i += 1) {
        const anchor = getTargetBlankAnchorTag(lines[i]);
        if (!anchor) {
          continue;
        }

        const relMatch = anchor.match(/rel="([^"]*)"/i);
        const relValue = relMatch?.[1] ?? '';
        const hasNoopener = /(^|\s)noopener(\s|$)/.test(relValue);
        const hasNoreferrer = /(^|\s)noreferrer(\s|$)/.test(relValue);

        if (!hasNoopener || !hasNoreferrer) {
          offenders.push(`${file}:${i + 1}`);
        }
      }
    }

    assert.deepStrictEqual(
      offenders,
      [],
      `target=_blank links must include rel=\"noopener noreferrer\". Found in: ${offenders.join(', ')}`
    );
  });
});
