import { expect, it } from 'vitest'
import { crawlSenadores } from '../src/senadores/crawlSenadores'

it(
  'crawlSenadores',
  async () => {
    const result = await crawlSenadores()

    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    for (const senador of result) {
      expect(senador, `Invalid senator data: ${JSON.stringify(senador)}`).toMatchObject({
        id: expect.any(String),
        nombre: expect.any(String),
        provincia: expect.any(String),
        partido: expect.any(String),
        periodoLegal: {
          inicio: expect.any(String),
          fin: expect.toBeOneOf([null, expect.any(String)]),
        },
        periodoReal: {
          inicio: expect.any(String),
          fin: expect.toBeOneOf([null, expect.any(String)]),
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
