import { expect, it } from 'vitest'
import { crawlActas } from '../src/diputados/actas/crawlActas'

it('crawlActas', async () => {
  const result = await crawlActas()

  expect(result).toBeDefined()
  expect(Array.isArray(result)).toBe(true)
  expect(result.length).toBeGreaterThan(0)

  for (const item of result) {
    expect(item).toMatchObject({
      periodo: expect.any(String),
      reunion: expect.any(String),
      numeroActa: expect.any(String),
      titulo: expect.any(String),
      resultado: expect.any(String),
      fecha: expect.any(Date),
      presidente: expect.any(String),
      votosAfirmativos: expect.any(Number),
      votosNegativos: expect.any(Number),
      abstenciones: expect.any(Number),
      ausentes: expect.any(Number),
      votos: expect.arrayContaining([
        expect.objectContaining({
          diputado: expect.any(String),
          tipoVoto: expect.toBeOneOf(['afirmativo', 'negativo', 'abstencion', 'ausente', 'presidente']),
          imagen: expect.any(String),
          videoDiscurso: expect.toBeOneOf([null, expect.any(String)]),
        }),
      ]),
    })
  }
}, {
  timeout: 300000,
})
