import type { CollectionEntry } from 'astro:content'
import { getCollection } from 'astro:content'
import type { APIRoute, GetStaticPaths } from 'astro'
import { renderBlogOgCard } from '@/utils/ogCard'
import { readingTime } from '@/utils/readingTime'

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = ((await getCollection('blog')) as CollectionEntry<'blog'>[]).filter(
    (entry) => !entry.data.draft
  )
  return posts.map((post: CollectionEntry<'blog'>) => ({
    params: { slug: post.id },
    props: { post }
  }))
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as {
    post: CollectionEntry<'blog'>
  }
  const png = await renderBlogOgCard({
    title: post.data.title,
    description: post.data.description,
    tags: post.data.tags,
    pubDate: post.data.pubDate,
    readingTime: readingTime(post.body ?? '')
  })
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' }
  })
}
