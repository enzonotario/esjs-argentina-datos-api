import { logGrupo, logMensaje } from '@/log.js'
import { crearAlternativaFal } from './crearAlternativaFal.js'
import { fetchTextoFal } from './fetchTextoFal.js'

export const BALANZ_FAL_URL =
  'https://balanz.com/inversiones/fondos/fondo-de-asistencia-laboral/'

const log = logGrupo({
  fuente: 'extraerBalanzFal',
  tipo: 'extraccion',
})

/**
 * @param {string} texto
 */
export function parsearBalanzFal(texto) {
  const t = String(texto)
  const gerente = t.match(
    /Balanz Sociedad Gerente de Fondos Comunes de Inversi[oó]n S\.A\.U\./i,
  )

  if (!gerente || !/cuenta FAL/i.test(t)) return []

  const citaTopeLegal = /tope del 1\s*%/i.test(t)

  return [
    crearAlternativaFal({
      entidad: 'balanz',
      nombreComercial: 'Balanz',
      vehiculo: 'fci_abierto',
      sociedadGerente: gerente[0],
      canal: /asesor/i.test(t) ? 'asesor' : null,
      vigenciaDeclarada: /diciembre de 2026/i.test(t) ? '2026-12-01' : null,
      enlace: BALANZ_FAL_URL,
      condiciones: citaTopeLegal
        ? 'La página cita el tope legal del 1% anual y no publica la comisión propia.'
        : 'La página no publica la comisión de administración.',
      metadata: {
        fuenteUrl: BALANZ_FAL_URL,
        ...(citaTopeLegal ? { topeLegalAnual: 0.01 } : {}),
      },
    }),
  ]
}

export async function extraerBalanzFal() {
  const texto = await fetchTextoFal(BALANZ_FAL_URL, log)
  const filas = parsearBalanzFal(texto)

  logMensaje(log, 'Balanz FAL parseado', { filas: filas.length })

  return filas
}
