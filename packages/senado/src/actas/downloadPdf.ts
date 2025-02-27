import { getStaticPath } from '@argentinadatos/core/src/utils/getStaticPath.ts'
import { readStaticBuffer } from '@argentinadatos/core/src/utils/readStaticBuffer.ts'
import { writeStaticBuffer } from '@argentinadatos/core/src/utils/writeStaticBuffer.ts'
import axios from 'axios'

export const BASE_URL = 'https://www.senado.gob.ar/votaciones/verActaVotacion/'

export async function downloadPdf(actaId: number): Promise<string | null> {
  const path = getStaticPath(`/senado/actas/pdf/${actaId}.pdf`)

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
