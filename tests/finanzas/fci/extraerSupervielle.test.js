import { describe, expect, it } from 'vitest'
import { extraerSupervielleCuentaRemunerada } from '@/finanzas/extraccion/extraerSupervielle.esjs'

describe('extraerSupervielle', () => {
  it('extrae Supervielle Cuenta Remunerada correctamente', async () => {
    const resultado = await extraerSupervielleCuentaRemunerada()

    expect(resultado).toMatchObject({
      fecha: expect.any(String),
      fondo: 'SUPERVIELLE',
      tea: expect.any(Number),
      tna: expect.any(Number),
      tope: expect.any(Number),
    })
  }, {
    timeout: 10000,
  })
})
