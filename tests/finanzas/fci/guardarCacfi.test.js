import { describe, expect, it } from "vitest";
import { leerRuta } from "@/utils/rutas.esjs";
import { guardarCacfi } from "@/finanzas/fci/guardarCacfi.esjs";
import { parseISO, format } from "date-fns";
import { extraerCacfi } from "@/extractores/cacfi.extractor.esjs";

describe('guardarCacfi', () => {
  it('guarda las series de Cacfi', async () => {
    const fecha = parseISO('2024-01-02')
    const fechaConBarra = format(fecha, 'yyyy/MM/dd')

    const series = [
      'mercadoDinero',
      'rentaVariable',
      'rentaFija',
      'rentaMixta',
    ]

    for (const serie of series) {
      const items = await extraerCacfi(serie, format(fecha, 'yyyy-MM-dd'))

      const esperado = await guardarCacfi(serie, items, parseISO('2024-01-02'))

      expect(esperado).toBeDefined()

      const guardado = await leerRuta(`/finanzas/fci/${serie}/${fechaConBarra}`)

      for (const item of items) {
        expect(guardado).toContainEqual(item)
      }
    }
  }, {
    timeout: 1000 * 60 * 5, // 5 minutes
  })
})
