import { describe, expect, it } from 'vitest'
import { extraerMercadoDinero } from '@/finanzas/fci/extraerMercadoDinero.esjs'

describe('extrearFci', () => {
  it('extrae los fci', async () => {
    const items = await extraerMercadoDinero('2024-01-02')

    expect(items).toMatchSnapshot()
  })
})
