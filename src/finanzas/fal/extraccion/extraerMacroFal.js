import { logGrupo, logMensaje } from '@/log.js'
import { crearAlternativaFal } from './crearAlternativaFal.js'
import { fetchTextoFal } from './fetchTextoFal.js'

export const MACRO_FAL_URL =
  'https://www.macro.com.ar/empresas/inversiones/fondo-asistencia-laboral'

const log = logGrupo({
  fuente: 'extraerMacroFal',
  tipo: 'extraccion',
})

/**
 * @param {string} texto
 */
export function parsearMacroFal(texto) {
  const t = String(texto)
  const esFal =
    /Macro Fondos/i.test(t) && /Fondo de Asistencia Laboral/i.test(t)

  if (!esFal) return []

  const aperturaSinCosto = /alta en Banco Macro no tienen costo/i.test(t)
  const citaTopeLegal =
    /comisi[oó]n anual de gesti[oó]n m[aá]xima del 1\s*%/i.test(t)

  return [
    crearAlternativaFal({
      entidad: 'macro',
      nombreComercial: 'Banco Macro',
      sociedadGerente: 'Macro Fondos',
      canal: /Banca Internet Empresas/i.test(t) ? 'banca_empresas' : null,
      vigenciaDeclarada: /1 de diciembre de 2026/i.test(t)
        ? '2026-12-01'
        : null,
      enlace: MACRO_FAL_URL,
      condiciones: [
        aperturaSinCosto ? 'La apertura y el alta no tienen costo.' : null,
        citaTopeLegal
          ? 'La página cita el tope legal del 1% anual y no publica la comisión propia.'
          : 'La página no publica la comisión de administración.',
      ]
        .filter(Boolean)
        .join(' '),
      metadata: {
        fuenteUrl: MACRO_FAL_URL,
        ...(aperturaSinCosto ? { aperturaSinCosto: true } : {}),
        ...(citaTopeLegal ? { topeLegalAnual: 0.01 } : {}),
      },
    }),
  ]
}

export async function extraerMacroFal() {
  const texto = await fetchTextoFal(MACRO_FAL_URL, log)
  const filas = parsearMacroFal(texto)

  logMensaje(log, 'Macro FAL parseado', { filas: filas.length })

  return filas
}
