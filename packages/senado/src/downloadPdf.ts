import fs from 'node:fs'
import path from 'node:path'
import axios from 'axios'
import { DATOS_PATH } from "./constants.ts";

export const BASE_URL = 'https://www.senado.gob.ar/votaciones/verActaVotacion/'

export async function downloadPdf(actaId: number): Promise<string | null> {
  fs.mkdirSync(`${DATOS_PATH}/actas/pdf`, { recursive: true })

  const url = `${BASE_URL}${actaId}`
  try {
    const response = await axios.get(url, {
      headers: { Accept: 'application/pdf' },
      responseType: 'arraybuffer',
    })
    const pdfPath = path.join(DATOS_PATH, 'actas', 'pdf', `${actaId}.pdf`)
    fs.writeFileSync(pdfPath, response.data)
    console.log(`✅ Descargado: ${actaId}.pdf`)
    return pdfPath
  }
  catch (error) {
    console.error(`❌ Error al descargar Acta ${actaId}:`, error)
    return null
  }
}
