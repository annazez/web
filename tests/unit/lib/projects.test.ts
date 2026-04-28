import test, { mock } from 'node:test';
import assert from 'node:assert';

// Mock data
const mockProjects = [
  {
    data: {
      lang: 'en',
      featured: true,
      order: 2,
      publishedAt: new Date('2026-01-01'),
      title: 'Project 2',
    },
  },
  {
    data: {
      lang: 'en',
      featured: true,
      order: 1,
      publishedAt: new Date('2026-01-01'),
      title: 'Project 1',
    },
  },
  {
    data: {
      lang: 'en',
      featured: true,
      order: 1,
      publishedAt: new Date('2026-02-01'),
      title: 'Project 1 New',
    },
  },
  {
    data: {
      lang: 'en',
      featured: false,
      publishedAt: new Date('2026-03-01'),
      title: 'Not Featured',
    },
  },
];

// Mock astro:content BEFORE importing our library
mock.module('astro:content', {
  namedExports: {
    getCollection: async (
      _collection: string,
      filter?: (entry: (typeof mockProjects)[0]) => boolean
    ) => {
      if (filter) {
        return mockProjects.filter(filter);
      }
      return mockProjects;
    },
  },
});

// Now import the library
const { getFeaturedProjects } = await import('../../../src/lib/projects.ts');

test('getFeaturedProjects sorting logic', async () => {
  const featured = await getFeaturedProjects('en');

  assert.strictEqual(
    featured.length,
    3,
    'Should only return featured projects for the correct language'
  );

  // Expected order:
  // 1. Project 1 New (order: 1, publishedAt: Feb 1)
  // 2. Project 1 (order: 1, publishedAt: Jan 1)
  // 3. Project 2 (order: 2, publishedAt: Jan 1)

  assert.strictEqual(featured[0].data.title, 'Project 1 New');
  assert.strictEqual(featured[1].data.title, 'Project 1');
  assert.strictEqual(featured[2].data.title, 'Project 2');
});
