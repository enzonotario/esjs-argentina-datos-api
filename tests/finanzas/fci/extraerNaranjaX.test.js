import { describe, it, expect, vi } from 'vitest'
import axios from 'axios'
import { extraerNaranjaX } from '@/finanzas/fci/extraerNaranjaX.esjs'
import { format } from 'date-fns'

vi.mock('axios')

describe('extraerNaranjaX', () => {
  it('debería devolver los datos correctamente formateados', async () => {
    axios.post.mockResolvedValue({
      data: {
        access_token: 'fake-token',
      },
    })

    axios.get.mockResolvedValue({
      data: {
        tna: 55,
        tea: 60,
        tope: 100000,
      },
    })

    const resultado = await extraerNaranjaX()

    expect(axios.post).toHaveBeenCalledWith(
      import.meta.env.VITE_FINANZAS_PLAZOFIJO_NARANJAX_TOKEN_URL,
      {
        client_id: import.meta.env.VITE_FINANZAS_PLAZOFIJO_NARANJAX_TOKEN_CLIENT_ID,
        client_secret: import.meta.env.VITE_FINANZAS_PLAZOFIJO_NARANJAX_TOKEN_CLIENT_SECRET,
        audience: import.meta.env.VITE_FINANZAS_PLAZOFIJO_NARANJAX_TOKEN_AUDIENCE,
        grant_type: 'client_credentials',
        cache: true,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    expect(axios.get).toHaveBeenCalledWith(
      import.meta.env.VITE_FINANZAS_PLAZOFIJO_NARANJAX_URL,
      {
        headers: {
          Authorization: `Bearer fake-token`,
        },
      },
    )

    expect(resultado).toEqual({
      fondo: 'NARANJA X',
      tna: 0.55,
      tea: 0.6,
      tope: 100000,
      fecha: format(new Date(), 'yyyy-MM-dd'),
    })
  })
})
