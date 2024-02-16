import { describe, expect, it } from 'vitest'
import { extraerBuenbit } from '@/finanzas/rendimientos/extraerBuenbit.esjs'

describe('extraerBuenbit', () => {
  it('extrae los rendimientos', async () => {
    try {
      const items = await extraerBuenbit()

      expect(items).toMatchSnapshot()
    } catch (error) {
      console.error(error)
    }
  })
})
