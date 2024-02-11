import { describe, expect, it } from 'vitest'
import { leerRuta } from '@/utils/rutas.esjs'
import { extraerTasasDepositos30Dias } from '@/finanzas/extraccion/extraerTasasDepositos30Dias.esjs'
import { guardarTasasDepositos30Dias } from '@/finanzas/guardado/guardarTasasDepositos30Dias.esjs'
import { format, subDays, addDays } from 'date-fns'

describe('guardarDepositos30Dias', () => {
  it('guarda los depósitos a 30 días', async () => {
    const items = await extraerTasasDepositos30Dias(
      format(subDays(new Date(), 7), 'yyyy-MM-dd'),
      format(addDays(new Date(), 1), 'yyyy-MM-dd')
    )

    expect(items.length).toBeGreaterThan(0)

    const esperado = await guardarTasasDepositos30Dias(items)

    expect(esperado).toBeDefined()

    const guardado = await leerRuta('/finanzas/tasas/depositos30Dias')

    for (const item of items) {
      expect(guardado).toContainEqual(item)
    }
  })
})
