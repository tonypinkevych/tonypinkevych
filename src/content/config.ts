import { defineCollection, z } from 'astro:content'

const postSchema = z.object({
  type: z.enum(['post']),
  title: z.string(),
  description: z.string(),
  published: z.boolean(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
})

const redirectSchema = z.object({
  type: z.enum(['redirect']),
  title: z.string(),
  description: z.string(),
  published: z.boolean(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  url: z.string(),
})

const schema = z.union([postSchema, redirectSchema])

const en = defineCollection({
  type: 'content',
  schema,
})

const ru = defineCollection({
  type: 'content',
  schema,
})

const ua = defineCollection({
  type: 'content',
  schema,
})

export const collections = { en, ru, ua }
