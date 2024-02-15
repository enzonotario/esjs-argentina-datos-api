import { describe, expect, it } from 'vitest'
import { extraerFiwind } from '@/finanzas/rendimientos/extraerFiwind.esjs'
// import { guardarRendimientos } from '@/finanzas/rendimientos/guardarRendimientos.esjs'

describe('extraerFiwind', () => {
  it('extrae los rendimientos', async () => {
    try {
      const items = await extraerFiwind()

      expect(items).toMatchSnapshot()
    } catch (error) {
      console.error(error)
    }
  })
})
