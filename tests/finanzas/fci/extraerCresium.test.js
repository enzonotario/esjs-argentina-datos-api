import { describe, expect, it } from 'vitest'
import { extraerCresiumCuentaRemunerada } from '@/finanzas/extraccion/extraerCresium.esjs'

describe('extraerCresium', () => {
  it('extrae Cresium Cuenta Remunerada correctamente', async () => {
    const resultado = await extraerCresiumCuentaRemunerada()

    expect(resultado).toMatchObject({
      fecha: expect.any(String),
      fondo: 'CRESIUM',
      tea: expect.any(Number),
      tna: expect.any(Number),
      tope: null,
      condiciones: null,
      condicionesCorto: expect.any(String),
    })
  }, {
    timeout: 10000,
  })
})
