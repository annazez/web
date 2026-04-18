/* eslint-disable @typescript-eslint/no-explicit-any */
import test from 'node:test';
import assert from 'node:assert';
import { mock } from 'node:test';

// Data setup
let mockProjects: any[] = [
  {
    data: {
      slug: 'project-en',
      lang: 'en',
    },
  },
  {
    data: {
      slug: 'project-cs',
      lang: 'cs',
    },
  },
  {
    data: {
      slug: 'project-invalid',
      lang: 'fr', // Unsupported language
    },
  },
];

mock.module('astro:content', {
  namedExports: {
    getCollection: async (collection: string) => {
      if (collection === 'projects') {
        return mockProjects;
      }
      return [];
    },
  },
});

// Now we can safely import our handler since the mocks are already established
const { getStaticPaths } = await import('../../../../../src/pages/[lang]/projects/_slug.static-paths.ts');

test('projects/[slug] getStaticPaths', async t => {
  await t.test('should return paths for supported languages only', async () => {
    const paths = await getStaticPaths();

    // Fr (french) should be filtered out
    assert.strictEqual(paths.length, 2);

    assert.deepStrictEqual(paths[0], { params: { lang: 'en', slug: 'project-en' } });
    assert.deepStrictEqual(paths[1], { params: { lang: 'cs', slug: 'project-cs' } });
  });

  await t.test('should handle empty collection', async () => {
    const originalMockProjects = mockProjects;
    mockProjects = [];
    try {
      const paths = await getStaticPaths();
      assert.strictEqual(paths.length, 0);
    } finally {
      mockProjects = originalMockProjects;
    }
  });
});
