import axios from 'axios'
import { writeStaticPdf } from '../utils/writeStaticPdf.ts'

export const BASE_URL = 'https://www.senado.gob.ar/votaciones/verActaVotacion/'

export async function downloadPdf(actaId: number): Promise<string | null> {
  const url = `${BASE_URL}${actaId}`

  const response = await axios.get(url, {
    headers: { Accept: 'application/pdf' },
    responseType: 'arraybuffer',
  })

  const pdfPath = writeStaticPdf(`actas/pdf/${actaId}.pdf`, response.data)

  console.log(`✅ Descargado: ${actaId}.pdf`)

  return pdfPath
}
