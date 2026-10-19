import sharp from 'sharp'

/** A canvas is an array of rows, each row an array of one-character cells. '.' is transparent. */
export function canvas(width, height) {
  return Array.from({ length: height }, () => Array(width).fill('.'))
}

/** Stamp rows onto a canvas at (x, y). '.' leaves what is underneath. */
export function blit(target, rows, x, y) {
  rows.forEach((row, dy) => {
    for (let dx = 0; dx < row.length; dx++) {
      if (row[dx] === '.') continue
      const tx = x + dx
      const ty = y + dy
      if (target[ty]?.[tx] !== undefined) target[ty][tx] = row[dx]
    }
  })
}

/** Rows from half-strings: the left half mirrored to the right, for front and back views. */
export const mirrorHalf = (half) => half + [...half].reverse().join('')

/** Throws naming the drawing and the row when a grid is not the size it claims. */
export function assertGrid(name, rows, width, height) {
  if (rows.length !== height) throw new Error(`${name}: ${rows.length} rows, expected ${height}`)
  rows.forEach((row, i) => {
    if (row.length !== width) throw new Error(`${name}: row ${i} is ${row.length} wide, expected ${width}`)
  })
}

function hexToRgb(hex) {
  const n = Number.parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/**
 * Flatten cells to a PNG. Every pixel is fully opaque or fully transparent,
 * and an unknown letter throws rather than drawing a guess.
 */
export async function toPng(cells, colours, out) {
  const height = cells.length
  const width = cells[0].length
  const buf = Buffer.alloc(width * height * 4)
  cells.forEach((row, y) =>
    row.forEach((ch, x) => {
      if (ch === '.') return
      const hex = colours[ch]
      if (!hex) throw new Error(`${out}: no colour for "${ch}" at ${x},${y}`)
      const [r, g, b] = hexToRgb(hex)
      buf.set([r, g, b, 255], (y * width + x) * 4)
    })
  )
  await sharp(buf, { raw: { width, height, channels: 4 } }).png({ compressionLevel: 9 }).toFile(out)
}
