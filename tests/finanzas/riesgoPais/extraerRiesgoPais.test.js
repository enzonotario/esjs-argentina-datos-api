
import { describe, expect, it } from 'vitest'
import { extraerRiesgoPais } from '@/finanzas/riesgoPais/extraerRiesgoPais.esjs'

describe('riesgoPais', () => {
  it('extrae riesgo pais', async () => {
    const riesgoPais = await extraerRiesgoPais()

    expect(riesgoPais).toBeGreaterThan(0)
  })
})
