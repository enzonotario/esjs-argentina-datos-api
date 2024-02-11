import { describe, expect, it } from 'vitest'
import { extraerInflaciones } from '@/finanzas/extraccion/extraerInflaciones.esjs'

describe('extraerInflaciones', () => {
  it('extrae los inflaciones del año', async () => {
    const inflaciones = await extraerInflaciones('2000-01-01', '2023-12-31')

    expect(inflaciones).toMatchSnapshot()
  })
})
