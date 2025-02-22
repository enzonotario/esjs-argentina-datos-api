import fs from 'node:fs'
import path from 'node:path'
import { STATIC_PATH } from '../constants.ts'

export function readStaticPdf(pdfPath: string): Buffer | null {
  const filePath = path.join(
    STATIC_PATH,
    pdfPath.replace(STATIC_PATH, '').replace(/^\//, ''),
  )

  if (!fs.existsSync(filePath)) {
    return null
  }

  return fs.readFileSync(filePath)
}
