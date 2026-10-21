/**
 * Fila comparable de una alternativa FAL.
 * Las tasas van en decimal (0.008 = 0,8% anual).
 * `comisionAnual` queda null cuando la fuente no publica la comisión propia.
 * El tope legal del 1% no se copia a `comisionAnual`.
 *
 * @param {object} input
 */
export function crearAlternativaFal(input) {
  if (!input?.entidad || !input?.nombreComercial) {
    throw new Error('Alternativa FAL sin entidad o nombreComercial')
  }

  return {
    entidad: input.entidad,
    nombreComercial: input.nombreComercial,
    plan: input.plan ?? null,
    nombrePlan: input.nombrePlan ?? null,
    vehiculo: input.vehiculo ?? null,
    sociedadGerente: input.sociedadGerente ?? null,
    sociedadDepositaria: input.sociedadDepositaria ?? null,
    comisionAnual: input.comisionAnual ?? null,
    comisionEsTope: Boolean(input.comisionEsTope),
    incluyeIva: input.incluyeIva ?? null,
    ivaAdicional: input.ivaAdicional ?? null,
    comisionVigenciaHasta: input.comisionVigenciaHasta ?? null,
    comisionPosteriorAnual: input.comisionPosteriorAnual ?? null,
    horizonte: input.horizonte ?? null,
    vidaPromedioMesesMin: input.vidaPromedioMesesMin ?? null,
    vidaPromedioMesesMax: input.vidaPromedioMesesMax ?? null,
    moneda: input.moneda ?? 'ARS',
    reintegroAportes: input.reintegroAportes ?? null,
    canal: input.canal ?? null,
    vigenciaDeclarada: input.vigenciaDeclarada ?? null,
    enlace: input.enlace ?? null,
    condiciones: input.condiciones ?? null,
    metadata: input.metadata ?? null,
  }
}
