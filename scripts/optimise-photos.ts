/* eslint-disable no-console */
import { readdir, mkdir, stat } from 'node:fs/promises'
import { join, parse } from 'node:path'
import sharp from 'sharp'

const INPUT_DIR = join(process.cwd(), 'photos')
const OUTPUT_DIR = join(process.cwd(), 'photos_optimised')
const WIDTHS = [480, 960, 1600, 2400]
const FORMATS = ['webp', 'avif'] as const

async function ensureDir(dir: string) {
  try {
    await stat(dir)
  } catch {
    await mkdir(dir, { recursive: true })
  }
}

async function main() {
  await ensureDir(OUTPUT_DIR)
  let entries: string[]
  try {
    entries = await readdir(INPUT_DIR)
  } catch (err) {
    console.error(`Cannot read ${INPUT_DIR}. Put source photos there and re-run.`)
    process.exit(1)
  }

  const images = entries.filter((f) => /\.(jpe?g|png|tiff?|webp)$/i.test(f))
  if (images.length === 0) {
    console.log('No images found.')
    return
  }

  console.log(`Optimising ${images.length} image(s) -> ${OUTPUT_DIR}`)

  for (const file of images) {
    const src = join(INPUT_DIR, file)
    const { name } = parse(file)
    const img = sharp(src, { failOn: 'none' }).rotate()
    const meta = await img.metadata()
    const maxW = meta.width ?? 0

    for (const width of WIDTHS) {
      if (maxW && width > maxW) continue
      for (const fmt of FORMATS) {
        const outFile = join(OUTPUT_DIR, `${name}-${width}.${fmt}`)
        await img
          .clone()
          .resize({ width, withoutEnlargement: true })
          .toFormat(fmt, { quality: fmt === 'avif' ? 55 : 78 })
          .toFile(outFile)
      }
    }
    console.log(`  ${file} -> done`)
  }

  console.log('Done. Upload contents of photos_optimised/ to R2 (bucket prefix "seed/") and register in Payload.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
