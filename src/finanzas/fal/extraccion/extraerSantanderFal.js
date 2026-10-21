import { logGrupo, logMensaje } from '@/log.js'
import { crearAlternativaFal } from './crearAlternativaFal.js'
import { fetchTextoFal } from './fetchTextoFal.js'

export const SANTANDER_FAL_URL =
  'https://www.santander.com.ar/empresas/fondo-de-asistencia-laboral'

const log = logGrupo({
  fuente: 'extraerSantanderFal',
  tipo: 'extraccion',
})

/**
 * @param {string} texto
 */
export function parsearSantanderFal(texto) {
  const t = String(texto)
  const reserva = /superfondo reserva fal/i.test(t)
  const plus = /superfondo reserva plus fal/i.test(t)

  if (!reserva && !plus) return []

  const calificacion = /AAAf\.ar/i.test(t)
    ? 'AAAf.ar (Moody’s Local Argentina)'
    : null
  const base = {
    entidad: 'santander',
    nombreComercial: 'Santander',
    vehiculo: /fondos comunes de inversi[oó]n/i.test(t) ? 'fci_abierto' : null,
    canal: /online banking/i.test(t) ? 'banca_empresas' : null,
    vigenciaDeclarada: /diciembre de 2026/i.test(t) ? '2026-12-01' : null,
    enlace: SANTANDER_FAL_URL,
    condiciones:
      'La página no publica la comisión de administración. El alta del ID FAL es por Online Banking Empresas.',
    metadata: {
      fuenteUrl: SANTANDER_FAL_URL,
      ...(calificacion ? { calificacion } : {}),
    },
  }

  const filas = []

  if (reserva) {
    filas.push(
      crearAlternativaFal({
        ...base,
        plan: 'superfondo-reserva-fal',
        nombrePlan: 'Superfondo Reserva FAL',
        horizonte: /corto plazo/i.test(t) ? 'corto_plazo' : null,
      }),
    )
  }

  if (plus) {
    filas.push(
      crearAlternativaFal({
        ...base,
        plan: 'superfondo-reserva-plus-fal',
        nombrePlan: 'Superfondo Reserva Plus FAL',
        horizonte: /CER/i.test(t) ? 'inflacion' : null,
        condiciones:
          'Renta fija con deuda soberana ajustada por CER. La página no publica la comisión de administración.',
      }),
    )
  }

  return filas
}

export async function extraerSantanderFal() {
  const texto = await fetchTextoFal(SANTANDER_FAL_URL, log)
  const filas = parsearSantanderFal(texto)

  logMensaje(log, 'Santander FAL parseado', { filas: filas.length })

  return filas
}
