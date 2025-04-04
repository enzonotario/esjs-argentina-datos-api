import { describe, expect, it } from 'vitest'
import { extraerUalaCuentaRemunerada } from '@/finanzas/extraccion/extraerUala.esjs'

describe('extraerUala', () => {
  it('extrae Uala Cuenta Remunerada correctamente', async () => {
    const resultado = await extraerUalaCuentaRemunerada()

    expect(resultado).toMatchObject({
      fecha: expect.any(String),
      fondo: 'UALA',
      tea: expect.any(Number),
      tna: expect.any(Number),
      tope: expect.any(Number),
    })
  })
})
