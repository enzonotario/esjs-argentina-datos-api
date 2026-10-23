import axios from 'axios'
import { expect, it } from 'vitest'
import {
  idDesdeHrefVotacion,
  maxIdDesdeHomeHtml,
  parseActa,
  urlVotacion,
} from '../src/diputados/actas/crawlActas'

it('lee el id más alto de links votacion/ID.html', () => {
  const html = `
    <a href="votacion/6025.html">6025</a>
    <a href="/votacion/6023">6023</a>
    <a href="votacion/6026.html" id="button-6026">ver</a>
  `
  expect(maxIdDesdeHomeHtml(html)).toBe(6026)
  expect(idDesdeHrefVotacion('votacion/6026.html')).toBe(6026)
  expect(idDesdeHrefVotacion(urlVotacion(6026))).toBe(6026)
  expect(urlVotacion(6026)).toBe('https://votaciones.hcdn.gob.ar/votacion/6026.html')
})

it('parsea el acta 6026 desde la URL .html', async () => {
  const response = await axios.get(urlVotacion(6026), {
    timeout: 30_000,
    validateStatus: status => status < 500,
  })
  expect(response.status).toBe(200)

  const acta = parseActa('6026', response.data)
  expect(acta).toMatchObject({
    id: '6026',
    titulo: expect.stringContaining('GIUDICI'),
    resultado: 'afirmativo',
  })
  expect(acta?.fecha.getUTCFullYear()).toBe(2026)
})
