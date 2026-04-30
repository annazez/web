import { getCollection, type CollectionEntry } from 'astro:content';
import type { LanguageCode } from '../i18n/dictionary';

export type BlogEntry = CollectionEntry<'blog'>;

/**
 * Get all blog posts for a specific language, sorted by publication date (newest first).
 */
export async function getBlogPosts(lang: LanguageCode) {
  const posts = await getCollection('blog', ({ data }) => data.lang === lang);
  return posts.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

/**
 * Get a single blog post by its slug and language.
 */
export async function getBlogPostBySlug(slug: string, lang: LanguageCode) {
  const entries = await getCollection(
    'blog',
    ({ data }) => data.lang === lang && data.slug === slug
  );
  return entries[0];
}

/**
 * Get all blog posts across all languages.
 */
export async function getAllBlogPosts() {
  return await getCollection('blog');
}

/**
 * Get sets of slugs for the same blog post across different languages.
 * Used for cross-locale routing.
 */
export async function getAllBlogPostSlugSets() {
  const allPosts = await getAllBlogPosts();

  const grouped = allPosts.reduce(
    (acc, post) => {
      const { slug, lang } = post.data;
      if (!acc[slug]) {
        acc[slug] = { en: slug, cs: slug };
      }
      acc[slug][lang as LanguageCode] = slug;
      return acc;
    },
    {} as Record<string, Record<LanguageCode, string>>
  );

  return Object.values(grouped);
}
