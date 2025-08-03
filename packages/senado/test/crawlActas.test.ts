import { expect, it } from 'vitest'
import { crawlActas } from '../src/actas/crawlActas'

it(
  'crawlActas',
  async () => {
    const result = await crawlActas()

    expect(result).toBeDefined()
    expect(Array.isArray(result)).toBe(true)
    for (const acta of result) {
      expect(acta).toMatchObject({
        actaId: expect.any(Number),
        titulo: expect.any(String),
        proyecto: expect.any(String),
        descripcion: expect.any(String),
        quorumTipo: expect.any(String),
        fecha: expect.any(String),
        acta: expect.any(String),
        mayoria: expect.any(String),
        miembros: expect.any(Number),
        afirmativos: expect.any(Number),
        negativos: expect.any(Number),
        abstenciones: expect.any(Number),
        presentes: expect.any(Number),
        ausentes: expect.any(Number),
        amn: expect.any(Number),
        resultado: expect.any(String),
        votos: expect.any(Array),
        observaciones: expect.any(Array),
      })
    }
  },
  {
    timeout: 300000,
  },
)
