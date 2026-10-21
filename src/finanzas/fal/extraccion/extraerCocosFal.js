import { logGrupo, logMensaje } from '@/log.js'
import { crearAlternativaFal } from './crearAlternativaFal.js'
import { fetchTextoFal } from './fetchTextoFal.js'

export const COCOS_FAL_URL =
  'https://cocos.capital/fondos-de-asistencia-laboral'

const log = logGrupo({
  fuente: 'extraerCocosFal',
  tipo: 'extraccion',
})

/**
 * @param {string} texto
 */
export function parsearCocosFal(texto) {
  const t = String(texto)

  if (
    !/Cocos Asset Management/i.test(t) ||
    !/Fondos de Asistencia Laboral/i.test(t)
  ) {
    return []
  }

  return [
    crearAlternativaFal({
      entidad: 'cocos',
      nombreComercial: 'Cocos',
      sociedadGerente: 'Cocos Asset Management',
      enlace: COCOS_FAL_URL,
      condiciones: /preliminar/i.test(t)
        ? 'La página dice que la información es preliminar y no publica la comisión.'
        : 'La página no publica la comisión de administración.',
      metadata: {
        fuenteUrl: COCOS_FAL_URL,
        ...(/preliminar/i.test(t) ? { preliminar: true } : {}),
      },
    }),
  ]
}

export async function extraerCocosFal() {
  const texto = await fetchTextoFal(COCOS_FAL_URL, log)
  const filas = parsearCocosFal(texto)

  logMensaje(log, 'Cocos FAL parseado', { filas: filas.length })

  return filas
}
