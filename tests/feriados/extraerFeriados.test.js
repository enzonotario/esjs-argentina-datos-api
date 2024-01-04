import { expect, it, describe } from 'vitest'
import { extraerFeriados } from '@/feriados/acciones/extraccion/extraerFeriados'

describe('extraerFeriados', () => {
  it('extrae los feriados del año', async () => {
    const feriados = await extraerFeriados(2024)

    expect(feriados).toMatchSnapshot()
  })
})
