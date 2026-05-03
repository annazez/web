import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';
import { languages } from './i18n/dictionary';

const langKeys = Object.keys(languages) as [string, ...string[]];

const externalUrl = z.url({ message: 'Must be a valid URL' });

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './src/content/projects',
    generateId: ({ data, entry }) => {
      const slug = typeof data.slug === 'string' ? data.slug : entry.replace(/\.mdx$/, '');
      const lang = typeof data.lang === 'string' ? data.lang : 'en';

      return `${slug}-${lang}`;
    },
  }),
  schema: z
    .object({
      title: z.string().min(1),
      slug: z.string().min(1),
      lang: z.enum(langKeys),
      summary: z.string().min(1),
      homeDescription: z.string().optional(),
      featured: z.boolean().default(false),
      order: z.number().optional(),
      publishedAt: z.date(),
      tags: z.array(z.string().min(1)).min(1),
      website: externalUrl.optional(),
      repo: externalUrl.optional(),
      ogImage: z.string().optional(),
    })
    .strict(),
});

const blog = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './src/content/blog',
    generateId: ({ data, entry }) => {
      const slug = typeof data.slug === 'string' ? data.slug : entry.replace(/\.mdx$/, '');
      const lang = typeof data.lang === 'string' ? data.lang : 'en';

      return `${slug}-${lang}`;
    },
  }),
  schema: z
    .object({
      title: z.string().min(1),
      slug: z.string().min(1),
      lang: z.enum(langKeys),
      summary: z.string().min(1),
      publishedAt: z.date(),
      tags: z.array(z.string().min(1)).min(1).optional(),
      ogImage: z.string().optional(),
    })
    .strict(),
});

const translations = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/translations' }),
  schema: z.object({
    'role.title': z.string().min(1),
    'hero.manifesto': z.string().min(1),
    'home.contactLabel': z.string().min(1),
    'home.contactTitle': z.string().min(1),
    'home.contact': z.string().min(1),
    'home.contactCta': z.string().min(1),
    'home.social.signal': z.string().min(1),
    'home.social.keyoxide': z.string().min(1),
    'site.name': z.string().min(1),
    'footer.lastUpdated': z.string().min(1),
    'footer.navigation': z.string().min(1),
    'footer.siteQuality': z.string().min(1),
    'footer.sourceCode': z.string().min(1),
    'footer.humansTxt': z.string().min(1),
    'footer.pgpPublicKey': z.string().min(1),
    'hero.minimalByDesign': z.string().min(1),
    'projects.title': z.string().min(1),
    'projects.subtitle': z.string().min(1),
    'projects.more': z.string().min(1),
    'projects.visit': z.string().min(1),
    'projects.source': z.string().min(1),
    'projects.carousel.previous': z.string().min(1),
    'projects.carousel.next': z.string().min(1),
    'projects.carousel.slide': z.string().min(1),
    readCaseStudy: z.string().min(1),
    back: z.string().min(1),
    feedTitle: z.string().min(1),
    feedDescription: z.string().min(1),
    'layout.skipToMain': z.string().min(1),
    'ui.themeToggle': z.string().min(1),
    'ui.themeLight': z.string().min(1),
    'ui.themeDark': z.string().min(1),
    'ui.themeSystem': z.string().min(1),
    'ui.mobileNavigationLabel': z.string().min(1),
    'ui.languageNavigation': z.string().min(1),
    'index.chooseLanguage': z.string().min(1),
    '404.title': z.string().min(1),
    '404.message': z.string().min(1),
    '404.languagePrompt': z.string().min(1),
    'print.banner': z.string().min(1),
    'seo.home': z.string().min(1),
    'seo.quality': z.string().min(1),
    'seo.404': z.string().min(1),
    'quality.title': z.string().min(1),
    'quality.summary': z.string().min(1),
    'quality.details': z.string().min(1),
    'footer.carbonFootprint': z.string().min(1),
    'footer.loading': z.string().min(1),
    '404.return': z.string().min(1),
    'og.imageAlt': z.string().min(1),
    'quality.performance': z.string().min(1),
    'quality.accessibility': z.string().min(1),
    'quality.bestPractices': z.string().min(1),
    'quality.seo': z.string().min(1),
    'quality.path': z.string().min(1),
    'quality.url': z.string().min(1),
    'quality.measured': z.string().min(1),
    'quality.runs': z.string().min(1),
    'quality.noSnapshot': z.string().min(1),
    'quality.noResults': z.string().min(1),
    'quality.na': z.string().min(1),
    'quality.metrics.lcp': z.string().min(1),
    'quality.metrics.tbt': z.string().min(1),
    'quality.metrics.cls': z.string().min(1),
    'quality.metrics.fcp': z.string().min(1),
    'quality.metrics.ttfb': z.string().min(1),
    'quality.filterLabel': z.string().min(1),
    'palette.title': z.string().min(1),
    'palette.archMode': z.string().min(1),
    'palette.auditMode': z.string().min(1),
    'palette.layersMode': z.string().min(1),
    'palette.printMode': z.string().min(1),
    'palette.home': z.string().min(1),
    'palette.close': z.string().min(1),
    'palette.openHint': z.string().min(1),
    'uses.title': z.string().min(1),
    'uses.subtitle': z.string().min(1),
    'seo.uses': z.string().min(1),
    'footer.uses': z.string().min(1),
    'uses.cat.hardware': z.string().min(1),
    'uses.cat.os': z.string().min(1),
    'uses.cat.editor': z.string().min(1),
    'uses.cat.terminal': z.string().min(1),
    'uses.cat.browser': z.string().min(1),
    'uses.cat.languages': z.string().min(1),
    'uses.cat.infra': z.string().min(1),
    'blog.title': z.string().min(1),
    'blog.subtitle': z.string().min(1),
    'blog.more': z.string().min(1),
    'blog.empty': z.string().min(1),
    'competences.title': z.string().min(1),
    'seo.competences': z.string().min(1),
    'competences.subtitle': z.string().min(1),
    'competences.more': z.string().min(1),
    'lab.title': z.string().min(1),
    'lab.subtitle': z.string().min(1),
    'seo.lab': z.string().min(1),
  }),
});

const competences = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/competences' }),
  schema: z.object({
    title: z.string(),
    desc: z.string(),
    icon: z.string(),
    order: z.number(),
    links: z
      .array(
        z.object({
          title: z.string(),
          subtitle: z.string(),
          url: z.string(),
          image: z.string().optional(),
          imageAlt: z.string().optional(),
        })
      )
      .optional(),
  }),
});

export const collections = {
  projects,
  blog,
  translations,
  competences,
};
