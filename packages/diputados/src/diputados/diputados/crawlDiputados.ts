import * as cheerio from 'cheerio'
import { formatISO, parseISO } from 'date-fns'
import { BASE_URL } from '../../constants.ts'
import { titleCaseSpanish } from '../../utils/titleCaseSpanish.ts'
import { writeEndpoint } from '../../utils/writeEndpoint.ts'

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
}

export async function crawlDiputados(): Promise<Diputado[]> {
  return await processWeb()
}

async function processWeb(): Promise<Diputado[]> {
  const page = await parsePage(`${BASE_URL}/dataset/legisladores`)

  const csvPage = await parseCsvPage(page.csvPageUrl)

  const csv = await getCsv(csvPage.csvUrl)

  const diputados = parseCsv(csv)

  writeEndpoint('diputados', diputados)

  return diputados
}

async function parsePage(url: string): any {
  const response = await fetch(url)

  const html = await response.text()

  const $ = cheerio.load(html)

  /**
   * html contains:
   * <a class="heading" href="/dataset/legisladores/resource/bed68ccd-81f4-4165-89b5-2b3ff9720cac" title="Composición Actual de la Cámara">
   *     Composición Actual de la Cámara<span class="format-label" property="dc:format" data-format="csv">CSV</span>
   */

  const csvPageRelativeUrl = $('a.heading').attr('href')

  if (!csvPageRelativeUrl) {
    throw new Error('CSV Page URL not found')
  }

  const csvPageUrl = `${BASE_URL}${csvPageRelativeUrl}`

  return {
    csvPageUrl,
  }
}

async function parseCsvPage(url: string): any {
  const response = await fetch(url)

  const html = await response.text()

  /**
   * html contains:
   */

  const $ = cheerio.load(html)

  const csvUrl = $('a[href$=".csv"]').attr('href')

  if (!csvUrl) {
    throw new Error('CSV URL not found')
  }

  return {
    csvUrl,
  }
}

async function getCsv(url: string): any {
  const response = await fetch(url)

  const csv = await response.text()

  /**
   * csv is like:
   * id,diputado_apellido,diputado_nombre,diputado_genero,distrito,inicio_mandato,fin_mandato,juramento_fecha,ceseFecha,bloque,bloque_inicio,bloque_fin
   * HCDN1136,ABDALA DE MATARAZZO,NORMA AMANDA,F,SANTIAGO DEL ESTERO,2009-12-10T00:00:00,2013-12-09T00:00:00,2009-12-03T00:00:00,2013-12-09T00:00:00,FRENTE CIVICO POR SANTIAGO,2009-12-10T00:00:00,2013-12-09T00:00:00
   * HCDN1136,ABDALA DE MATARAZZO,NORMA AMANDA,F,SANTIAGO DEL ESTERO,2013-12-10T00:00:00,2017-12-09T00:00:00,2013-12-04T00:00:00,2017-12-09T00:00:00,FRENTE CIVICO POR SANTIAGO,2013-12-10T00:00:00,2017-12-09T00:00:00
   * HCDN1136,ABDALA DE MATARAZZO,NORMA AMANDA,F,SANTIAGO DEL ESTERO,2017-12-10T00:00:00,2021-12-09T00:00:00,2017-12-06T00:00:00,2021-12-09T00:00:00,FRENTE CIVICO POR SANTIAGO,2017-12-10T00:00:00,2019-12-09T00:00:00
   * HCDN1136,ABDALA DE MATARAZZO,NORMA AMANDA,F,SANTIAGO DEL ESTERO,2017-12-10T00:00:00,2021-12-09T00:00:00,2017-12-06T00:00:00,2021-12-09T00:00:00,FRENTE DE TODOS,2019-12-10T00:00:00,2021-12-09T00:00:00
   * HCDN1382,ABRAHAM,ALEJANDRO,M,MENDOZA,2013-12-10T00:00:00,2017-12-09T00:00:00,2013-12-04T00:00:00,2017-12-09T00:00:00,FRENTE PARA LA VICTORIA - PJ,2013-12-13T00:00:00,2017-12-09T00:00:00
   */

  return csv
}

function parseCsv(csv: string): Diputado[] {
  const lines = csv.split('\n')

  const diputados = lines
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
        nombre: titleCaseSpanish(nombre.toLowerCase()),
        apellido: titleCaseSpanish(apellido.toLowerCase()),
        genero,
        provincia: titleCaseSpanish(provincia.toLowerCase()),
        periodoMandato: parsePeriodo(inicioMandato, finMandato),
        juramentoFecha: formatISO(parseISO(juramentoFecha)),
        ceseFecha: formatISO(parseISO(ceseFecha)),
        bloque: titleCaseSpanish(bloque.toLowerCase()),
        periodoBloque: parsePeriodo(bloqueInicio, bloqueFin),
      }
    })
    .filter(diputado => diputado !== null)

  return diputados
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
