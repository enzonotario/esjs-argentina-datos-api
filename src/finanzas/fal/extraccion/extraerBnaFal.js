import { logGrupo, logMensaje } from '@/log.js'
import { crearAlternativaFal } from './crearAlternativaFal.js'
import { fetchTextoFal } from './fetchTextoFal.js'

export const BNA_FAL_URL = 'https://www.bna.com.ar/home/fal'

const log = logGrupo({
  fuente: 'extraerBnaFal',
  tipo: 'extraccion',
})

/**
 * @param {string} texto
 */
export function parsearBnaFal(texto) {
  const t = String(texto)
  const gerente = t.match(/Pellegrini FCI S\.A\./) || t.match(/Pellegrini S\.A\./)
  const esBna =
    gerente &&
    /\bBNA\b/.test(t) &&
    /FAL Ahorro/i.test(t) &&
    /FAL Crecimiento/i.test(t) &&
    /Fondo exclusivo/i.test(t) &&
    /reintegro del 100%\s*de la comisi[oó]n de administraci[oó]n/i.test(t)

  if (!esBna) return []

  const reintegraHastaFin2027 = /31\/12\/2027/.test(t)
  const notaComision = reintegraHastaFin2027
    ? 'El BNA reintegra el 100% de la comisión de administración hasta el 31/12/2027. La página no publica ese porcentaje.'
    : 'La página no publica la comisión de administración.'

  const base = {
    entidad: 'bna',
    nombreComercial: 'BNA',
    sociedadGerente: gerente[0],
    canal: /quiero que me contacten/i.test(t) ? 'formulario' : null,
    vigenciaDeclarada: /1\s*[°º]?\s*de noviembre de 2026/i.test(t)
      ? '2026-11-01'
      : null,
    enlace: BNA_FAL_URL,
    metadata: {
      fuenteUrl: BNA_FAL_URL,
      ...(reintegraHastaFin2027 ? { reintegroComisionHasta: '2027-12-31' } : {}),
    },
  }

  return [
    crearAlternativaFal({
      ...base,
      plan: 'ahorro',
      nombrePlan: 'FAL Ahorro',
      horizonte: 'corto_plazo',
      condiciones: `Fondo multiempleador de corto plazo, con foco en liquidez. ${notaComision}`,
    }),
    crearAlternativaFal({
      ...base,
      plan: 'crecimiento',
      nombrePlan: 'FAL Crecimiento',
      horizonte: 'inflacion',
      condiciones: `Horizonte mediano o largo, con exposición a CER. ${notaComision}`,
    }),
    crearAlternativaFal({
      ...base,
      plan: 'exclusivo',
      nombrePlan: 'Fondo exclusivo',
      condiciones: `Cartera a medida para grandes empresas. Se evalúa caso por caso. ${notaComision}`,
    }),
  ]
}

export async function extraerBnaFal() {
  const texto = await fetchTextoFal(BNA_FAL_URL, log)
  const filas = parsearBnaFal(texto)

  logMensaje(log, 'BNA FAL parseado', { filas: filas.length })

  return filas
}
