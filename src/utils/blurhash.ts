import { existsSync, statSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { encode } from 'blurhash'
import sharp from 'sharp'

const CACHE_PATH = path.join(process.cwd(), 'src/data/blurhash-cache.json')
const ENCODE_SIZE = 32
const COMPONENTS_X = 4
const COMPONENTS_Y = 3

interface CacheEntry {
  hash: string
  identifier: string
}

type Cache = Record<string, CacheEntry>

let cache: Cache | null = null

async function loadCache(): Promise<Cache> {
  if (cache) return cache
  try {
    cache = JSON.parse(await readFile(CACHE_PATH, 'utf-8'))
  } catch {
    cache = {}
  }
  return cache as Cache
}

async function persistCache(): Promise<void> {
  if (!cache) return
  await writeFile(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`, 'utf-8')
}

async function getImageBufferAndIdentifier(
  imagePath: string
): Promise<{ buffer: Buffer; identifier: string } | null> {
  if (/^https?:\/\//.test(imagePath)) {
    const response = await fetch(imagePath)
    if (!response.ok) return null
    const identifier =
      response.headers.get('etag') ?? response.headers.get('content-length') ?? imagePath
    const buffer = Buffer.from(await response.arrayBuffer())
    return { buffer, identifier }
  }

  const localPath = path.join(process.cwd(), 'public', imagePath.replace(/^\//, ''))
  if (!existsSync(localPath)) return null
  const identifier = String(statSync(localPath).mtimeMs)
  const buffer = await readFile(localPath)
  return { buffer, identifier }
}

export async function getBlurhash(imagePath: string): Promise<string | null> {
  if (!imagePath) return null

  const c = await loadCache()
  const existing = c[imagePath]

  try {
    const source = await getImageBufferAndIdentifier(imagePath)
    if (!source) return existing?.hash ?? null

    if (existing && existing.identifier === source.identifier) {
      return existing.hash
    }

    const { data, info } = await sharp(source.buffer)
      .raw()
      .ensureAlpha()
      .resize(ENCODE_SIZE, ENCODE_SIZE, { fit: 'inside' })
      .toBuffer({ resolveWithObject: true })

    const hash = encode(
      new Uint8ClampedArray(data),
      info.width,
      info.height,
      COMPONENTS_X,
      COMPONENTS_Y
    )

    c[imagePath] = { hash, identifier: source.identifier }
    await persistCache()

    return hash
  } catch {
    return existing?.hash ?? null
  }
}
