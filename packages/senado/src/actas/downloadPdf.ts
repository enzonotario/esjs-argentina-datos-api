import axios from 'axios'
import { getStaticPath } from '../utils/getStaticPath.ts'
import { readStaticBuffer } from '../utils/readStaticBuffer.ts'
import { writeStaticBuffer } from '../utils/writeStaticBuffer.ts'

export const BASE_URL = 'https://www.senado.gob.ar/votaciones/verActaVotacion/'

export async function downloadPdf(actaId: number): Promise<string | null> {
  const path = getStaticPath(`/actas/pdf/${actaId}.pdf`)

  const currentPdf = readStaticBuffer(path)

  if (currentPdf) {
    return path
  }

  const url = `${BASE_URL}${actaId}`

  const response = await axios.get(url, {
    headers: { Accept: 'application/pdf' },
    responseType: 'arraybuffer',
  })

  return writeStaticBuffer(path, response.data)
}
