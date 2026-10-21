import { logGrupo, logMensaje } from '@/log.js'
import { crearAlternativaFal } from './crearAlternativaFal.js'
import { fetchTextoFal } from './fetchTextoFal.js'

export const IEB_FAL_URL = 'https://fondofal.com.ar/'

const log = logGrupo({
  fuente: 'extraerIebFal',
  tipo: 'extraccion',
})

/**
 * @param {string} texto
 */
export function parsearIebFal(texto) {
  const t = String(texto)
  const esIeb =
    /\bIEB\b/.test(t) &&
    /Fondo Com[uú]n de Inversi[oó]n/i.test(t) &&
    /noviembre de 2026/i.test(t) &&
    /Fondo de Asistencia Laboral|FAL/i.test(t)

  if (!esIeb) return []

  return [
    crearAlternativaFal({
      entidad: 'ieb',
      nombreComercial: 'IEB',
      vehiculo: 'fci_abierto',
      canal: /whatsapp|formulario/i.test(t) ? 'formulario' : null,
      vigenciaDeclarada: '2026-11-01',
      enlace: IEB_FAL_URL,
      condiciones: 'La página no publica la comisión de administración.',
      metadata: {
        fuenteUrl: IEB_FAL_URL,
      },
    }),
  ]
}

export async function extraerIebFal() {
  const texto = await fetchTextoFal(IEB_FAL_URL, log)
  const filas = parsearIebFal(texto)

  logMensaje(log, 'IEB FAL parseado', { filas: filas.length })

  return filas
}
