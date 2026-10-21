import axios from 'axios'
import pdf from 'pdf-parse/lib/pdf-parse.js'
import { logGrupo, logError, logMensaje } from '@/log.js'
import { crearAlternativaFal } from './crearAlternativaFal.js'
import { textoPlano } from './fetchTextoFal.js'

export const GALICIA_FAL_URL =
  'https://www.fondosfima.com.ar/content/dam/galicia/fima/arbol-pdf/footer/FAL%20-%20Banco%20Galicia.pdf'

const log = logGrupo({
  fuente: 'extraerGaliciaFal',
  tipo: 'extraccion',
})

/**
 * @param {string} texto
 */
export function parsearGaliciaFal(texto) {
  const t = textoPlano(texto)
  const esGalicia =
    /Galicia Asset Management/i.test(t) &&
    /Fondo de Asistencia Laboral|\bFAL\b/i.test(t)

  if (!esGalicia) return []

  const enDefinicion = /est[aá] en definici[oó]n/i.test(t)
  const citaTopeLegal = /tope de honorarios/i.test(t) && /1\s*%/.test(t)

  if (!enDefinicion && !citaTopeLegal) return []

  return [
    crearAlternativaFal({
      entidad: 'galicia',
      nombreComercial: 'Galicia',
      vehiculo: /fondos comunes de inversi[oó]n|AA PIC FCI/i.test(t)
        ? 'fci_abierto'
        : null,
      sociedadGerente: /Galicia Asset Management S\.A\.U\./i.test(t)
        ? 'Galicia Asset Management S.A.U.'
        : 'Galicia Asset Management',
      sociedadDepositaria: /Banco de Galicia y Buenos Aires S\.A\./i.test(t)
        ? 'Banco de Galicia y Buenos Aires S.A.'
        : null,
      canal: /Office Banking|Galicia Empresas/i.test(t)
        ? 'banca_empresas'
        : null,
      enlace: GALICIA_FAL_URL,
      condiciones: enDefinicion
        ? 'Galicia informa que su porcentaje está en definición. El documento cita el tope legal del 1% anual.'
        : 'El documento cita el tope legal y no publica el porcentaje propio.',
      metadata: {
        fuenteUrl: GALICIA_FAL_URL,
        ...(enDefinicion ? { comisionEnDefinicion: true } : {}),
        ...(citaTopeLegal ? { topeLegalAnual: 0.01 } : {}),
      },
    }),
  ]
}

async function fetchPdf() {
  const respuesta = await axios.get(GALICIA_FAL_URL, {
    responseType: 'arraybuffer',
    timeout: 30000,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      Accept: 'application/pdf,*/*',
    },
  })

  return Buffer.from(respuesta.data)
}

export async function extraerGaliciaFal() {
  try {
    const buffer = await fetchPdf()
    const parsed = await pdf(buffer)
    const filas = parsearGaliciaFal(parsed.text || '')

    logMensaje(log, 'Galicia FAL parseado', { filas: filas.length })

    return filas
  } catch (error) {
    logError(log, error)
    throw error
  }
}
