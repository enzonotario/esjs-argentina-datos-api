import { fileURLToPath } from 'node:url'

export const DATOS_PATH = fileURLToPath(
  new URL('../../../datos/v1/', import.meta.url),
)

export const STATIC_PATH = fileURLToPath(
  new URL('../../../datos/static', import.meta.url),
)
