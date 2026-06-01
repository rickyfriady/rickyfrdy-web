import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { ReactNode } from 'react'
import satori from 'satori'
import sharp from 'sharp'

const WIDTH = 1200
const HEIGHT = 630

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return `${text.slice(0, max - 1)}…`
}

export function formatCategory(category: string): string {
  const labels: Record<string, string> = {
    'web-app': 'Web App',
    api: 'API',
    tool: 'Tool',
    'open-source': 'Open Source'
  }
  return labels[category] ?? category
}

type FontData = { name: string; data: Buffer; style: 'normal' | 'italic' }[]
let fontCache: FontData | undefined

async function fonts(): Promise<FontData> {
  if (!fontCache) {
    const [serif, mono] = await Promise.all([
      readFile(resolve('./public/fonts/Lora-Italic.ttf')),
      readFile(resolve('./public/fonts/JetBrainsMono-Regular.ttf'))
    ])
    fontCache = [
      { name: 'Lora', data: serif, style: 'italic' },
      { name: 'JetBrains Mono', data: mono, style: 'normal' }
    ]
  }
  return fontCache
}

function pill(text: string) {
  return {
    type: 'div',
    props: {
      style: {
        fontSize: 11,
        fontFamily: 'JetBrains Mono',
        color: '#8ca89c',
        border: '1px solid rgba(140,168,156,0.55)',
        borderRadius: 4,
        padding: '2px 8px',
        lineHeight: 1.4
      },
      children: text
    }
  }
}

function buildCard(
  typeLabel: string,
  meta1: string,
  meta2: string,
  title: string,
  description: string,
  tags: string[]
) {
  return {
    type: 'div',
    props: {
      style: {
        width: WIDTH,
        height: HEIGHT,
        display: 'flex',
        flexDirection: 'row'
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              width: 432,
              height: HEIGHT,
              backgroundColor: '#0e1a16',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '44px 36px',
              borderRight: '2px solid #8ca89c'
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 13,
                    fontFamily: 'JetBrains Mono',
                    color: '#8ca89c',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase'
                  },
                  children: 'rickyfrdy.my.id'
                }
              },
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column', gap: 6 },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: 11,
                          fontFamily: 'JetBrains Mono',
                          color: 'rgba(242,240,232,0.35)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.12em'
                        },
                        children: typeLabel
                      }
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: 13,
                          fontFamily: 'JetBrains Mono',
                          color: '#8ca89c'
                        },
                        children: meta1
                      }
                    },
                    ...(meta2
                      ? [
                          {
                            type: 'div',
                            props: {
                              style: {
                                fontSize: 12,
                                fontFamily: 'JetBrains Mono',
                                color: 'rgba(242,240,232,0.3)'
                              },
                              children: meta2
                            }
                          }
                        ]
                      : [])
                  ]
                }
              }
            ]
          }
        },
        {
          type: 'div',
          props: {
            style: {
              flex: 1,
              height: HEIGHT,
              backgroundColor: '#f8f7f4',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '44px 40px'
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 42,
                    fontFamily: 'Lora',
                    fontStyle: 'italic',
                    color: '#0e1a16',
                    lineHeight: 1.15
                  },
                  children: truncate(title, 60)
                }
              },
              {
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column', gap: 14 },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: 13,
                          fontFamily: 'JetBrains Mono',
                          color: 'rgba(14,26,22,0.5)',
                          lineHeight: 1.5
                        },
                        children: truncate(description, 100)
                      }
                    },
                    {
                      type: 'div',
                      props: {
                        style: { display: 'flex', flexDirection: 'row', gap: 8 },
                        children: tags.slice(0, 3).map(pill)
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  }
}

async function toPng(element: ReturnType<typeof buildCard>): Promise<Buffer> {
  const svg = await satori(element as unknown as ReactNode, {
    width: WIDTH,
    height: HEIGHT,
    fonts: await fonts()
  })
  return sharp(Buffer.from(svg)).png().toBuffer()
}

export async function renderBlogOgCard(data: {
  title: string
  description: string
  tags: string[]
  pubDate: Date
  readingTime: string
}): Promise<Buffer> {
  const dateStr = data.pubDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
  return toPng(
    buildCard('Blog Post', dateStr, data.readingTime, data.title, data.description, data.tags)
  )
}

export async function renderProjectOgCard(data: {
  title: string
  shortDescription: string
  technologies: string[]
  category: string
  year: number
}): Promise<Buffer> {
  const meta1 = `${formatCategory(data.category)} · ${data.year}`
  return toPng(
    buildCard('Project', meta1, '', data.title, data.shortDescription, data.technologies)
  )
}
