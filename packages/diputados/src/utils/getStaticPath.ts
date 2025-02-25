import path from 'node:path'
import { STATIC_SENADO_PATH } from '../constants.ts'

export function getStaticPath(filePath: string): string {
  return path.join(
    STATIC_SENADO_PATH,
    filePath.replace(STATIC_SENADO_PATH, '').replace(/^\//, ''),
  )
}
