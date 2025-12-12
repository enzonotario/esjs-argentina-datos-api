import { getStaticPublicUrl } from '@argentinadatos/core/src/utils/getStaticPublicUrl.ts'
import { readEndpoint } from '@argentinadatos/core/src/utils/readEndpoint.ts'
import { titleCaseSpanish } from '@argentinadatos/core/src/utils/titleCaseSpanish.ts'
import { writeEndpoint } from '@argentinadatos/core/src/utils/writeEndpoint.ts'
import { writeStaticBuffer } from '@argentinadatos/core/src/utils/writeStaticBuffer.ts'
import { shouldWriteJsonFiles, shouldWriteFromDatabase } from '@argentinadatos/core/src/utils/database-mode.ts'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { format, parse } from 'date-fns'
import { SenadoresDatabaseService } from './database/service.ts'

export interface Senador {
  id: string
  nombre: string
  provincia: string
  partido: string
  periodoLegal: {
    inicio: string | null
    fin: string | null
  }
  periodoReal: {
    inicio: string | null
    fin: string | null
  }
  reemplazo: string | null
  observaciones: string | null
  foto: string | null
  email: string | null
  telefono: string | null
  redes: string[] | null
}

const JSON_URL
  = 'https://www.senado.gob.ar/micrositios/DatosAbiertos/ExportarListadoSenadoresHistorico/json'

export async function crawlSenadores(): Promise<Senador[]> {
  await processJson()

  await processWeb()

  return JSON.parse(readEndpoint('/senado/senadores') || '[]')
}

async function processJson() {
  const currentValues = JSON.parse(readEndpoint('/senado/senadores') || '[]')

  const json = await downloadJson()

  const senadores = json.map(parseSenador)

  const photos = await Promise.all(
    senadores.map(async (senador: Senador) => {
      const existingSenador = currentValues.find(
        s => s.nombre === senador.nombre,
      )

      if (existingSenador) {
        return existingSenador.foto
      }

      try {
        const response = await axios.get(
          `https://www.senado.gob.ar/bundles/senadosenadores/images/fsena/${senador.id}.gif`,
          { responseType: 'arraybuffer' },
        )

        if (response.status === 200) {
          const dataBuffer = Buffer.from(response.data)

          const path = writeStaticBuffer(
            `/senado/senadores/${senador.id}.gif`,
            dataBuffer,
          )

          return getStaticPublicUrl(path)
        }

        return null
      }
      catch (e: any) {
        console.error(e)
        return null
      }
    }),
  )

  const senadoresConFotos = senadores.map((senador: Senador, i: number) => ({
    ...senador,
    foto: photos[i],
  }))

  if (shouldWriteJsonFiles()) {
    writeEndpoint('/senado/senadores', senadoresConFotos)
  }

  const TURSO_DATABASE_URL = process.env.VITE_TURSO_DATABASE_URL
  const TURSO_AUTH_TOKEN = process.env.VITE_TURSO_AUTH_TOKEN

  if (TURSO_DATABASE_URL && TURSO_AUTH_TOKEN && shouldWriteFromDatabase()) {
    const db = new SenadoresDatabaseService(TURSO_DATABASE_URL, TURSO_AUTH_TOKEN)

    try {
      await db.initialize()

      const timestamp = new Date().toISOString()

      const itemsToInsert = senadoresConFotos.map(senador => ({
        senador,
        timestamp,
      }))

      await db.insertBatchSenadores(itemsToInsert)

      await generateEndpointEstatico(db)
    }
    finally {
      db.close()
    }
  }

  return senadoresConFotos
}

async function downloadJson() {
  const response = await fetch(JSON_URL)
  return (await response.json())?.table?.rows
}

function parseSenador(json: any): Senador {
  return {
    id: json.ID,
    nombre: titleCaseSpanish(json.SENADOR.toLowerCase()),
    provincia: titleCaseSpanish(json.PROVINCIA.toLowerCase()),
    partido: titleCaseSpanish(json['PARTIDO POLITICO O ALIANZA'].toLowerCase()),
    periodoLegal: parsePeriodo(
      json['INICIO PERIODO LEGAL'],
      json['CESE PERIODO LEGAL'],
    ),
    periodoReal: parsePeriodo(
      json['INICIO PERIODO REAL'],
      json['CESE PERIODO REAL'],
    ),
    reemplazo: json.REEMPLAZO
      ? titleCaseSpanish(json.REEMPLAZO.trim().toLowerCase())
      : null,
    observaciones: json.OBSERVACIONES.trim() || null,
    foto: null,
    email: null,
    telefono: null,
    redes: null,
  }
}

function parsePeriodo(inicio: string, fin: string) {
  return {
    inicio: parseFecha(inicio),
    fin: parseFecha(fin),
  }
}

function parseFecha(fecha: string) {
  try {
    return format(parse(fecha, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd')
  }
  catch {
    return null
  }
}

async function processWeb(): Promise<Senador[]> {
  const senadores = JSON.parse(readEndpoint('/senado/senadores') || '[]')

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

  if (shouldWriteJsonFiles()) {
    writeEndpoint('/senado/senadores', senadores)
  }

  const TURSO_DATABASE_URL = process.env.VITE_TURSO_DATABASE_URL
  const TURSO_AUTH_TOKEN = process.env.VITE_TURSO_AUTH_TOKEN

  if (TURSO_DATABASE_URL && TURSO_AUTH_TOKEN && shouldWriteFromDatabase()) {
    const db = new SenadoresDatabaseService(TURSO_DATABASE_URL, TURSO_AUTH_TOKEN)

    try {
      await db.initialize()

      const timestamp = new Date().toISOString()

      const itemsToInsert = senadores.map(senador => ({
        senador,
        timestamp,
      }))

      await db.insertBatchSenadores(itemsToInsert)

      await generateEndpointEstatico(db)
    }
    finally {
      db.close()
    }
  }

  return senadores
}

async function generateEndpointEstatico(db: SenadoresDatabaseService) {
  const todosLosDatos = await db.getAllSenadores()

  writeEndpoint('/senado/senadores', todosLosDatos)
}
