import { describe, expect, it } from 'vitest'
import { leerRuta } from '@/utils/rutas.esjs'
import { extraerCreditosHipotecariosUva } from '@/finanzas/creditosHipotecariosUva/extraccion/extraerCreditosHipotecariosUva.esjs'
import { guardarCreditosHipotecariosUva } from '@/finanzas/creditosHipotecariosUva/guardado/guardarCreditosHipotecariosUva.esjs'

describe('guardarCreditosHipotecariosUva', () => {
  it('guarda los créditos hipotecarios UVA', async () => {
    const items = await extraerCreditosHipotecariosUva()

    expect(items.length).toBeGreaterThan(0)

    const esperado = await guardarCreditosHipotecariosUva(items)

    expect(esperado).toBeDefined()

    const guardado = await leerRuta('/finanzas/creditos/hipotecariosUva')

    for (const item of items) {
      expect(guardado).toContainEqual(item)
    }
  })
})

