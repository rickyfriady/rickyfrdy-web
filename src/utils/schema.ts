import type { CollectionEntry } from 'astro:content'
import type { Project } from '@/models'

const AUTHOR = {
  '@type': 'Person',
  name: 'Ricki Friadi',
  url: 'https://rickyfrdy.my.id',
  sameAs: ['https://github.com/rickyfriady', 'https://www.linkedin.com/in/rickifriadi']
}

export function blogPostingSchema(
  post: CollectionEntry<'blog'>,
  canonicalUrl: string,
  ogImageUrl: string
): Record<string, unknown> {
  return {
    '@type': 'BlogPosting',
    headline: post.data.title,
    description: post.data.description,
    author: AUTHOR,
    datePublished: post.data.pubDate.toISOString(),
    ...(post.data.updatedDate ? { dateModified: post.data.updatedDate.toISOString() } : {}),
    url: canonicalUrl,
    image: ogImageUrl,
    keywords: post.data.tags.join(', '),
    inLanguage: 'en',
    isPartOf: { '@type': 'WebSite', name: 'Ricki Friadi', url: 'https://rickyfrdy.my.id' }
  }
}

export function creativeWorkSchema(
  project: Project,
  canonicalUrl: string,
  ogImageUrl: string
): Record<string, unknown> {
  return {
    '@type': 'CreativeWork',
    name: project.title,
    description: project.shortDescription,
    url: canonicalUrl,
    image: ogImageUrl,
    keywords: project.technologies.join(', '),
    creator: AUTHOR,
    dateCreated: project.date
  }
}

export function webPageSchema(
  title: string,
  description: string,
  canonicalUrl: string
): Record<string, unknown> {
  return {
    '@type': 'WebPage',
    name: title,
    description,
    url: canonicalUrl,
    isPartOf: { '@type': 'WebSite', name: 'Ricki Friadi', url: 'https://rickyfrdy.my.id' },
    author: AUTHOR
  }
}
