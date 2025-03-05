import type { Collection } from 'collect.js'
import { readEndpoint } from '@argentinadatos/core/src/utils/readEndpoint.ts'
import { titleCaseSpanish } from '@argentinadatos/core/src/utils/titleCaseSpanish.ts'
import { writeEndpoint } from '@argentinadatos/core/src/utils/writeEndpoint.ts'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { collect } from 'collect.js'
import { formatISO, getYear, parse } from 'date-fns'
import { USER_AGENT, VOTACIONES_BASE_URL } from '../../constants.ts'

enum TipoVoto {
  Afirmativo = 'afirmativo',
  Negativo = 'negativo',
  Abstencion = 'abstencion',
  Ausente = 'ausente',
  Presidente = 'presidente',
}

interface Voto {
  diputado: string
  tipoVoto: TipoVoto
  imagen: string
  videoDiscurso: string | null
}

interface Acta {
  id: string
  periodo: string
  reunion: string
  numeroActa: string
  titulo: string
  resultado: string
  fecha: Date
  presidente: string
  votosAfirmativos: number
  votosNegativos: number
  abstenciones: number
  ausentes: number
  votos: Voto[]
}

const currentValues = JSON.parse(readEndpoint('diputados/actas') || '[]')

const diputados = JSON.parse(readEndpoint('diputados/diputados') || '[]')

export async function crawlActas(): Promise<Acta[]> {
  const currentIds = collect(currentValues).pluck('id').all() as string[]

  const votacionesUrls = await getVotacionesUrls(currentIds)

  const newValues = (
    await Promise.all(votacionesUrls.map(url => parseVotacionPage(url)))
  ).filter(Boolean)

  // Save all actas.
  const actas = collect(newValues)
    .merge(currentValues)
    .unique(
      (acta: Acta) =>
        `${formatISO(acta.fecha)}-${acta.periodo}-${acta.reunion}-${acta.numeroActa}`,
    )
    .sortBy('fecha')
    .all() as Acta[]
  writeEndpoint('diputados/actas', actas)

  // Save actas by year.
  collect(actas)
    .groupBy((acta: Acta) => getYear(acta.fecha))
    // @ts-expect-error: TS can't infer the type of the collection
    .map((actas: Collection<Acta>, year: number) => ({
      year,
      actas: actas.all(),
    }))
    .each(({ year, actas }) => writeEndpoint(`diputados/actas/${year}`, actas))

  // Update diputados with missing photos.
  writeEndpoint('diputados/diputados', diputados)

  return actas
}

async function getVotacionesUrls(currentIds: string[]) {
  const response = await axios.get(VOTACIONES_BASE_URL, {
    headers: {
      'User-Agent': USER_AGENT,
    },
  })

  const html = response.data

  const $ = cheerio.load(html)

  const linksElements = $('a[href^="/votacion/"]')

  const links = linksElements
    .map((_, element) => VOTACIONES_BASE_URL + $(element).attr('href'))
    .get()

  const firstLink = links[0]

  const firstId = firstLink.split('/').pop() as string

  const ids = Array.from({ length: Number.parseInt(firstId, 10) }, (_, i) => String(i))

  return ids
    .filter(id => !currentIds.includes(id))
    .map(id => `${VOTACIONES_BASE_URL}/${id}`)
}

async function parseVotacionPage(url: string) {
  const id = url.split('/').pop() as string

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': USER_AGENT,
      },
    })

    return parseActa(id, response.data)
  }
  catch (error) {
    console.error('Error parsing votacion page', {
      url,
      error,
    })
    return null
  }
}

function parseActa(id: string, html: string): Acta | null {
  const $ = cheerio.load(html)

  const title = $('h5 b').text().trim()
  const [periodo, reunion, numeroActa] = title
    .split(' - ')
    .map(s => s.replace(/\D+/g, '')) // Extract numbers
  const titulo = $('ul.col h4.black-opacity').text().trim()
  const resultado = $('ul.col-in li.col-middle h3').text().trim().toLowerCase()
  const dateTime = $('ul.col h5.text-muted').text().trim()
  const [fecha, hora] = dateTime.split(' - ')
  const fechaHora = parseFechaHora(fecha, hora)
  const presidente = titleCaseSpanish(
    $('div#custom-share h4 b').text().trim().toLowerCase(),
  )

  const afirmativosUl = $(
    'div.col-lg-2.col-sm-6 ul h4:contains("AFIRMATIVOS")',
  ).parent()
  const negativosUl = $(
    'div.col-lg-2.col-sm-6 ul h4:contains("NEGATIVOS")',
  ).parent()
  const abstencionesUl = $(
    'div.col-lg-2.col-sm-6 ul h4:contains("ABSTENCIONES")',
  ).parent()
  const ausentesUl = $(
    'div.col-lg-2.col-sm-6 ul h4:contains("AUSENTES")',
  ).parent()

  const votosAfirmativos
    = Number.parseInt(afirmativosUl.find('h3').text().trim(), 10) || 0
  const votosNegativos
    = Number.parseInt(negativosUl.find('h3').text().trim(), 10) || 0
  const abstenciones
    = Number.parseInt(abstencionesUl.find('h3').text().trim(), 10) || 0
  const ausentes = Number.parseInt(ausentesUl.find('h3').text().trim(), 10) || 0

  const votos: Voto[] = []
  $('#myTable tbody tr').each((_, row) => {
    const imagen = $(row).find('td:nth-child(1) img').attr('src') || ''
    const diputado = titleCaseSpanish(
      $(row).find('td:nth-child(2)').text().trim().toLowerCase(),
    )
    const tipoVoto = parseTipoVoto(
      $(row).find('td:nth-child(5) span.label').text().trim(),
    )
    const videoButton = $(row).find('td:nth-child(6) button')
    const videoDiscurso
      = videoButton.length > 0 && !videoButton.prop('disabled')
        ? videoButton.attr('onclick')?.match(/'([^']+)'/)?.[1] || null
        : null

    // Update diputado with missing photo.
    diputados.filter((d: any) => `${d.apellido}, ${d.nombre}` === diputado)
      .forEach((d: any) => {
        if (!d.foto) {
          d.foto = imagen
        }
      })

    votos.push({
      diputado,
      tipoVoto,
      imagen,
      videoDiscurso,
    })
  })

  return {
    id,
    periodo,
    reunion,
    numeroActa,
    titulo,
    resultado,
    fecha: fechaHora,
    presidente,
    votosAfirmativos,
    votosNegativos,
    abstenciones,
    ausentes,
    votos,
  }
}

function parseTipoVoto(voto: string): TipoVoto {
  if (voto.includes('AFIRMATIVO')) {
    return TipoVoto.Afirmativo
  }
  if (voto.includes('NEGATIVO')) {
    return TipoVoto.Negativo
  }
  if (voto.includes('ABSTENCIÓN') || voto.includes('ABSTENCION')) {
    return TipoVoto.Abstencion
  }
  if (voto.includes('AUSENTE')) {
    return TipoVoto.Ausente
  }
  if (voto.includes('PRESIDENTE')) {
    return TipoVoto.Presidente
  }
  return TipoVoto.Ausente
}

function parseFechaHora(fecha: string, hora: string): Date {
  return parse(`${fecha} ${hora}`, 'dd/MM/yyyy HH:mm', new Date())
}
