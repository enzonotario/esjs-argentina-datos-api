import { describe, expect, it } from "vitest";
import { crawlProyectos } from '../src/diputados/proyectos/crawlProyectos'
import { crawlActas } from "../src/diputados/actas/crawlActas";

describe('actas', () => {
  it('crawl', async () => {
    const result = await crawlActas({
      year: 2024,
    })

    console.log(result)

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
  }, {
    timeout: 300000,
  })
})
