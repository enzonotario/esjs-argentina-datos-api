import { describe, it, expect, vi } from 'vitest'
import axios from 'axios'
import { extraerUalaCuentaRemunerada, extraerUalaPlazoFijo } from '@/finanzas/extraccion/extraerUala.esjs'
import { format } from 'date-fns'

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

describe('extraerUala', () => {
  it('extrae Uala Cuenta Remunerada correctamente', async () => {
    const resultado = await extraerUalaCuentaRemunerada()

    expect(axios.post).toHaveBeenCalledWith(
      import.meta.env.VITE_FINANZAS_RENDIMIENTOS_UALA_TOKEN_URL,
      {
        username: import.meta.env.VITE_FINANZAS_RENDIMIENTOS_UALA_USERNAME,
        password: import.meta.env.VITE_FINANZAS_RENDIMIENTOS_UALA_PASSWORD,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    expect(axios.get).toHaveBeenCalledWith(
      import.meta.env.VITE_FINANZAS_RENDIMIENTOS_UALA_URL,
      {
        headers: {
          Authorization: `Bearer fake-token`,
        },
      },
    )

    expect(resultado).toEqual({
      fondo: 'UALA',
      tna: 0.123,
      tea: 0.1309,
      tope: null,
      fecha: format(new Date(), 'yyyy-MM-dd'),
    })
  })

  it('extrae Uala Plazo Fijo correctamente', async () => {
    const resultado = await extraerUalaPlazoFijo()

    expect(resultado).toEqual({
      entidad: 'UALA',
      logo: 'https://icons.com.ar/icons/bancos-apps/uala.svg',
      tnaClientes: 0.37,
      tnaNoClientes: 0.37,
    })
  })
})
