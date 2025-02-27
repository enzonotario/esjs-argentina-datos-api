import path from 'node:path'
import { STATIC_PATH } from '../constants.ts'

export function getStaticPath(filePath: string): string {
  return path.join(
    STATIC_PATH,
    filePath.replace(STATIC_PATH, '').replace(/^\//, ''),
  )
}
