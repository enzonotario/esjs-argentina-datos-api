import { STATIC_PATH } from '../constants.ts'

const STATIC_PUBLIC_BASE_URL = 'https://api.argentinadatos.com/static/'

export function getStaticPublicUrl(filePath: string): string {
  return `${STATIC_PUBLIC_BASE_URL}${filePath.replace(STATIC_PATH, '').replace(/^\//, '')}`
}
