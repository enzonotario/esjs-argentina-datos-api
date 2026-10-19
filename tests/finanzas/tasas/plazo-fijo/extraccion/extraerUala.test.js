import { describe, expect, it } from 'vitest'
import {
  URL_UALA_PLAZO_FIJO,
  extraerUalaPlazoFijo,
  parsearTasasPlazoFijoUala,
} from '@/finanzas/tasas/plazo-fijo/extraccion/extraerUala.js'

const HTML_TABLA = `
"columnHeaders":["TEA","TNA Pesos"],"rows":[
{"fields":{"internalName":"AR_Fila_plazo-fijo_30-dias","label":"30 días","values":["24,36%","22%"]}},
{"fields":{"internalName":"AR_Fila_plazo-fijo_365-días","label":"365 días","values":["28,00%","28,00%"]}}
]
`

const HTML_LISTA = `
<ul aria-label="Tasas y porcentajes">
  <li><span>22,50%</span><span>TNA 30 días</span></li>
  <li><span>28,00%</span><span>TNA 365 días</span></li>
</ul>
`

describe('parsearTasasPlazoFijoUala', () => {
  it('toma la columna TNA de la tabla actual de Ualá', () => {
    const tasas = parsearTasasPlazoFijoUala(HTML_TABLA)
    const tramo30 = tasas.find(tramo => tramo.plazoMinDias === 30)
    const tramo365 = tasas.find(tramo => tramo.plazoMinDias === 365)

    expect(tasas).toHaveLength(2)
    expect(tramo30.tna).toBe(0.22)
    expect(tramo365.tna).toBe(0.28)
  })

  it('sigue leyendo la lista HTML anterior', () => {
    const tasas = parsearTasasPlazoFijoUala(HTML_LISTA)

    expect(tasas.find(tramo => tramo.plazoMinDias === 30).tna).toBe(0.225)
  })

  it('devuelve una lista vacía si el HTML no trae tasas', () => {
    expect(parsearTasasPlazoFijoUala('<html></html>')).toEqual([])
    expect(parsearTasasPlazoFijoUala(null)).toEqual([])
  })
})

describe('extraerUalaPlazoFijo', () => {
  it('extrae tasas por plazo desde la web de Ualá', async () => {
    expect(URL_UALA_PLAZO_FIJO).toBe(
      'https://www.uala.com.ar/inversiones/plazo-fijo',
    )

    const resultado = await extraerUalaPlazoFijo()

    expect(resultado).toMatchObject({
      entidad: 'UALA',
      enlace: URL_UALA_PLAZO_FIJO,
    })
    expect(Array.isArray(resultado.tasas)).toBe(true)
    expect(resultado.tasas.length).toBeGreaterThanOrEqual(6)

    for (const tramo of resultado.tasas) {
      expect(typeof tramo.tna).toBe('number')
      expect(tramo.tna).toBeGreaterThan(0)
      expect(tramo.tna).toBeLessThan(1)
      expect(tramo.plazoMinDias).toBe(tramo.plazoMaxDias)
      expect(tramo.plazoMinDias).toBeGreaterThan(0)
    }

    const tramo30 = resultado.tasas.find(tramo => tramo.plazoMinDias === 30)
    const tramo365 = resultado.tasas.find(tramo => tramo.plazoMinDias === 365)

    expect(tramo30).toBeDefined()
    expect(tramo365).toBeDefined()
    expect(resultado.tnaClientes).toBe(tramo30.tna)
    expect(resultado.tnaNoClientes).toBe(tramo30.tna)
    expect(tramo365.tna).toBeGreaterThan(tramo30.tna)
  }, 30000)
})
