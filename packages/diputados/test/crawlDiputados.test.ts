import { expect, it } from 'vitest'
import { crawlDiputados } from '../src/diputados/diputados/crawlDiputados'

it(
  'crawlDiputados',
  async () => {
    const result = await crawlDiputados()

    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)

    for (const diputado of result) {
      expect(diputado).toMatchObject({
        id: expect.any(String),
        nombre: expect.any(String),
        apellido: expect.any(String),
        genero: expect.toBeOneOf(['F', 'M']),
        provincia: expect.any(String),
        periodoMandato: {
          inicio: expect.any(String),
          fin: expect.any(String),
        },
        juramentoFecha: expect.any(String),
        ceseFecha: expect.any(String),
        bloque: expect.any(String),
        periodoBloque: {
          inicio: expect.any(String),
          fin: expect.toBeOneOf([null, expect.any(String)]),
        },
      })
    }
  },
  {
    timeout: 300000,
  },
)
