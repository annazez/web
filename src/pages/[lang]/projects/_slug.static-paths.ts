import { getCollection } from 'astro:content';
import { supportedLangs, type LanguageCode } from '../../../i18n/dictionary.ts';

export async function getStaticPaths() {
  const paths: Array<{ params: { lang: LanguageCode; slug: string } }> = [];

  const allProjects = await getCollection('projects');

  for (const project of allProjects) {
    if (supportedLangs.includes(project.data.lang as LanguageCode)) {
      paths.push({ params: { lang: project.data.lang as LanguageCode, slug: project.data.slug } });
    }
  }

  return paths;
}
