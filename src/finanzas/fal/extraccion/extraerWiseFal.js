import { logGrupo, logMensaje } from '@/log.js'
import { crearAlternativaFal } from './crearAlternativaFal.js'
import { fetchTextoFal } from './fetchTextoFal.js'

export const WISE_FAL_URL = 'https://wise.com.ar/fondo-de-asistencia-laboral/'

const log = logGrupo({
  fuente: 'extraerWiseFal',
  tipo: 'extraccion',
})

/**
 * @param {string} texto
 */
export function parsearWiseFal(texto) {
  const t = String(texto)
  const tieneOferta =
    /costo total/i.test(t) &&
    /diciembre de 2027/i.test(t) &&
    /0\s*%\s*anual/i.test(t) &&
    /honorario en 0,8\s*% y otra en 1\s*% anual/i.test(t)

  if (!tieneOferta) return []

  const vida = /entre\s+6\s+y\s+18\s+meses/i.test(t)
  const base = {
    entidad: 'wise-capital',
    nombreComercial: 'Wise Capital',
    horizonte: vida ? 'rendimiento' : null,
    vidaPromedioMesesMin: vida ? 6 : null,
    vidaPromedioMesesMax: vida ? 18 : null,
    incluyeIva: true,
    ivaAdicional: false,
    reintegroAportes: /devoluci[oó]n del aporte/i.test(t) ? true : null,
    vigenciaDeclarada: /noviembre de 2026/i.test(t) ? '2026-11-01' : null,
    enlace: WISE_FAL_URL,
    metadata: {
      fuenteUrl: WISE_FAL_URL,
      costoTotal: true,
    },
  }

  return [
    crearAlternativaFal({
      ...base,
      plan: 'honorario-0',
      nombrePlan: 'Honorario 0%',
      comisionAnual: 0,
      comisionPosteriorAnual: 0,
      condiciones:
        'Hasta diciembre de 2027 el honorario es 0% para todos los clientes. Desde enero de 2028 el 0% pide pasar sueldos y F.931, suscribir saldos de cuenta corriente y pasar la tesorería.',
    }),
    crearAlternativaFal({
      ...base,
      plan: 'honorario-0-8',
      nombrePlan: 'Honorario 0,80%',
      comisionAnual: 0,
      comisionVigenciaHasta: '2027-12-31',
      comisionPosteriorAnual: 0.008,
      condiciones:
        'Hasta diciembre de 2027 el honorario es 0%. Desde enero de 2028 pasa a 0,80% anual si se pasan sueldos, F.931 y e-cheqs, y se suscriben los saldos de cuenta corriente.',
    }),
    crearAlternativaFal({
      ...base,
      plan: 'honorario-1',
      nombrePlan: 'Honorario 1%',
      comisionAnual: 0,
      comisionVigenciaHasta: '2027-12-31',
      comisionPosteriorAnual: 0.01,
      condiciones:
        'Hasta diciembre de 2027 el honorario es 0%. Desde enero de 2028 el 1% anual no exige pasar sueldos ni tesorería. Incluye la devolución del aporte por altas de nómina.',
    }),
  ]
}

export async function extraerWiseFal() {
  const texto = await fetchTextoFal(WISE_FAL_URL, log)
  const filas = parsearWiseFal(texto)

  logMensaje(log, 'Wise Capital FAL parseado', { filas: filas.length })

  return filas
}
