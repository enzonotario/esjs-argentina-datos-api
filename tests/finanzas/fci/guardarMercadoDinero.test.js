import { describe, expect, it } from 'vitest'
import { leerRuta } from '@/utils/rutas.esjs'
import { extraerMercadoDinero } from '@/finanzas/fci/extraerMercadoDinero.esjs'
import { guardarMercadoDinero } from '@/finanzas/fci/guardarMercadoDinero.esjs'
import { format, subDays, addDays, isBefore, parseISO } from 'date-fns'

describe('guardarMercadoDinero', () => {
  it('guarda los fci', async () => {
      const start = subDays(new Date(), 7)
      const end = addDays(new Date(), 1)
      let date = start

      while (isBefore(date, end)) {
        const items = await extraerMercadoDinero(format(date, 'yyyy-MM-dd'))

        const esperado = await guardarMercadoDinero(items, date)

        expect(esperado).toBeDefined()

        const guardado = await leerRuta(
          `/finanzas/fci/mercadoDinero/${format(date, 'yyyy/MM/dd')}`,
        )

        for (const item of items) {
          expect(guardado).toContainEqual(item)
        }

        date = addDays(date, 1)
      }
  }, {
      timeout: 1000 * 60 * 60 * 24 * 7, // 7 days
  })
})
