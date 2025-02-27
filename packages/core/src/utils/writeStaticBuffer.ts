import fs from 'node:fs'
import path from 'node:path'
import { getStaticPath } from './getStaticPath.ts'

export function writeStaticBuffer(staticPath: string, data: Buffer): string {
  const filePath = getStaticPath(staticPath)

  fs.mkdirSync(path.dirname(filePath), { recursive: true })

  fs.writeFileSync(filePath, data)

  return filePath
}
