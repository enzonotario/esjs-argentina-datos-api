
import { describe, expect, it } from 'vitest'
import { extraerRiesgoPais } from '@/finanzas/riesgoPais/extraerRiesgoPais.esjs'
import riesgoPais from '@/finanzas/riesgoPais/riesgoPais.comando.esjs'

describe('riesgoPais', () => {
  it('extraer valores', async () => {
    const riesgoPais = await extraerRiesgoPais(
      new Date('2024-01-01'),
      new Date('2024-12-31')
    )

    expect(riesgoPais).toMatchSnapshot()
  })

  it('comando', async () => {
    const rutasGuardadas = await riesgoPais()

    expect(rutasGuardadas).toMatchSnapshot()
  })
})
