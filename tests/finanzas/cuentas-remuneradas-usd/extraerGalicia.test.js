import { describe, expect, it, vi } from 'vitest'
import { extraerGalicia } from '@/finanzas/cuentas-remuneradas-usd/extraccion/extraerGalicia.esjs'
import * as firecrawl from '@/finanzas/extraccion/firecrawl.esjs'

describe('extraerGalicia', () => {
  it('extrae datos correctamente de Galicia', async () => {
    vi.spyOn(firecrawl, 'scrapearConFirecrawl').mockResolvedValue({
      tasa: 3.5,
      tope: 10000,
    })

    const resultado = await extraerGalicia()

    expect(resultado).toHaveLength(1)
    expect(resultado[0]).toEqual({
      entidad: 'galicia',
      tasa: 3.5,
      tope: 10000,
    })
  })

  it('retorna array vacio si no hay datos', async () => {
    vi.spyOn(firecrawl, 'scrapearConFirecrawl').mockResolvedValue({})

    const resultado = await extraerGalicia()

    expect(resultado).toEqual([])
  })

  it('retorna array vacio si hay error', async () => {
    vi.spyOn(firecrawl, 'scrapearConFirecrawl').mockRejectedValue(
      new Error('Network error'),
    )

    const resultado = await extraerGalicia()

    expect(resultado).toEqual([])
  })

  it('retorna array vacio si la tasa no es un numero', async () => {
    vi.spyOn(firecrawl, 'scrapearConFirecrawl').mockResolvedValue({
      tasa: 'invalid',
    })

    const resultado = await extraerGalicia()

    expect(resultado).toEqual([])
  })
})
