import { describe, expect, it } from 'vitest'
import { extraerBrubankCuentaRemunerada } from '@/finanzas/extraccion/extraerBrubank.esjs'

describe('extraerBrubank', () => {
  it('extrae Brubank Cuenta Remunerada correctamente', async () => {
    const resultado = await extraerBrubankCuentaRemunerada()

    expect(resultado).toMatchObject({
      fecha: expect.any(String),
      fondo: 'BRUBANK',
      tea: expect.any(Number),
      tna: expect.any(Number),
      tope: resultado.tope ? expect.any(Number) : null,
    })
  })
})
