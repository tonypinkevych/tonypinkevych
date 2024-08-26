import { getCollection } from 'astro:content'
import { SITE_URL } from '../consts'

function formatDate(date: Date) {
  return date.toISOString().split('T')[0]
}

export async function GET() {
  const posts = await getCollection('en')
  const ruPosts = await getCollection('ru')
  const publications = await getCollection('publications')

  const pages = [
    '',
    'ru',
    'publications',
    ...posts
      .filter((post) => post.data.published)
      .map((post) => `en/${post.slug}`),
    ...ruPosts
      .filter((post) => post.data.published)
      .map((post) => `ru/${post.slug}`),
    ...publications
      .filter((post) => post.data.published)
      .map((post) => `publications/${post.slug}`),
  ]

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map(
          (page) => `
        <url>
          <loc>${SITE_URL}/${page}</loc>
          <lastmod>${formatDate(new Date())}</lastmod>
        </url>
      `
        )
        .join('')}
    </urlset>
  `.trim()

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
