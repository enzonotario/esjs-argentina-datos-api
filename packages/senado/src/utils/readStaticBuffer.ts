import fs from 'node:fs'
import { getStaticPath } from './getStaticPath.ts'

export function readStaticBuffer(pdfPath: string): Buffer | null {
  const filePath = getStaticPath(pdfPath)

  if (!fs.existsSync(filePath)) {
    return null
  }

  return fs.readFileSync(filePath)
}
