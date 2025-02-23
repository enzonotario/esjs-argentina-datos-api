import axios from 'axios'
import { format, parse } from 'date-fns'
import { getStaticPublicUrl } from '../utils/getStaticPublicUrl.ts'
import { titleCaseSpanish } from '../utils/titleCaseSpanish.ts'
import { writeEndpoint } from '../utils/writeEndpoint.ts'
import { writeStaticBuffer } from '../utils/writeStaticBuffer.ts'

const JSON_URL
  = 'https://www.senado.gob.ar/micrositios/DatosAbiertos/ExportarListadoSenadoresHistorico/json'

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

export async function crawlJson() {
  const json = await downloadJson()

  const senadores = json.map(parseSenador)

  const photos = await Promise.all(
    senadores.map(async (senador: Senador) => {
      try {
        // const response = await fetch(
        //   `https://www.senado.gob.ar/bundles/senadosenadores/images/fsena/${senador.id}.gif`,
        //   // increase timeout for slow connections
        //   { timeout: 30000 },
        // )
        //
        // if (response.ok) {
        //   const dataBuffer = Buffer.from(await response.arrayBuffer())
        //
        //   const path = writeStaticBuffer(`/senadores/${senador.id}.gif`, dataBuffer)
        //
        //   return getStaticPublicUrl(path)
        // }

        const response = await axios.get(
          `https://www.senado.gob.ar/bundles/senadosenadores/images/fsena/${senador.id}.gif`,
          { responseType: 'arraybuffer' },
        )

        if (response.status === 200) {
          const dataBuffer = Buffer.from(response.data)

          const path = writeStaticBuffer(
            `/senadores/${senador.id}.gif`,
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

  writeEndpoint(
    '/senadores',
    senadores.map((senador: Senador, i: number) => ({
      ...senador,
      foto: photos[i],
    })),
  )

  return senadores
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
