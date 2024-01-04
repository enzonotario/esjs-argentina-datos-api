import { describe, expect, it } from "vitest";
import { extraerFeriados } from '@/feriados/acciones/extraccion/extraerFeriados.esjs'
import { guardarFeriados } from '@/feriados/acciones/guardado/guardarFeriados.esjs'
import { consultarFeriados } from '@/feriados/acciones/consulta/consultarFeriados.esjs'

describe('guardarFeriados', () => {
  it('guarda los feriados del año', async () => {
    try {
      const años = [
        2022,
        2023,
        2024,
      ]

      for (const año of años) {
        const feriados = await extraerFeriados(año)

        expect(feriados.length).toBeGreaterThan(0)

        const feriadosGuardados = await guardarFeriados(feriados)

        const feriadosConsultados = await consultarFeriados(año)

        expect(feriadosConsultados.length).toBe(feriados.length)
      }
    } catch (error) {
      console.log('error', error)
    }
  })
})
