import { describe, expect, it } from 'vitest'
import { format, parseISO } from 'date-fns'
import { leerRuta, escribirRuta } from '@/datos/rutas.esjs'
import { collect } from 'collect.js'

describe('comprobarDolares', () => {
  it('comprueba que los dolares de `/dolares/index.json` estén guardados en `/dolares/:casa/:fecha/index.json`', async () => {
    const dolares = await leerRuta('/cotizaciones/dolares')

    expect(dolares.length).toBeGreaterThan(0)

    collect(dolares)
      .groupBy('casa')
      .map(async (dolaresPorCasa) => {
        dolaresPorCasa.map(async (dolar) => {
          const guardado = await leerRuta(
            `/cotizaciones/dolares/${dolar.casa}/${format(
              parseISO(dolar.fecha),
              'yyyy/MM/dd',
            )}`,
          )

          if (!guardado) {
            throw new Error(`No se guardó ${dolar.casa} ${dolar.fecha}`)
          }

          expect(guardado).toEqual(dolar)
        })
      })
  })

  it('comprueba que los dolares de `/dolares/index.json` estén guardados en `/dolares/:fecha/index.json`', async () => {
    const dolares = await leerRuta('/cotizaciones/dolares')

    expect(dolares.length).toBeGreaterThan(0)

    collect(dolares)
      .groupBy('fecha')
      .map(async (dolaresPorFecha, fecha) => {
        const guardado = await leerRuta(
          `/cotizaciones/dolares/${format(parseISO(fecha), 'yyyy/MM/dd')}`,
        )

        if (!guardado) {
          throw new Error(`No se guardó ${dolar.fecha}`)
        }

        const a = JSON.stringify(
          dolaresPorFecha
            .toArray()
            .sort((a, b) => a.casa.localeCompare(b.casa)),
        )

        const b = JSON.stringify(
          guardado.sort((a, b) => a.casa.localeCompare(b.casa)),
        )

        if (a !== b) {
          throw new Error(`No coinciden ${fecha} \n ${a} \n ${b}`)
        }

        expect(a).toEqual(b)
      })
  })

  it('lee `/dolares/index.json` y escribe en cada sub-directorio', async () => {
    const dolares = await leerRuta('/cotizaciones/dolares')

    expect(dolares.length).toBeGreaterThan(0)

    collect(dolares)
      .groupBy('casa')
      .map(async (dolaresPorCasa) => {
        dolaresPorCasa.map(async (dolar) => {
          // Guardar
          const guardar = await escribirRuta(
            `/cotizaciones/dolares/${dolar.casa}/${format(
              parseISO(dolar.fecha),
              'yyyy/MM/dd',
            )}`,
            {
              casa: dolar.casa,
              compra: dolar.compra,
              venta: dolar.venta,
              fecha: dolar.fecha,
            },
          )
        })

        await escribirRuta(
          `/cotizaciones/dolares/${dolaresPorCasa.first().casa}`,
          dolaresPorCasa
            .toArray()
            .sort((a, b) => a.casa.localeCompare(b.casa))
            .map((dolar) => ({
              casa: dolar.casa,
              compra: dolar.compra,
              venta: dolar.venta,
              fecha: dolar.fecha,
            })),
          true,
        )
      })

    collect(dolares)
      .groupBy('fecha')
      .map(async (dolaresPorFecha, fecha) => {
        const guardar = await escribirRuta(
          `/cotizaciones/dolares/${format(parseISO(fecha), 'yyyy/MM/dd')}`,
          dolaresPorFecha.toArray().sort((a, b) => a.casa.localeCompare(b.casa)),
        )
      })
  })
})
