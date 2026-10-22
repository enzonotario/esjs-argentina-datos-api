import { logGrupo, logMensaje } from '@/log.js'
import { crearAlternativaFal } from './crearAlternativaFal.js'
import { fetchTextoFal } from './fetchTextoFal.js'

export const GST_FAL_URL =
  'https://www.grupost.com.ar/fondo-de-asistencia-laboral/'

const log = logGrupo({
  fuente: 'extraerGstFal',
  tipo: 'extraccion',
})

/**
 * @param {string} texto
 */
export function parsearGstFal(texto) {
  const t = String(texto)
  const gerente = t.match(/Mega QM S\.A\./)
  const depositaria = t.match(/Banco de Servicios y Transacciones S\.A\.U\./)
  const esGst =
    gerente &&
    depositaria &&
    /MEGAQM ASISTENCIA FCIA FAL/i.test(t) &&
    /MEGAQM COBERTURA FCIA FAL/i.test(t) &&
    /Fondo de Asistencia Laboral dedicado/i.test(t) &&
    /Fondo Com[uú]n de Inversi[oó]n/i.test(t)

  if (!esGst) return []

  const base = {
    entidad: 'gst',
    nombreComercial: 'Grupo ST',
    vehiculo: 'fci_abierto',
    sociedadGerente: gerente[0],
    sociedadDepositaria: depositaria[0],
    canal: /contactanos|solicitar informaci[oó]n/i.test(t) ? 'formulario' : null,
    vigenciaDeclarada: /1\s*dic\s*26|1\s*[°º]?\s*de diciembre de 2026/i.test(t)
      ? '2026-12-01'
      : null,
    enlace: GST_FAL_URL,
    metadata: { fuenteUrl: GST_FAL_URL },
  }

  return [
    crearAlternativaFal({
      ...base,
      plan: 'asistencia-tamar',
      nombrePlan: 'MEGAQM Asistencia FCIA FAL',
      horizonte: 'corto_plazo',
      condiciones:
        'Cartera teórica de liquidez y tasa, con baja duration. La página no publica la comisión de administración.',
    }),
    crearAlternativaFal({
      ...base,
      plan: 'cobertura-cer',
      nombrePlan: 'MEGAQM Cobertura FCIA FAL',
      horizonte: 'inflacion',
      condiciones:
        'Cartera teórica con ajuste por inflación y horizonte medio. La página no publica la comisión de administración.',
    }),
    crearAlternativaFal({
      ...base,
      plan: 'dedicado',
      nombrePlan: 'FAL dedicado',
      condiciones:
        'Política de inversión a medida para grandes empresas. TEA, duration y TIR quedan ad hoc. La página no publica la comisión de administración.',
    }),
  ]
}

export async function extraerGstFal() {
  const texto = await fetchTextoFal(GST_FAL_URL, log)
  const filas = parsearGstFal(texto)

  logMensaje(log, 'GST FAL parseado', { filas: filas.length })

  return filas
}
