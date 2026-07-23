/**
 * Build-time embedding index for AI site search.
 *
 * Run on demand (not on every build):  npm run embeddings
 * Reads blog posts (MDX on disk) + project case studies (src/data/projects.ts),
 * chunks them, embeds each chunk with a local transformers.js model, and writes
 * a committed static index to src/data/embeddings.json.
 *
 * Node 24 runs this .ts directly (type stripping); projects.ts uses only
 * `import type`, which is stripped.
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pipeline } from '@huggingface/transformers'
import { type SourceDoc, chunkDoc } from '../src/utils/chunk.ts'
import { projects } from '../src/data/projects.ts'

const MODEL = 'Xenova/all-MiniLM-L6-v2'
const BLOG_DIR = join(process.cwd(), 'src/content/blog')
const OUT = join(process.cwd(), 'src/data/embeddings.json')

function frontmatterValue(fm: string, key: string): string | undefined {
  const m = new RegExp(`^${key}:\\s*['"]?(.+?)['"]?\\s*$`, 'm').exec(fm)
  return m?.[1]
}

function blogDocs(): SourceDoc[] {
  const files = readdirSync(BLOG_DIR).filter((f) => /\.mdx?$/.test(f))
  const docs: SourceDoc[] = []
  for (const file of files) {
    const raw = readFileSync(join(BLOG_DIR, file), 'utf8')
    const fmMatch = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(raw)
    if (!fmMatch) continue
    const [, fm, body] = fmMatch
    if (frontmatterValue(fm, 'draft') === 'true') continue
    const slug = file.replace(/\.mdx?$/, '')
    const title = frontmatterValue(fm, 'title') ?? slug
    const description = frontmatterValue(fm, 'description') ?? ''
    docs.push({ id: `blog:${slug}`, title, url: `/blog/${slug}/`, body: `${description}\n\n${body}` })
  }
  return docs
}

function projectDocs(): SourceDoc[] {
  return projects.map((p) => {
    const parts = [
      p.title,
      p.shortDescription,
      p.fullDescription,
      p.role,
      (p.technologies ?? []).join(', '),
      ...(p.challenges ?? []),
      ...(p.solutions ?? []),
      ...(p.results ?? [])
    ].filter(Boolean)
    return { id: `project:${p.slug}`, title: p.title, url: `/projects/${p.slug}/`, body: parts.join('\n\n') }
  })
}

async function main() {
  const docs = [...projectDocs(), ...blogDocs()]
  const chunks = docs.flatMap((d) => chunkDoc(d))
  console.log(`Chunked ${docs.length} docs into ${chunks.length} chunks. Loading model ${MODEL}…`)

  const extractor = await pipeline('feature-extraction', MODEL, { dtype: 'fp32' })
  const texts = chunks.map((c) => c.text)
  const out = await extractor(texts, { pooling: 'mean', normalize: true })

  const dim = out.dims[out.dims.length - 1] as number
  const flat = Array.from(out.data as Float32Array)
  const embedded = chunks.map((c, i) => ({
    ...c,
    vector: flat.slice(i * dim, (i + 1) * dim).map((v) => Number(v.toFixed(6)))
  }))

  const index = { model: MODEL, dim, chunks: embedded }
  writeFileSync(OUT, JSON.stringify(index))
  const kb = (Buffer.byteLength(JSON.stringify(index)) / 1024).toFixed(0)
  console.log(`Wrote ${embedded.length} embedded chunks (${dim}d) → ${OUT} (${kb} KB)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
