import { describe, it, expect, vi } from 'vitest'
import axios from 'axios'
import { extraerUalaCuentaRemunerada, extraerUalaPlazoFijo } from '@/finanzas/extraccion/extraerUala.esjs'
import { format } from 'date-fns'

describe('extraerUala with mock', () => {
  it('extrae Uala Plazo Fijo correctamente', async () => {
    vi.mock('axios')

    axios.post.mockResolvedValue({
      data: {
        access: 'fake-token',
      },
    })

    axios.get.mockResolvedValue({
      data: {
        products: [
          {
            productName: 'Cuenta Remunerada',
            value: '12.3%',
          },
          {
            productName: 'Plazo Fijo',
            value: 'TNA 30 días: 37% | TNA 90 días: 40% | TNA 180 días: 45% | TEA 30 días: 43.98% | TEA 90 días: 46.45% | TEA 180 días: 50.14%',
          },
        ],
      },
    })

    const resultado = await extraerUalaPlazoFijo()

    expect(resultado).toEqual({
      entidad: 'UALA',
      logo: 'https://icons.com.ar/icons/bancos-apps/uala.svg',
      tnaClientes: 0.37,
      tnaNoClientes: 0.37,
    })
  })
})
