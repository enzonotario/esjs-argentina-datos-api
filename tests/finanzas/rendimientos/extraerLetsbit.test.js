import { describe, expect, it } from 'vitest'
import { extraerLetsbit } from '@/finanzas/rendimientos/extraerLetsbit.esjs'

describe('extraerLetsbit', () => {
  it('extrae los rendimientos', async () => {
    const items = await extraerLetsbit()

    expect(items.length).toBeGreaterThan(0)

    for (const item of items) {
      expect(item.moneda).toBeTypeOf('string')
      expect(item.apy).toBeTypeOf('number')
      expect(item.fecha).toBeTypeOf('string')
    }
  })
})
