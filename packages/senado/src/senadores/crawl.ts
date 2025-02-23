import * as cheerio from 'cheerio'
import { readEndpoint } from '../utils/readEndpoint.ts'
import { writeEndpoint } from '../utils/writeEndpoint.ts'

export interface Senador {
  foto: string
  nombre: string
  provincia: string
  partido: string
  email: string
  telefono: string
  redes: string[]
}

export async function crawl(): Promise<Senador[]> {
  const currentValues = readEndpoint('/senadores')

  if (!currentValues) {
    return []
  }

  const senadores = JSON.parse(currentValues) as Senador[]

  const response = await fetch(
    'https://www.senado.gob.ar/senadores/listados/listaSenadoRes',
  )

  const html = await response.text()

  const $ = cheerio.load(html)

  $('tr').each((_, el) => {
    const $el = $(el)
    const nombre = $el.find('a').eq(1).text().trim().replace(/\s+/g, ' ')
    const provincia = $el.find('td').eq(2).text().trim()
    const partido = $el.find('td').eq(3).text().trim()
    const email = $el.find('li').eq(0).text().trim()
    const telefono = $el.find('li').eq(1).text().trim()
    const redes = [
      ...$el.find('li').map((_, el) => {
        return String($(el).find('a').attr('href'))
          .trim()
          .replace(/^mailto:/, '')
      }),
    ]
      .filter(Boolean)
      .filter(red => red !== 'undefined')

    if (!nombre) {
      return
    }

    const existingSenador = senadores.find(s => s.nombre === nombre)

    if (existingSenador) {
      existingSenador.provincia = provincia
      existingSenador.partido = partido
      existingSenador.email = email
      existingSenador.telefono = telefono
      existingSenador.redes = redes
    }
  })

  writeEndpoint('/senadores', senadores)

  return senadores
}
