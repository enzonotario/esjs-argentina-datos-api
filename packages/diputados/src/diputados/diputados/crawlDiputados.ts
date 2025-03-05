import { getStaticPublicUrl } from '@argentinadatos/core/src/utils/getStaticPublicUrl.ts'
import { readEndpoint } from '@argentinadatos/core/src/utils/readEndpoint.ts'
import { titleCaseSpanish } from '@argentinadatos/core/src/utils/titleCaseSpanish.ts'
import { writeEndpoint } from '@argentinadatos/core/src/utils/writeEndpoint.ts'
import { writeStaticBuffer } from '@argentinadatos/core/src/utils/writeStaticBuffer.ts'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { collect } from 'collect.js'
import { formatISO, parseISO } from 'date-fns'
import iconv from 'iconv-lite'
import { BASE_URL, USER_AGENT } from "../../constants.ts";

export interface Diputado {
  id: string
  nombre: string
  apellido: string
  genero: string
  provincia: string
  periodoMandato: {
    inicio: string | null
    fin: string | null
  }
  juramentoFecha: string
  ceseFecha: string
  bloque: string
  periodoBloque: {
    inicio: string | null
    fin: string | null
  }
  foto: string | null
}

const currentValues = JSON.parse(
  readEndpoint('diputados/diputados') || '[]',
) as Diputado[]

export async function crawlDiputados(): Promise<Diputado[]> {
  const page = await parsePage(`${BASE_URL}/dataset/legisladores`)

  const csvPage = await parseCsvPage(page.csvPageUrl)

  const csv = await getCsv(csvPage.csvUrl)

  const newValues = parseCsv(csv)

  const values = collect([
    ...currentValues,
    ...newValues,
  ])
    .sortBy('id')
    .sortBy('periodoMandato.inicio')
    .all() as Diputado[]

  const diputados = []

  for (const value of values) {
    diputados.push(
      await enhanceWithPhoto(value),
    )
  }

  writeEndpoint('diputados/diputados', diputados)

  return diputados
}

async function parsePage(url: string) {
  const response = await fetch(url)

  const html = await response.text()

  const $ = cheerio.load(html)

  const csvPageRelativeUrl = $('a.heading').attr('href')

  if (!csvPageRelativeUrl) {
    throw new Error('CSV Page URL not found')
  }

  const csvPageUrl = `${BASE_URL}${csvPageRelativeUrl}`

  return {
    csvPageUrl,
  }
}

async function parseCsvPage(url: string) {
  const response = await fetch(url)

  const html = await response.text()

  const $ = cheerio.load(html)

  const csvUrl = $('a[href$=".csv"]').attr('href')

  if (!csvUrl) {
    throw new Error('CSV URL not found')
  }

  return {
    csvUrl,
  }
}

async function getCsv(url: string): Promise<string> {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
  })

  return iconv.decode(response.data, 'latin1')
}

function parseCsv(csv: string): Diputado[] {
  const lines = csv.split('\n')

  return lines
    .slice(1)
    .map((line) => {
      const fields = line.split(',')

      if (fields.length !== 12) {
        console.warn('Invalid line', {
          line,
          fields,
        })
        return null
      }

      const [
        id,
        apellido,
        nombre,
        genero,
        provincia,
        inicioMandato,
        finMandato,
        juramentoFecha,
        ceseFecha,
        bloque,
        bloqueInicio,
        bloqueFin,
      ] = fields

      return {
        id,
        nombre: parseNombreApellido(nombre),
        apellido: parseNombreApellido(apellido),
        genero,
        provincia: titleCaseSpanish(provincia.toLowerCase()),
        periodoMandato: parsePeriodo(inicioMandato, finMandato),
        juramentoFecha: formatISO(parseISO(juramentoFecha)),
        ceseFecha: formatISO(parseISO(ceseFecha)),
        bloque: titleCaseSpanish(bloque.toLowerCase()),
        periodoBloque: parsePeriodo(bloqueInicio, bloqueFin),
        foto: getFoto(id),
      } as Diputado
    })
    .filter(diputado => diputado !== null)
}

function parseNombreApellido(texto: string) {
  return titleCaseSpanish(texto.toLowerCase()).replace(/"/g, '')
}

function parsePeriodo(inicio: string, fin: string) {
  return {
    inicio: parseFecha(inicio),
    fin: parseFecha(fin),
  }
}

function parseFecha(fecha: string): string | null {
  try {
    return formatISO(parseISO(fecha))
  }
  catch (error) {
    console.warn('Invalid fecha', {
      fecha,
      error,
    })
    return null
  }
}

function getFoto(id: string): string | undefined | null {
  return currentValues.find(diputado => diputado.id === id && diputado.foto)?.foto
}

async function enhanceWithPhoto(diputado: Diputado): Promise<Diputado> {
  const fotoFromCurrentValues = diputado.foto

  if (fotoFromCurrentValues?.startsWith('https://votaciones.hcdn.gob.ar/assets/diputados/')) {
    const path = `/diputados/diputados/${diputado.id}.jpg`

    await saveFoto(path, fotoFromCurrentValues)

    const foto = getStaticPublicUrl(path)

    return {
      ...diputado,
      foto,
    }
  }

  return diputado
}

async function saveFoto(path: string, foto: string) {
  let response
  let attempts = 0
  while (attempts < 3) {
    try {
      response = await axios.get(foto, {
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': USER_AGENT,
        },
      })
      break
    }
    catch (error) {
      console.error('Error fetching foto', {
        path,
        foto,
        error,
      })
      attempts++
    }
  }

  if (!response) {
    console.error('Failed to fetch foto', {
      path,
      foto,
    })
    return
  }

  writeStaticBuffer(path, response.data)
}
