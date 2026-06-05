import type { DocumentProps } from '@react-pdf/renderer'
import { renderToBuffer } from '@react-pdf/renderer'
import type { APIRoute } from 'astro'
import type { ReactElement } from 'react'
import { createElement } from 'react'
import ResumePdfAts from '@/components/resume/ResumePdfAts'
import { education, experiences, projects, skillCategories, summary } from '@/data/experience'

export const GET: APIRoute = async () => {
  const element = createElement(ResumePdfAts, {
    experiences,
    projects,
    education,
    skillCategories,
    summary
  }) as ReactElement<DocumentProps>
  const buffer = await renderToBuffer(element)
  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="ricki-friadi-resume-ats.pdf"'
    }
  })
}
