import { describe, expect, it } from 'vitest'
import { leerRuta } from '@/utils/rutas.esjs'
import { guardarRendimientos } from '@/finanzas/rendimientos/guardarRendimientos.esjs'
import { extraerBuenbit } from '@/finanzas/rendimientos/extraerBuenbit.esjs'
import { extraerFiwind } from '@/finanzas/rendimientos/extraerFiwind.esjs'
import { extraerLetsbit } from '@/finanzas/rendimientos/extraerLetsbit.esjs'
import { extraerBelo } from '@/finanzas/rendimientos/extraerBelo.esjs'
import { extraerLemoncash } from '@/finanzas/rendimientos/extraerLemoncash.esjs'
import { extraerRipio } from '@/finanzas/rendimientos/extraerRipio.esjs'
import { extraerSatoshiTango } from '@/finanzas/rendimientos/extraerSatoshiTango.esjs'

async function testGuardarRendimientos(entidad, funcionExtraccion) {
  const items = await funcionExtraccion()

  const esperado = await guardarRendimientos(entidad, items)

  expect(esperado).toBeDefined()

  const guardado = await leerRuta(`/finanzas/rendimientos/${entidad}`)

  for (const item of items) {
    expect(guardado).toContainEqual(item)
  }
}

describe('guardarRendimientos', () => {
  it('guarda buenbit', async () => {
    await testGuardarRendimientos('buenbit', extraerBuenbit)
  })

  it('guarda fiwind', async () => {
    await testGuardarRendimientos('fiwind', extraerFiwind)
  })

  it('guarda letsbit', async () => {
    await testGuardarRendimientos('letsbit', extraerLetsbit)
  })

  it('guarda belo', async () => {
    await testGuardarRendimientos('belo', extraerBelo)
  })

  it('guarda lemoncash', async () => {
    await testGuardarRendimientos('lemoncash', extraerLemoncash)
  })

  it('guarda ripio', async () => {
    await testGuardarRendimientos('ripio', extraerRipio)
  })

  it('guarda satoshitango', async () => {
    await testGuardarRendimientos('satoshitango', extraerSatoshiTango)
  })
})
