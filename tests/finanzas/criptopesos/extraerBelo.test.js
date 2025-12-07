import { describe, expect, it, vi } from 'vitest'
import { extraerBelo } from '@/finanzas/criptopesos/extraccion/extraerBelo.esjs'

describe('extraerBelo', () => {
  it('extrae datos correctamente de Belo', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ AR: { ARGt: '0.25' } }),
      }),
    )

    const resultado = await extraerBelo()

    expect(resultado).toHaveLength(1)
    expect(resultado[0]).toEqual({
      token: 'ARGt',
      entidad: 'belo',
      tna: 0.25,
    })
  })

  it('retorna array vacio si no hay datos', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      }),
    )

    const resultado = await extraerBelo()

    expect(resultado).toEqual([])
  })

  it('retorna array vacio si hay error', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error')))

    const resultado = await extraerBelo()

    expect(resultado).toEqual([])
  })
})

