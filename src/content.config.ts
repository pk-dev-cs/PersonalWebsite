import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(200),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    example: z.boolean().default(false),
  }).refine((data) => !data.updatedDate || data.updatedDate >= data.pubDate, {
    message: 'updatedDate cannot be earlier than pubDate',
    path: ['updatedDate'],
  }),
});

export const collections = { blog };
