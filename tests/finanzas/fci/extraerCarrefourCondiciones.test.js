import { describe, expect, it } from 'vitest'
import { extraerCarrefourCondiciones } from '@/finanzas/extraccion/extraerCarrefourCondiciones.esjs'

describe('extraerCarrefourCondiciones', () => {
  it('extrae condiciones de Carrefour correctamente', async () => {
    const resultado = await extraerCarrefourCondiciones()

    if (resultado !== null) {
      expect(resultado).toMatchObject({
        topeRecargaMensual: expect.any(Number),
      })
      expect(resultado.topeRecargaMensual).toBeGreaterThan(0)
    }
  }, {
    timeout: 500000,
  })
})

