import type { ActaData } from './parseActa.ts'
import { readEndpoint } from '@argentinadatos/core/src/utils/readEndpoint.ts'
import { writeEndpoint } from '@argentinadatos/core/src/utils/writeEndpoint.ts'
import * as cheerio from 'cheerio'
import { collect } from 'collect.js'
import { getYear } from 'date-fns'
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

  for (let i = 0; i < actas.length; i++) {
    const acta = actas.eq(i)
    const actaFecha = Number.parseInt(acta.find('td').eq(0).text().trim())
    const titulo = acta.find('td').eq(2).text().trim()
    const actaUrl = acta.find('td a').attr('href')
    const actaUrlLastPart = actaUrl?.split('/').pop()
    const actaId = Number(actaUrlLastPart)

    if (actaFecha && actaUrl && actaUrlLastPart) {
      const acta = await processActa(actaId, titulo, yearToSearch)

      if (acta && getYear(acta.fecha) === yearToSearch) {
        output.push(acta)
      }
    }
  }

  saveByYear(output, yearToSearch)

  saveAll(output)

  return output
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

    const acta = await parseActa(actaId, titulo, pdfPath)

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
