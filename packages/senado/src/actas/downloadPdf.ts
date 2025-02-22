import axios from 'axios'
import { getStaticPath } from '../utils/getStaticPath.ts'
import { readStaticPdf } from '../utils/readStaticPdf.ts'
import { writeStaticPdf } from '../utils/writeStaticPdf.ts'

export const BASE_URL = 'https://www.senado.gob.ar/votaciones/verActaVotacion/'

export async function downloadPdf(actaId: number): Promise<string | null> {
  const path = getStaticPath(`/actas/pdf/${actaId}.pdf`)

  const currentPdf = readStaticPdf(path)

  if (currentPdf) {
    console.log(`🔍 Encontrado: ${actaId}.pdf`)
    return path
  }

  const url = `${BASE_URL}${actaId}`

  const response = await axios.get(url, {
    headers: { Accept: 'application/pdf' },
    responseType: 'arraybuffer',
  })

  return writeStaticPdf(path, response.data)
}
