import { describe, expect, it, vi } from 'vitest'
import { extraerCuentasRemuneradasUsd } from '@/finanzas/cuentas-remuneradas-usd/extraccion/extraerCuentasRemuneradasUsd.esjs'
import * as galicia from '@/finanzas/cuentas-remuneradas-usd/extraccion/extraerGalicia.esjs'
import * as supervielle from '@/finanzas/cuentas-remuneradas-usd/extraccion/extraerSupervielle.esjs'
import * as bna from '@/finanzas/cuentas-remuneradas-usd/extraccion/extraerBna.esjs'

describe('extraerCuentasRemuneradasUsd', () => {
  it('extrae datos de todas las entidades', async () => {
    vi.spyOn(galicia, 'extraerGalicia').mockResolvedValue([
      { entidad: 'galicia', tasa: 3.5, tope: 10000 },
    ])

    vi.spyOn(supervielle, 'extraerSupervielle').mockResolvedValue([
      { entidad: 'supervielle', tasa: 4.0, tope: 15000 },
    ])

    vi.spyOn(bna, 'extraerBna').mockResolvedValue([
      { entidad: 'bna', tasa: 3.0, tope: 20000 },
    ])

    const resultado = await extraerCuentasRemuneradasUsd()

    expect(resultado).toHaveLength(3)
    expect(resultado).toContainEqual({
      entidad: 'galicia',
      tasa: 3.5,
      tope: 10000,
    })
    expect(resultado).toContainEqual({
      entidad: 'supervielle',
      tasa: 4.0,
      tope: 15000,
    })
    expect(resultado).toContainEqual({
      entidad: 'bna',
      tasa: 3.0,
      tope: 20000,
    })
  })

  it('retorna solo datos exitosos si una extraccion falla', async () => {
    vi.spyOn(galicia, 'extraerGalicia').mockResolvedValue([
      { entidad: 'galicia', tasa: 3.5, tope: 10000 },
    ])

    vi.spyOn(supervielle, 'extraerSupervielle').mockResolvedValue([])

    vi.spyOn(bna, 'extraerBna').mockResolvedValue([])

    const resultado = await extraerCuentasRemuneradasUsd()

    expect(resultado).toHaveLength(1)
    expect(resultado[0]).toEqual({
      entidad: 'galicia',
      tasa: 3.5,
      tope: 10000,
    })
  })
})
