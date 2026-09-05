export interface SourceDoc {
  /** Unique id, e.g. `blog:my-slug` or `project:singel-app` */
  id: string
  title: string
  url: string
  body: string
}

export interface Chunk {
  id: string
  title: string
  url: string
  /** 0-based chunk index within its source doc */
  index: number
  text: string
}

/**
 * Lightly strip Markdown/MDX syntax so embeddings focus on prose, not markup.
 * Not a full parser — good enough for retrieval.
 */
export function stripMarkdown(body: string): string {
  return body
    .replace(/^---[\s\S]*?---/, '') // frontmatter, if any
    .replace(/```[\s\S]*?```/g, ' ') // fenced code
    .replace(/`[^`]*`/g, ' ') // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links → text
    .replace(/<[^>]+>/g, ' ') // html/jsx tags
    .replace(/^[#>\-*+]\s+/gm, '') // heading/list/quote markers
    .replace(/[*_~]/g, '') // emphasis
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * Split a document into overlapping, paragraph-aware chunks sized for embedding.
 * Paragraphs are kept whole where possible; oversized paragraphs are split by sentence.
 */
export function chunkDoc(doc: SourceDoc, maxChars = 900, overlapChars = 150): Chunk[] {
  const clean = stripMarkdown(doc.body)
  const paragraphs = clean
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)

  const pieces: string[] = []
  let buffer = ''
  const flush = () => {
    if (buffer.trim()) pieces.push(buffer.trim())
    buffer = ''
  }

  for (const para of paragraphs) {
    if (para.length > maxChars) {
      flush()
      const sentences = para.match(/[^.!?]+[.!?]*\s*/g) ?? [para]
      let s = ''
      for (const sentence of sentences) {
        if ((s + sentence).length > maxChars) {
          if (s.trim()) pieces.push(s.trim())
          s = sentence
        } else {
          s += sentence
        }
      }
      if (s.trim()) pieces.push(s.trim())
      continue
    }
    if (`${buffer}\n\n${para}`.length > maxChars) {
      flush()
      buffer = para
    } else {
      buffer = buffer ? `${buffer}\n\n${para}` : para
    }
  }
  flush()

  // Add tail overlap between adjacent chunks for context continuity.
  const withOverlap = pieces.map((text, i) => {
    if (i === 0 || overlapChars <= 0) return text
    const prevTail = pieces[i - 1].slice(-overlapChars)
    return `${prevTail} ${text}`.trim()
  })

  return withOverlap.map((text, index) => ({
    id: doc.id,
    title: doc.title,
    url: doc.url,
    index,
    text
  }))
}
