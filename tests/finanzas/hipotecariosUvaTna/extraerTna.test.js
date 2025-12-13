import { describe, expect, it } from 'vitest'
import { extraerTna } from '@/finanzas/hipotecariosUva/extraccion/extraerTna.esjs'

describe('extraerTna', () => {
  it('extrae todos los datos hardcodeados correctamente', () => {
    const resultado = extraerTna()

    expect(resultado).toHaveLength(14)
    expect(resultado[0]).toEqual({
      entidad: 'BANCO NACIÓN ARGENTINA',
      nombreComercial: 'Banco Nación',
      tnaPorcentaje: 6,
    })
    expect(resultado[13]).toEqual({
      entidad: 'BANCO GALICIA',
      nombreComercial: 'Banco Galicia',
      tnaPorcentaje: 15,
    })
  })

  it('retorna datos con estructura correcta', () => {
    const resultado = extraerTna()

    resultado.forEach(item => {
      expect(item).toHaveProperty('entidad')
      expect(item).toHaveProperty('nombreComercial')
      expect(item).toHaveProperty('tnaPorcentaje')
      expect(typeof item.entidad).toBe('string')
      expect(typeof item.nombreComercial).toBe('string')
      expect(typeof item.tnaPorcentaje).toBe('number')
    })
  })

  it('incluye todas las entidades requeridas', () => {
    const resultado = extraerTna()
    const entidades = resultado.map(r => r.entidad)

    expect(entidades).toContain('BANCO NACIÓN ARGENTINA')
    expect(entidades).toContain('BANCO BBVA ARGENTINA')
    expect(entidades).toContain('BANCO DEL SOL')
    expect(entidades).toContain('BANCO CIUDAD')
    expect(entidades).toContain('BANCO COMAFI')
    expect(entidades).toContain('BANCO ICBC')
    expect(entidades).toContain('BRUBANK')
    expect(entidades).toContain('BANCO CREDICOOP')
    expect(entidades).toContain('BANCO HIPOTECARIO')
    expect(entidades).toContain('BANCO PATAGONIA')
    expect(entidades).toContain('BANCO SUPERVIELLE')
    expect(entidades).toContain('BANCO SANTANDER')
    expect(entidades).toContain('BANCO MACRO')
    expect(entidades).toContain('BANCO GALICIA')
  })
})

