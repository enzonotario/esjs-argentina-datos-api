import path from 'node:path'
import { STATIC_PATH } from '../constants.ts'

export function getStaticPath(pdfPath: string): string {
  return path.join(
    STATIC_PATH,
    pdfPath.replace(STATIC_PATH, '').replace(/^\//, ''),
  )
}
