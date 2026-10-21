import { logGrupo, logMensaje } from '@/log.js'
import { crearAlternativaFal } from './crearAlternativaFal.js'
import { fetchTextoFal } from './fetchTextoFal.js'

export const MAX_FAL_URL = 'https://www.max.capital/FAL'

const log = logGrupo({
  fuente: 'extraerMaxFal',
  tipo: 'extraccion',
})

/**
 * @param {string} texto
 */
export function parsearMaxFal(texto) {
  const t = String(texto)
  const esMax =
    /Max Capital Asset Management/i.test(t) &&
    /Fondos Comunes de Inversi[oó]n/i.test(t) &&
    /Fondo de Asistencia Laboral|\bFAL\b/i.test(t)

  if (!esMax) return []

  const vigencia =
    /01\/12\/2026/i.test(t) || /1 de diciembre de 2026/i.test(t)
      ? '2026-12-01'
      : null

  return [
    crearAlternativaFal({
      entidad: 'max-capital',
      nombreComercial: 'Max Capital',
      vehiculo: 'fci_abierto',
      sociedadGerente: 'Max Capital Asset Management',
      canal: /formulario|dej[aá]nos tus datos|contactanos/i.test(t)
        ? 'formulario'
        : null,
      vigenciaDeclarada: vigencia,
      enlace: MAX_FAL_URL,
      condiciones:
        'La página no publica la comisión ni el nombre del fondo FAL.',
      metadata: {
        fuenteUrl: MAX_FAL_URL,
      },
    }),
  ]
}

export async function extraerMaxFal() {
  const texto = await fetchTextoFal(MAX_FAL_URL, log)
  const filas = parsearMaxFal(texto)

  logMensaje(log, 'Max Capital FAL parseado', { filas: filas.length })

  return filas
}
