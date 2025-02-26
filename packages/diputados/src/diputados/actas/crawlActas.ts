import axios from 'axios'
import * as cheerio from 'cheerio'
import { USER_AGENT, VOTACIONES_BASE_URL } from '../../constants.ts'
import { readEndpoint } from '../../utils/readEndpoint.ts'
import { titleCaseSpanish } from '../../utils/titleCaseSpanish.ts'
import { writeEndpoint } from '../../utils/writeEndpoint.ts'

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
  periodo: string
  reunion: string
  numeroActa: string
  titulo: string
  resultado: string
  fecha: string
  hora: string
  presidente: string
  votosAfirmativos: number
  votosNegativos: number
  abstenciones: number
  ausentes: number
  votos: Voto[]
}

const diputados = JSON.parse(readEndpoint('diputados') || '[]')

export async function crawlActas(
  { year }: { year: number } = { year: new Date().getFullYear() },
): Promise<Acta[]> {
  const votacionesUrls = await getVotacionesUrls()

  const actas = (await Promise.all(
    votacionesUrls.map(url => parseVotacionPage(url)),
  )
  ).filter(Boolean) as Acta[]

  writeEndpoint('actas', actas)

  writeEndpoint('diputados', diputados)

  return actas
}

async function getVotacionesUrls() {
  const response = await axios.get(VOTACIONES_BASE_URL, {
    headers: {
      'User-Agent': USER_AGENT,
    },
  })

  const html = response.data

  const $ = cheerio.load(html)

  const links = $('a[href^="/votacion/"]')

  const urls = links
    .map((_, element) => VOTACIONES_BASE_URL + $(element).attr('href'))
    .get()

  return urls
}

async function parseVotacionPage(url: string) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': USER_AGENT,
      },
    })

    return parseActa(response.data)
  }
  catch (error) {
    console.error('Error parsing votacion page', {
      url,
      error,
    })
    return null
  }
}

export function parseActa(html: string): Acta | null {
  const $ = cheerio.load(html)

  const title = $('h5 b').text().trim()
  const [periodo, reunion, numeroActa] = title.split(' - ').map(s => s.replace(/\D+/g, '')) // Extract numbers
  const titulo = $('ul.col h4.black-opacity').text().trim()
  const resultado = $('ul.col-in li.col-middle h3').text().trim().toLowerCase()
  const dateTime = $('ul.col h5.text-muted').text().trim()
  const [fecha, hora] = dateTime.split(' - ')
  const presidente = $('div#custom-share h4 b').text().trim()

  const afirmativosUl = $('div.col-lg-2.col-sm-6 ul h4:contains("AFIRMATIVOS")').parent()
  const negativosUl = $('div.col-lg-2.col-sm-6 ul h4:contains("NEGATIVOS")').parent()
  const abstencionesUl = $('div.col-lg-2.col-sm-6 ul h4:contains("ABSTENCIONES")').parent()
  const ausentesUl = $('div.col-lg-2.col-sm-6 ul h4:contains("AUSENTES")').parent()

  const votosAfirmativos = Number.parseInt(afirmativosUl.find('h3').text().trim(), 10) || 0
  const votosNegativos = Number.parseInt(negativosUl.find('h3').text().trim(), 10) || 0
  const abstenciones = Number.parseInt(abstencionesUl.find('h3').text().trim(), 10) || 0
  const ausentes = Number.parseInt(ausentesUl.find('h3').text().trim(), 10) || 0

  const votos: Voto[] = []
  $('#myTable tbody tr').each((i, row) => {
    const imagen = $(row).find('td:nth-child(1) img').attr('src') || ''
    const diputado = titleCaseSpanish($(row).find('td:nth-child(2)').text().trim().toLowerCase())
    const tipoVoto = parseTipoVoto($(row).find('td:nth-child(5) span.label').text().trim())
    const videoButton = $(row).find('td:nth-child(6) button')
    const videoDiscurso = videoButton.length > 0 && !videoButton.prop('disabled') ? videoButton.attr('onclick')?.match(/'([^']+)'/)?.[1] || null : null

    const diputadoData = diputados.find((d: any) => `${d.apellido}, ${d.nombre}` === diputado)
    if (diputadoData && !diputadoData.foto) {
      diputadoData.foto = imagen
    }

    votos.push({
      diputado,
      tipoVoto,
      imagen,
      videoDiscurso,
    })
  })

  return {
    periodo,
    reunion,
    numeroActa,
    titulo,
    resultado,
    fecha,
    hora,
    presidente: titleCaseSpanish(presidente.toLowerCase()),
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
  if (voto.includes('ABSTENCIÓN')) {
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
