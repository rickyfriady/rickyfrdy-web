import type { APIRoute, GetStaticPaths } from 'astro'
import { projects } from '@/data/projects'
import type { Project } from '@/models'
import { renderProjectOgCard } from '@/utils/ogCard'

export const getStaticPaths: GetStaticPaths = () => {
  return projects.map((project) => ({
    params: { slug: project.slug },
    props: { project }
  }))
}

export const GET: APIRoute = async ({ props }) => {
  const { project } = props as { project: Project }
  const png = await renderProjectOgCard({
    title: project.title,
    shortDescription: project.shortDescription,
    technologies: project.technologies,
    category: project.category,
    year: project.year
  })
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' }
  })
}
