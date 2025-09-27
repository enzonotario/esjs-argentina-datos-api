import { describe, expect, it } from 'vitest'
import { extraerCarrefourCuentaRemunerada } from '@/finanzas/extraccion/extraerCarrefour.esjs'

describe('extraerCarrefour', () => {
  it('extrae Carrefour Cuenta Remunerada correctamente', async () => {
    const resultado = await extraerCarrefourCuentaRemunerada()

    expect(resultado).toMatchObject({
      fecha: expect.any(String),
      fondo: 'CARREFOUR',
      tea: expect.any(Number),
      tna: expect.any(Number),
      tope: expect.toBeOneOf([null, expect.any(Number)]),
    })
  }, {
    timeout: 10000,
  })
})
