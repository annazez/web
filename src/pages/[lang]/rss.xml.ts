import type { APIContext } from 'astro';
import rss from '@astrojs/rss';
import { SITE_URL } from '../../config';
import { useTranslations } from '../../i18n/utils';
import { getValidLanguageCode, supportedLangs } from '../../i18n/dictionary';
import { getProjects } from '../../lib/projects';

export function getStaticPaths() {
  return supportedLangs.map(lang => ({ params: { lang } }));
}

export async function GET(context: APIContext) {
  const currentLang = getValidLanguageCode(context.params.lang as string);
  const t = useTranslations(currentLang);
  const site = context.site ?? SITE_URL;

  const sortedProjects = await getProjects(currentLang);

  return rss({
    title: t('feedTitle'),
    description: t('feedDescription'),
    site,
    items: sortedProjects.map(project => ({
      title: project.data.title,
      description: project.data.summary,
      pubDate: project.data.publishedAt,
      link: new URL(`/${currentLang}/projects/${project.data.slug}/`, site).toString(),
    })),
  });
}
