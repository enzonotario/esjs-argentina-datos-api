import { describe, expect, it } from 'vitest'
import { extraerFeriados } from '@/feriados/extraccion/extraerFeriados.esjs'
import { guardarFeriados } from '@/feriados/guardado/guardarFeriados.esjs'
import { leerRuta } from '@/utils/rutas.esjs'

describe('guardarFeriados', () => {
  it('guarda los feriados del año', async () => {
    const años = [2021, 2022, 2023, 2024]

    for (const año of años) {
      const feriados = await extraerFeriados(año)

      expect(feriados.length).toBeGreaterThan(0)

      const esperado = await guardarFeriados(año, feriados)

      const guardado = await leerRuta(`/feriados/${año}`)

      expect(guardado).toEqual(JSON.parse(esperado))
    }
  })
})
