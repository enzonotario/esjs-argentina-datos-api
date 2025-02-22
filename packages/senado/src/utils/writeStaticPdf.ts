import fs from 'node:fs'
import path from 'node:path'
import { STATIC_PATH } from '../constants.ts'

export function writeStaticPdf(pdfPath: string, data: Buffer): string {
  const filePath = path.join(STATIC_PATH, pdfPath)

  fs.mkdirSync(path.dirname(filePath), { recursive: true })

  fs.writeFileSync(filePath, data)

  return filePath
}
