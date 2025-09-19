import { describe, expect, it } from 'vitest'
import { extraerUalaCuentaRemunerada } from '@/finanzas/extraccion/extraerUala.esjs'

describe('extraerUala', () => {
  it('extrae Uala Cuenta Remunerada correctamente', async () => {
    const resultado = await extraerUalaCuentaRemunerada()

    expect(resultado.length).toBe(2)
    expect(resultado[0]).toMatchObject({
      fecha: expect.any(String),
      fondo: 'UALA',
      tea: expect.any(Number),
      tna: expect.any(Number),
      tope: expect.any(Number),
    })
    expect(resultado[1]).toMatchObject({
      fecha: expect.any(String),
      fondo: 'UALA PLUS',
      tea: expect.any(Number),
      tna: expect.any(Number),
      tope: expect.any(Number),
      condiciones: expect.any(String),
      condicionesCorto: expect.any(String),
    })
  }, {
    timeout: 30000,
  })
})
