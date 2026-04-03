import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_URL } from '../../config';
import { useTranslations } from '../../i18n/utils';

const lang = 'en' as const;

export async function GET(context: APIContext) {
  const t = useTranslations(lang);
  const site = context.site ?? SITE_URL;

  const projects = await getCollection('projects', ({ data }) => data.lang === lang);
  const sortedProjects = projects.sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
  );

  return rss({
    title: t('feedTitle'),
    description: t('feedDescription'),
    site,
    items: sortedProjects.map(project => ({
      title: project.data.title,
      description: project.data.summary,
      pubDate: project.data.publishedAt,
      link: new URL(`/en/projects/${project.data.slug}/`, site).toString(),
    })),
  });
}
