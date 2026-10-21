import { logGrupo, logMensaje } from '@/log.js'
import { crearAlternativaFal } from './crearAlternativaFal.js'
import { fetchTextoFal } from './fetchTextoFal.js'

export const MARIVA_FAL_URL = 'https://www.marivafondos.com.ar/fal/'

const log = logGrupo({
  fuente: 'extraerMarivaFal',
  tipo: 'extraccion',
})

/**
 * @param {string} texto
 */
export function parsearMarivaFal(texto) {
  const t = String(texto)

  if (!/Mariva Asset Management/i.test(t) || !/Banco Mariva/i.test(t)) {
    return []
  }

  if (!/Fondo de Asistencia Laboral|fondo FAL/i.test(t)) return []

  return [
    crearAlternativaFal({
      entidad: 'mariva',
      nombreComercial: 'Mariva',
      vehiculo: 'fci_abierto',
      sociedadGerente: 'Mariva Asset Management S.A.U. S.G.F.C.I.',
      sociedadDepositaria: 'Banco Mariva S.A.',
      canal: /whatsapp|e-mail|email/i.test(t) ? 'formulario' : null,
      vigenciaDeclarada: /noviembre de 2026/i.test(t) ? '2026-11-01' : null,
      enlace: MARIVA_FAL_URL,
      condiciones:
        'La página no publica la comisión. Dice que gastos, comisiones y honorarios se informan en las oficinas y en los sitios de Mariva.',
      metadata: {
        fuenteUrl: MARIVA_FAL_URL,
      },
    }),
  ]
}

export async function extraerMarivaFal() {
  const texto = await fetchTextoFal(MARIVA_FAL_URL, log)
  const filas = parsearMarivaFal(texto)

  logMensaje(log, 'Mariva FAL parseado', { filas: filas.length })

  return filas
}
