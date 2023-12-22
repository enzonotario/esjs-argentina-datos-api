import { expect, it } from 'vitest'
import { extraerFeriados } from '@/feriados/acciones/extraccion/extraerFeriados'

it('extrae los feriados del año', async () => {
  const feriados = await extraerFeriados(2024)

  expect(feriados).toMatchSnapshot()
})
