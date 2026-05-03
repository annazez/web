import assert from 'node:assert';
import { describe, it } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../../../');

const en = JSON.parse(
  fs.readFileSync(path.join(projectRoot, 'src/content/translations/en.json'), 'utf8')
);
const cs = JSON.parse(
  fs.readFileSync(path.join(projectRoot, 'src/content/translations/cs.json'), 'utf8')
);

describe('locales', () => {
  describe('English translations', () => {
    it('should have all required translation keys', () => {
      assert.ok(en['role.title']);
      assert.ok(en['hero.manifesto']);
      assert.ok(en['hero.minimalByDesign']);
      assert.ok(en['projects.title']);
      assert.ok(en['projects.visit']);
      assert.ok(en['projects.source']);
      assert.ok(en['seo.home']);
      assert.ok(en['footer.carbonFootprint']);
    });

    it('should have non-empty values for all keys', () => {
      for (const [key, value] of Object.entries(en)) {
        assert.ok(
          typeof value === 'string' && value.trim().length > 0,
          `Empty translation for key "${key}" in English`
        );
      }
    });
  });

  describe('Czech translations', () => {
    it('should have all required translation keys matching English', () => {
      const enKeys = Object.keys(en);
      const csKeys = Object.keys(cs);

      for (const key of enKeys) {
        assert.ok(csKeys.includes(key), `Missing key "${key}" in Czech translations`);
      }
    });

    it('should have non-empty values for all keys', () => {
      for (const [key, value] of Object.entries(cs)) {
        assert.ok(
          typeof value === 'string' && value.trim().length > 0,
          `Empty translation for key "${key}" in Czech`
        );
      }
    });

    it('should have Czech-specific content (not just English copies)', () => {
      // These should differ between languages
      assert.notStrictEqual(en['role.title'], cs['role.title'], 'Role title should be translated');
      assert.notStrictEqual(en['seo.home'], cs['seo.home'], 'Home SEO title should be translated');
    });
  });

  describe('Translation consistency', () => {
    it('should have matching keys count', () => {
      assert.strictEqual(
        Object.keys(en).length,
        Object.keys(cs).length,
        'English and Czech should have same number of keys'
      );
    });

    it('should have consistent interpolation placeholders', () => {
      const getPlaceholders = (value: string) => value.match(/\{[^}]+\}/g)?.sort() ?? [];

      for (const [key, enValue] of Object.entries(en)) {
        const csValue = cs[key];
        if (typeof enValue === 'string' && typeof csValue === 'string') {
          const enPlaceholders = getPlaceholders(enValue);
          const csPlaceholders = getPlaceholders(csValue);
          if (enPlaceholders.length || csPlaceholders.length) {
            assert.deepStrictEqual(
              csPlaceholders,
              enPlaceholders,
              `Placeholder mismatch for "${key}"`
            );
          }
        }
      }
    });
  });
});
