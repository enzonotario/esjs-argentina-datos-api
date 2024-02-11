import { describe, expect, it } from 'vitest'
import { extraerTasasDepositos30Dias } from '@/finanzas/extraccion/extraerTasasDepositos30Dias.esjs'
import { format } from 'date-fns'

describe('extraerTasasDepositos30Dias', () => {
  it('extrae los depósitos a 30 días', async () => {
    const items = await extraerTasasDepositos30Dias(
      '2023-01-01',
      '2024-01-01'
    )

    expect(items).toMatchSnapshot()
  })
})
