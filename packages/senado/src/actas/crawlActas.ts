import type { ActaData } from './parseActa.ts'
import { readEndpoint } from '@argentinadatos/core/src/utils/readEndpoint.ts'
import { writeEndpoint } from '@argentinadatos/core/src/utils/writeEndpoint.ts'
import * as cheerio from 'cheerio'
import { collect } from 'collect.js'
import { downloadPdf } from './downloadPdf.ts'
import { parseActa } from './parseActa.ts'

export async function crawlActas({ year }: { year?: number } = {}): Promise<
  ActaData[]
> {
  const output: ActaData[] = []
  const yearToSearch = year || new Date().getFullYear()

  const response = await fetch('https://www.senado.gob.ar/votaciones/actas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `busqueda_actas%5Banio%5D=${yearToSearch}&busqueda_actas%5Btitulo%5D=&x=42&y=8`,
  })

  const html = await response.text()

  const $ = cheerio.load(html)

  const actas = $('table#actasTable tbody tr')

  const firstActaId = Number(
    actas
      .eq(0)
      .find('td a')
      .attr('href')
      ?.split('/')
      .pop(),
  )

  await Promise.all(
    Array.from({ length: 100 }, (_, i) => {
      const actaId = firstActaId + i - 50

      return processActa(actaId, '', yearToSearch)
    }),
  )

  saveByYear(output, yearToSearch)

  saveAll(output)

  return output
}

async function scrapeActas(actaId: number): Promise<string> {
  try {
    const url = `https://www.senado.gob.ar/votaciones/detalleActa/${actaId}`
    const response = await fetch(url)
    const html = await response.text()

    const $ = cheerio.load(html)

    const titulo = ($('div.row div.col-lg-6.col-sm-6:first-child p:nth-child(2)').text().trim()).replace(/[\n\t\r]/g, '').replace(/\s+/g, ' ')

    return titulo
  }
  catch (error) {
    console.error(`❌ Error al obtener título del Acta ${actaId}:`, error)
    return ''
  }
}

async function processActa(
  actaId: number,
  titulo: string,
  yearToSearch: number,
): Promise<ActaData | null> {
  try {
    const pdfPath = await downloadPdf(actaId)

    if (!pdfPath) {
      return null
    }

    const tituloFromHtml = await scrapeActas(actaId)

    const finalTitulo = tituloFromHtml || titulo

    const acta = await parseActa(actaId, finalTitulo, pdfPath)

    writeEndpoint(`/senado/actas/${yearToSearch}/${actaId}`, acta)

    return acta
  }
  catch (error) {
    console.error(`❌ Error al procesar Acta ${actaId}:`, error)

    return null
  }
}

function saveByYear(data: any, year: number) {
  const currentValues = readEndpoint(`/senado/actas/${year}`) || '[]'

  const currentData = JSON.parse(currentValues)

  const newData = collect(data)
    .merge(currentData)
    .unique('actaId')
    .sortBy('actaId')
    .all()

  writeEndpoint(`/senado/actas/${year}`, newData)

  return newData
}

function saveAll(data: any) {
  const currentValues = readEndpoint('/senado/actas') || '[]'

  const currentData = JSON.parse(currentValues)

  const newData = collect(data)
    .merge(currentData)
    .unique('actaId')
    .sortBy('actaId')
    .all()

  writeEndpoint('/senado/actas', newData)
}
