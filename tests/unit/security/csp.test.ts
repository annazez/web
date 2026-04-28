import test from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const ROOT_DIR = process.cwd();

test('CSP consistency and integrity', async t => {
  const bootstrapPath = join(ROOT_DIR, 'src/scripts/theme-bootstrap.txt');
  const headersPath = join(ROOT_DIR, 'public/_headers');
  const cspDataPath = join(ROOT_DIR, 'src/data/csp.ts');

  const bootstrapContent = readFileSync(bootstrapPath, 'utf8');
  const expectedHash = createHash('sha256').update(bootstrapContent).digest('base64');

  await t.test('hash matches theme-bootstrap.txt content', () => {
    const cspTsContent = readFileSync(cspDataPath, 'utf8');
    const match = cspTsContent.match(/THEME_BOOTSTRAP_HASH = '(.*?)'/);
    assert.ok(match, 'Could not find THEME_BOOTSTRAP_HASH in src/data/csp.ts');
    assert.strictEqual(
      match[1],
      expectedHash,
      'Hash in src/data/csp.ts does not match bootstrap script content'
    );
  });

  await t.test('script-src is identical across all outputs', () => {
    const headersContent = readFileSync(headersPath, 'utf8');
    const cspTsContent = readFileSync(cspDataPath, 'utf8');

    const headersCspMatch = headersContent.match(/Content-Security-Policy: (.*?)$/m);
    const tsCspMatch = cspTsContent.match(/SITE_CSP = "(.*?)"/);

    assert.ok(headersCspMatch, 'Could not find CSP in public/_headers');
    assert.ok(tsCspMatch, 'Could not find SITE_CSP in src/data/csp.ts');

    const headersCsp = headersCspMatch[1];
    const tsCsp = tsCspMatch[1];

    assert.strictEqual(
      headersCsp,
      tsCsp,
      'CSP strings in public/_headers and src/data/csp.ts are not identical'
    );

    const scriptSrcRegex = /script-src (.*?);/;
    const headersScriptSrc = headersCsp.match(scriptSrcRegex)?.[1];
    const tsScriptSrc = tsCsp.match(scriptSrcRegex)?.[1];

    assert.ok(headersScriptSrc, 'Could not find script-src in _headers CSP');
    assert.strictEqual(
      headersScriptSrc,
      tsScriptSrc,
      'script-src differs between _headers and csp.ts'
    );
    assert.ok(
      headersScriptSrc.includes(expectedHash),
      `script-src does not contain the expected hash: ${expectedHash}`
    );
  });
});
