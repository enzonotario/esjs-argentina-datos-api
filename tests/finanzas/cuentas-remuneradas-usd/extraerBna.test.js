import { describe, expect, it, vi } from 'vitest'
import { extraerBna } from '@/finanzas/cuentas-remuneradas-usd/extraccion/extraerBna.esjs'
import * as firecrawl from '@/finanzas/extraccion/firecrawl.esjs'

describe('extraerBna', () => {
  it('extrae datos correctamente de BNA', async () => {
    vi.spyOn(firecrawl, 'scrapearConFirecrawl').mockResolvedValue({
      tasa: 3.0,
      tope: 20000,
    })

    const resultado = await extraerBna()

    expect(resultado).toHaveLength(1)
    expect(resultado[0]).toEqual({
      entidad: 'BNA',
      tasa: 3.0,
      tope: 20000,
    })
  })

  it('retorna array vacio si no hay datos', async () => {
    vi.spyOn(firecrawl, 'scrapearConFirecrawl').mockResolvedValue({})

    const resultado = await extraerBna()

    expect(resultado).toEqual([])
  })

  it('retorna array vacio si hay error', async () => {
    vi.spyOn(firecrawl, 'scrapearConFirecrawl').mockRejectedValue(
      new Error('Network error'),
    )

    const resultado = await extraerBna()

    expect(resultado).toEqual([])
  })

  it('retorna array vacio si la tasa no es un numero', async () => {
    vi.spyOn(firecrawl, 'scrapearConFirecrawl').mockResolvedValue({
      tasa: 'invalid',
    })

    const resultado = await extraerBna()

    expect(resultado).toEqual([])
  })
})
