import { describe, expect, it } from 'vitest'
import { extraerPlazoFijo } from '@/finanzas/extraccion/extraerPlazoFijo.esjs'

describe('extraerPlazoFijo', () => {
  it('extrae los plazos fijos', async () => {
    const items = await extraerPlazoFijo()

    expect(items).toMatchSnapshot()
  })
})
