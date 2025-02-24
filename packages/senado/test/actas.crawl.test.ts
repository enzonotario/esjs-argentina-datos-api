import { describe, expect, it } from 'vitest'
import { crawl } from '../src/actas/crawl'

describe(
  'actas',
  () => {
    it('crawl', async () => {
      const result = await crawl()

      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
      expect(result[0]).toMatchObject({
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
    })
  },
  {
    timeout: 300000,
  },
)
