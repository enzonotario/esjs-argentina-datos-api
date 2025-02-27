import { expect, it } from 'vitest'
import { crawlSenadores } from '../src/senadores/crawlSenadores'

it(
  'crawlSenadores',
  async () => {
    const result = await crawlSenadores()

    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
    for (const senador of result) {
      expect(senador).toMatchObject({
        id: expect.any(String),
        nombre: expect.any(String),
        provincia: expect.any(String),
        partido: expect.any(String),
        periodoLegal: {
          inicio: expect.any(String),
          fin: expect.any(String),
        },
        periodoReal: {
          inicio: expect.any(String),
          fin: expect.any(String),
        },
        reemplazo: expect.toBeOneOf([null, expect.any(String)]),
        observaciones: expect.toBeOneOf([null, expect.any(String)]),
        email: expect.toBeOneOf([null, expect.any(String)]),
        telefono: expect.toBeOneOf([null, expect.any(String)]),
        redes: expect.toBeOneOf([null, expect.any(Array)]),
      })
    }
  },
  {
    timeout: 300000,
  },
)
