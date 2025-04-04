import type { VotoData } from './parseActa.ts'
import { readStaticBuffer } from '@argentinadatos/core/src/utils/readStaticBuffer.ts'
import { pdfToText } from 'pdf-ts'
import { VotoEnum } from './parseActa.ts'

async function extract(pdfPath: string): Promise<string> {
  const dataBuffer = readStaticBuffer(pdfPath)

  if (!dataBuffer) {
    throw new Error(`No se pudo leer el archivo ${pdfPath}`)
  }

  return await pdfToText(dataBuffer)
}

export async function parseVotos(pdfPath: string): Promise<VotoData[]> {
  const text = await extract(pdfPath)

  const lines = text.split('\n').map(line => line.trim())

  let votesLines: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (
      line === 'Nombre Completo'
      && lines[i + 1] === 'Voto'
      && lines[i + 2] === 'Banca'
    ) {
      votesLines = lines
        .slice(i + 3)
        .filter(
          line =>
            line !== 'Nombre Completo' && line !== 'Voto' && line !== 'Banca',
        )

      break
    }
  }

  return parseRows(votesLines)
}

function parseRows(lines: string[]): VotoData[] {
  const row: VotoData[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (/^\d+\./.test(line)) {
      const nombre = line.replace(/^\d+\.\s+/, '')
      const voto = getVotoEnum(lines[i + 1].toLowerCase())

      if (voto.toLowerCase() === 'ausente') {
        row.push({ nombre, voto, banca: '' })
      }
      else {
        const banca = lines[i + 2]
        row.push({ nombre, voto, banca })
      }
    }
  }

  return row
}

function getVotoEnum(voto: string): VotoEnum | string {
  switch (voto) {
    case 'si':
      return VotoEnum.Si
    case 'no':
      return VotoEnum.No
    case 'ausente':
      return VotoEnum.Ausente
    case 'abs.':
      return VotoEnum.Abstencion
    case 'no emit.':
      return VotoEnum.NoEmite
    case 'lev.vot.':
      return VotoEnum.LevVot
    default:
      console.warn(`Voto desconocido: ${voto}`)
      return voto
  }
}
