import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts'

export async function GET(context) {
  const en = await getCollection('en')
  const ru = await getCollection('ru')
  const ua = await getCollection('ua')
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: [...en, ...ru, ...ua].map((post) => ({
      ...post.data,
      link: `/blog/${post.slug}/`,
    })),
  })
}
