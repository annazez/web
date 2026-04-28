import { getCollection, type CollectionEntry } from 'astro:content';
import type { LanguageCode } from '../i18n/dictionary';

export type ProjectEntry = CollectionEntry<'projects'>;

/**
 * Get all projects for a specific language, sorted by publication date (newest first).
 */
export async function getProjects(lang: LanguageCode) {
  const projects = await getCollection('projects', ({ data }) => data.lang === lang);
  return projects.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

/**
 * Get featured projects for a specific language, sorted by order and then publication date.
 */
export async function getFeaturedProjects(lang: LanguageCode) {
  const projects = await getCollection(
    'projects',
    ({ data }) => data.lang === lang && data.featured
  );
  return projects.sort((a, b) => {
    const orderA = a.data.order ?? Infinity;
    const orderB = b.data.order ?? Infinity;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    return b.data.publishedAt.getTime() - a.data.publishedAt.getTime();
  });
}

/**
 * Get a single project by its slug and language.
 */
export async function getProjectBySlug(slug: string, lang: LanguageCode) {
  const entries = await getCollection(
    'projects',
    ({ data }) => data.lang === lang && data.slug === slug
  );
  return entries[0];
}

/**
 * Get all projects across all languages.
 */
export async function getAllProjects() {
  return await getCollection('projects');
}

/**
 * Get sets of slugs for the same project across different languages.
 * Used for cross-locale routing.
 */
export async function getAllProjectSlugSets() {
  const allProjects = await getAllProjects();

  const grouped = allProjects.reduce(
    (acc, project) => {
      const { slug, lang } = project.data;
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
