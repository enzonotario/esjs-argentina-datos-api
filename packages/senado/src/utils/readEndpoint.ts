import fs from 'node:fs'
import path from 'node:path'
import { DATOS_PATH } from '../constants.ts'

export function readEndpoint(endpoint: string): string | null {
  const filePath = path.join(DATOS_PATH, ...endpoint.split('/'), 'index.json')

  if (!fs.existsSync(filePath)) {
    return null
  }

  return fs.readFileSync(filePath, 'utf-8')
}
