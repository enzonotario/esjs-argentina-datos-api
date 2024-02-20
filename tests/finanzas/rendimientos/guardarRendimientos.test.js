import { describe, expect, it } from 'vitest'
import { leerRuta } from '@/utils/rutas.esjs'
import { guardarRendimientos } from '@/finanzas/rendimientos/guardarRendimientos.esjs'
import { extraerBuenbit } from '@/finanzas/rendimientos/extraerBuenbit.esjs'
import { extraerFiwind } from '@/finanzas/rendimientos/extraerFiwind.esjs'
import { extraerLetsbit } from '@/finanzas/rendimientos/extraerLetsbit.esjs'
import { extraerBelo } from '@/finanzas/rendimientos/extraerBelo.esjs'
import { extraerLemoncash } from '@/finanzas/rendimientos/extraerLemoncash.esjs'

describe('guardarRendimientos', () => {
  it('guarda buenbit', async () => {
    const entidad = 'buenbit'

    const items = await extraerBuenbit()

    const esperado = await guardarRendimientos(entidad, items)

    expect(esperado).toBeDefined()

    const guardado = await leerRuta(`/finanzas/rendimientos/${entidad}`)

    for (const item of items) {
      expect(guardado).toContainEqual(item)
    }
  })

  it('guarda fiwind', async () => {
    const entidad = 'fiwind'

    const items = await extraerFiwind()

    const esperado = await guardarRendimientos(entidad, items)

    expect(esperado).toBeDefined()

    const guardado = await leerRuta(`/finanzas/rendimientos/${entidad}`)

    for (const item of items) {
      expect(guardado).toContainEqual(item)
    }
  })

  it('guarda letsbit', async () => {
    const entidad = 'letsbit'

    const items = await extraerLetsbit()

    const esperado = await guardarRendimientos(entidad, items)

    expect(esperado).toBeDefined()

    const guardado = await leerRuta(`/finanzas/rendimientos/${entidad}`)

    for (const item of items) {
      expect(guardado).toContainEqual(item)
    }
  })

  it('guarda belo', async () => {
    const entidad = 'belo'

    const items = await extraerBelo()

    const esperado = await guardarRendimientos(entidad, items)

    expect(esperado).toBeDefined()

    const guardado = await leerRuta(`/finanzas/rendimientos/${entidad}`)

    for (const item of items) {
      expect(guardado).toContainEqual(item)
    }
  })

  it('guarda lemoncash', async () => {
    const entidad = 'lemoncash'

    const items = await extraerLemoncash()

    const esperado = await guardarRendimientos(entidad, items)

    expect(esperado).toBeDefined()

    const guardado = await leerRuta(`/finanzas/rendimientos/${entidad}`)

    for (const item of items) {
      expect(guardado).toContainEqual(item)
    }
  })
})
