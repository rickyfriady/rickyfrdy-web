import { renderToBuffer } from '@react-pdf/renderer'
import type { APIRoute } from 'astro'
import { createElement } from 'react'
import ResumePdf from '@/components/resume/ResumePdf'
import { education, experiences, projects, skillCategories, summary } from '@/data/experience'

export const GET: APIRoute = async () => {
  const element = createElement(ResumePdf, {
    experiences,
    projects,
    education,
    skillCategories,
    summary
  })
  const buffer = await renderToBuffer(element)
  return new Response(new Uint8Array(buffer), {
    headers: { 'Content-Type': 'application/pdf' }
  })
}
