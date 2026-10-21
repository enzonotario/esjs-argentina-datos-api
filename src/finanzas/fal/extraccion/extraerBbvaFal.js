import { logGrupo, logMensaje } from '@/log.js'
import { crearAlternativaFal } from './crearAlternativaFal.js'
import { fetchTextoFal } from './fetchTextoFal.js'

export const BBVA_FAL_URL =
  'https://www.bbva.com.ar/empresas/productos/inversiones/fondo-asistencia-laboral.html'

const log = logGrupo({
  fuente: 'extraerBbvaFal',
  tipo: 'extraccion',
})

/**
 * @param {string} texto
 */
export function parsearBbvaFal(texto) {
  const t = String(texto)
  const tieneCero =
    /no tendr[aá] comisi[oó]n\s*\(\s*0\s*%\s*\)\s*hasta fin de 2027/i.test(t) ||
    (/0\s*%\s*de comisi[oó]n/i.test(t) && /hasta fin de 2027/i.test(t))

  if (!tieneCero) return []

  const falI = /FAL\s+I\b/i.test(t) && /entre\s+1\s+y\s+3\s+meses/i.test(t)
  const falII =
    /FAL\s+II\b/i.test(t) && /entre\s+los\s+6\s+y\s+los\s+12\s+meses/i.test(t)

  if (!falI && !falII) return []

  const reintegro = /reintegro/i.test(t)
  const base = {
    entidad: 'bbva',
    nombreComercial: 'BBVA',
    vehiculo: /fondo com[uú]n de inversi[oó]n abierto/i.test(t)
      ? 'fci_abierto'
      : null,
    sociedadGerente: /BBVA Asset Management Argentina/i.test(t)
      ? 'BBVA Asset Management Argentina'
      : null,
    comisionAnual: 0,
    incluyeIva: null,
    ivaAdicional: null,
    comisionVigenciaHasta: '2027-12-31',
    reintegroAportes: reintegro ? true : null,
    canal: /Web BBVA Empresas/i.test(t) ? 'banca_empresas' : null,
    vigenciaDeclarada: /diciembre de 2026/i.test(t) ? '2026-12-01' : null,
    enlace: BBVA_FAL_URL,
    condiciones: reintegro
      ? 'Comisión de administración 0% hasta el 31/12/2027. El reintegro del aporte es de campaña y aplica a nóminas netas nuevas acreditadas en BBVA.'
      : 'Comisión de administración 0% hasta el 31/12/2027. Después, la página dice que se ajusta a la normativa.',
    metadata: {
      fuenteUrl: BBVA_FAL_URL,
    },
  }

  const filas = []

  if (falI) {
    filas.push(
      crearAlternativaFal({
        ...base,
        plan: 'fal-i',
        nombrePlan: 'FAL I',
        horizonte: 'corto_plazo',
        vidaPromedioMesesMin: 1,
        vidaPromedioMesesMax: 3,
      }),
    )
  }

  if (falII) {
    filas.push(
      crearAlternativaFal({
        ...base,
        plan: 'fal-ii',
        nombrePlan: 'FAL II',
        horizonte: 'inflacion',
        vidaPromedioMesesMin: 6,
        vidaPromedioMesesMax: 12,
      }),
    )
  }

  return filas
}

export async function extraerBbvaFal() {
  const texto = await fetchTextoFal(BBVA_FAL_URL, log)
  const filas = parsearBbvaFal(texto)

  logMensaje(log, 'BBVA FAL parseado', { filas: filas.length })

  return filas
}
