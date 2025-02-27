import fs from 'node:fs'
import { getStaticPath } from './getStaticPath.ts'

export function readStaticBuffer(staticPath: string): Buffer | null {
  const filePath = getStaticPath(staticPath)

  if (!fs.existsSync(filePath)) {
    return null
  }

  return fs.readFileSync(filePath)
}
