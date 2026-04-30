import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';
import { languages } from './i18n/dictionary';

const langKeys = Object.keys(languages) as [string, ...string[]];

const externalUrl = z
  .string()
  .min(1)
  .refine(value => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }, 'Must be a valid URL');

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

const adrs = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './src/content/adrs',
  }),
  schema: z
    .object({
      id: z.string().min(1),
      project: z.string().min(1),
      title: z.string().min(1),
      lang: z.enum(langKeys),
      context: z.string().min(1),
      decision: z.string().min(1),
      consequences: z.string().min(1),
      tags: z.array(z.string().min(1)).min(1),
      decidedAt: z.date(),
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

export const collections = {
  projects,
  adrs,
  blog,
};
