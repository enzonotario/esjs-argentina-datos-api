import { describe, expect, it } from 'vitest'
import { extraerIndiceUVA } from '@/finanzas/extraccion/extraerIndiceUVA.esjs'

describe('extraerIndiceUVA', () => {
  it('extrae los indices UVA', async () => {
    const items = await extraerIndiceUVA(
      '2023-01-01',
      '2024-01-01'
    )

    expect(items).toMatchSnapshot()
  })
})
