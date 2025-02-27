import { fileURLToPath } from 'node:url'

export const BASE_URL = 'https://datos.hcdn.gob.ar'

export const VOTACIONES_BASE_URL = 'https://votaciones.hcdn.gob.ar'

export const DATOS_PATH = fileURLToPath(
  new URL('../../../datos/v1/diputados', import.meta.url),
)

export const STATIC_PATH = fileURLToPath(
  new URL('../../../datos/static', import.meta.url),
)

export const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
