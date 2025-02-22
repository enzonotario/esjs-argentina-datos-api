import fs from 'node:fs'
import path from 'node:path'
import { getStaticPath } from './getStaticPath.ts'

export function writeStaticPdf(pdfPath: string, data: Buffer): string {
  const filePath = getStaticPath(pdfPath)

  fs.mkdirSync(path.dirname(filePath), { recursive: true })

  fs.writeFileSync(filePath, data)

  return filePath
}
