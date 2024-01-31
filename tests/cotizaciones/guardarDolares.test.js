import { describe, expect, it } from 'vitest'
import { format } from 'date-fns'
import { extraerDolares } from '@/cotizaciones/extraccion/extraerDolares.esjs'
import { guardarDolares } from '@/cotizaciones/guardado/guardarDolares.esjs'
import { leerRuta } from '@/utils/rutas.esjs'

describe('guardarDolares', () => {
  it('guarda dolares de hoy', async () => {
    const dolares = await extraerDolares()

    expect(dolares.length).toBeGreaterThan(0)

    await guardarDolares(dolares, new Date())

    const guardado = await leerRuta(
      `/cotizaciones/dolares/${format(new Date(), 'yyyy/MM/dd')}`,
    )

    expect(guardado).toEqual(dolares)

    dolares.map(async (dolar) => {
      expect(
        await leerRuta(
          `/cotizaciones/dolares/${dolar.casa}/${format(
            new Date(),
            'yyyy/MM/dd',
          )}`,
        ),
      ).toEqual(dolar)
    })
  })
})
