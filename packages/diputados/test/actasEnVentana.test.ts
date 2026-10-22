import { describe, expect, it } from 'vitest'
import { VENTANA_REESCRITURA_DIAS, actasEnVentana } from '../src/diputados/actas/crawlActas'

const DAY_MS = 24 * 60 * 60 * 1000

describe('actasEnVentana', () => {
  const now = new Date('2026-10-21T15:00:00.000Z')

  function acta(fecha: Date) {
    return { id: fecha.toISOString(), fecha }
  }

  it('incluye el corte de 60 días y excluye el milisegundo anterior', () => {
    const corte = new Date(now.getTime() - VENTANA_REESCRITURA_DIAS * DAY_MS)
    const anterior = new Date(corte.getTime() - 1)

    const result = actasEnVentana([
      acta(anterior),
      acta(corte),
      acta(now),
    ], now)

    expect(result.map(item => item.id)).toEqual([
      corte.toISOString(),
      now.toISOString(),
    ])
  })
})
