import { existsSync, readdirSync } from 'fs'
import { join } from 'path'
import sharp from 'sharp'

const dir = join(process.cwd(), 'public/works')
const files = readdirSync(dir).filter((f) => f.endsWith('.png'))

for (const file of files) {
  const input = join(dir, file)
  const output = join(dir, file.replace('.png', '.webp'))
  if (!existsSync(output)) {
    await sharp(input).webp({ quality: 85 }).toFile(output)
    console.log(`✓ ${file} → ${file.replace('.png', '.webp')}`)
  } else {
    console.log(`– ${file.replace('.png', '.webp')} already exists`)
  }
}
