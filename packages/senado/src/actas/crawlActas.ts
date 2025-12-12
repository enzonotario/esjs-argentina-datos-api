import type { ActaData } from './parseActa.ts'
import { shouldWriteFromDatabase, shouldWriteJsonFiles } from '@argentinadatos/core/src/utils/database-mode.ts'
import { readEndpoint } from '@argentinadatos/core/src/utils/readEndpoint.ts'
import { writeEndpoint } from '@argentinadatos/core/src/utils/writeEndpoint.ts'
import * as cheerio from 'cheerio'
import { collect } from 'collect.js'
import { ActasDatabaseService } from './database/service.ts'
import { downloadPdf } from './downloadPdf.ts'
import { parseActa } from './parseActa.ts'

export async function crawlActas({ year }: { year?: number } = {}): Promise<
  ActaData[]
> {
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

  const actasRows = $('table#actasTable tbody tr')

  const firstActaId = Number(
    actasRows
      .eq(0)
      .find('td a')
      .attr('href')
      ?.split('/')
      .pop(),
  )

  const actas = await Promise.all(
    Array.from({ length: 100 }, (_, i) => {
      const actaId = firstActaId + i - 50

      return processActa(actaId, '', yearToSearch)
    }),
  )

  const validActas = actas.filter(Boolean) as ActaData[]

  if (shouldWriteJsonFiles()) {
    saveByYear(validActas, yearToSearch)
    saveAll(validActas)
  }

  const TURSO_DATABASE_URL = process.env.VITE_TURSO_DATABASE_URL
  const TURSO_AUTH_TOKEN = process.env.VITE_TURSO_AUTH_TOKEN

  if (TURSO_DATABASE_URL && TURSO_AUTH_TOKEN && shouldWriteFromDatabase()) {
    const db = new ActasDatabaseService(TURSO_DATABASE_URL, TURSO_AUTH_TOKEN)

    try {
      await db.initialize()

      const timestamp = new Date().toISOString()

      const itemsToInsert = validActas
        .filter(acta => acta.actaId)
        .map(acta => ({
          actaId: acta.actaId!,
          año: yearToSearch,
          data: acta,
          timestamp,
        }))

      await db.insertBatchActas(itemsToInsert)

      await generateEndpointEstatico(db, yearToSearch)
      await generateEndpointEstaticoAll(db)
    }
    finally {
      db.close()
    }
  }

  return validActas
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

    if (shouldWriteJsonFiles()) {
      writeEndpoint(`/senado/actas/${yearToSearch}/${actaId}`, acta)
    }

    return acta
  }
  catch (error) {
    console.error(`❌ Error al procesar Acta ${actaId}:`, error)

    return null
  }
}

function saveByYear(data: any, year: number) {
  if (!shouldWriteJsonFiles()) {
    return data
  }

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
  if (!shouldWriteJsonFiles()) {
    return data
  }

  const currentValues = readEndpoint('/senado/actas') || '[]'

  const currentData = JSON.parse(currentValues)

  const newData = collect(data)
    .merge(currentData)
    .unique('actaId')
    .sortBy('actaId')
    .all()

  writeEndpoint('/senado/actas', newData)
}

async function generateEndpointEstatico(db: ActasDatabaseService, año: number) {
  const todosLosDatos = await db.getActasByAño(año)

  writeEndpoint(`/senado/actas/${año}`, todosLosDatos)
}

async function generateEndpointEstaticoAll(db: ActasDatabaseService) {
  const todosLosDatos = await db.getAllActas()

  writeEndpoint('/senado/actas', todosLosDatos)
}
