import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';
import { languages } from './i18n/dictionary';

const langKeys = Object.keys(languages) as [string, ...string[]];

const workspaceItemSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().min(1),
    link: z.url().optional(),
  })
  .strict();

const workspaceCategorySchema = z
  .object({
    category: z.enum(['Hardware', 'Editor', 'Software']),
    label: z.string().min(1),
    items: z.array(workspaceItemSchema).min(1),
  })
  .strict();

const workspace = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/workspace' }),
  schema: z
    .object({
      lang: z.enum(langKeys),
      title: z.string().min(1),
      intro: z.string().min(1),
      categories: z.array(workspaceCategorySchema).min(1),
    })
    .strict(),
});

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
      publishedAt: z.date(),
      tags: z.array(z.string().min(1)).min(1),
    })
    .strict(),
});

export const collections = {
  workspace,
  projects,
};
