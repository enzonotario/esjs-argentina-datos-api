import { describe, it, expect, vi } from 'vitest'
import axios from 'axios'
import { extraerUalaCuentaRemunerada } from '@/finanzas/extraccion/extraerUala.esjs'
import { format } from 'date-fns'

vi.mock('axios')

describe('extraerUalaCuentaRemunerada', () => {
  it('extrae Uala Cuenta Remunerada correctamente', async () => {
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
        ],
      },
    })

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
      tea: null,
      tope: null,
      fecha: format(new Date(), 'yyyy-MM-dd'),
    })
  })
})
