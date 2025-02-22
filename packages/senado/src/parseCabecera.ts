import type { ActaData } from './parseActa.ts'
import {
  parse as parseDate,
} from 'date-fns'
import { PdfDataParser } from 'pdf-data-parser'
import { ResultadoEnum } from './parseActa.ts'

async function extract(pdfPath: string): Promise<any> {
  const parser = new PdfDataParser({ url: pdfPath })

  return await parser.parse()
}

export async function parseCabecera(pdfPath: string): Promise<ActaData> {
  const data = await extract(pdfPath)

  const result: ActaData = {
    proyecto: '',
    descripcion: '',
    quorumTipo: '',
    fecha: '',
    acta: '',
    mayoria: '',
    miembros: 0,
    afirmativos: 0,
    negativos: 0,
    abstenciones: 0,
    presentes: 0,
    ausentes: 0,
    amn: 0,
    resultado: '',
    votos: [],
    observaciones: [],
  }

  /**
   * result is like:
   *     {
   *         "actaId": 2529,
   *         "titulo": "Habilitación del tratamiento sobre tablas para la interpelación al Jefe de Gabinete.",
   *         "proyecto": "MOCION SOBRE TABLAS Nº 2530/24",
   *         "descripcion": "VOTACION SIN NOMENCLAR",
   *         "quorumTipo": "MAS 1/2 MC",
   *         "fecha": "20/02/2025 16:29:45",
   *         "acta": "5",
   *         "mayoria": "DOS TERCIOS LEGISLADORES PRESENTES",
   *         "miembros": 72,
   *         "afirmativos": 42,
   *         "negativos": 23,
   *         "abstenciones": 0,
   *         "presentes": 65,
   *         "ausentes": 7,
   *         "amn": 44,
   *         "resultado": "negativa",
   *         "votos": [
   *         ],
   *         "observaciones": []
   *     }
   */

  let inObservationsSection = false

  for (const line of data) {
    // Start of observations section
    if (line.includes('Observaciones:')) {
      inObservationsSection = true
      continue
    }

    // Capture observations
    if (inObservationsSection) {
      // result.observaciones += line.join(" ") + "\n";
      result.observaciones.push(line.join(' ').trim())
      continue
    }

    // Start of votes section
    if (
      line.includes('Nombre Completo')
      && line.includes('Voto')
      && line.includes('Banca')
    ) {
      continue
    }

    // Process key-value pairs before votes and observations sections
    let i = 0
    while (i < line.length) {
      if (line[i].endsWith(':')) {
        const key = line[i].slice(0, -1).trim() // Remove the ":"
        i++
        let value = ''
        while (i < line.length && !line[i].endsWith(':')) {
          value += `${line[i]} `
          i++
        }
        value = value.trim()

        // Map keys to result properties
        switch (key) {
          case 'Proyecto':
            result.proyecto = value
            break
          case 'Descripción':
            result.descripcion = value
            break
          case 'Tipo Quorum':
            result.quorumTipo = value
            break
          case 'Fecha':
            result.fecha = parseFecha(value)
            break
          case 'Acta':
            result.acta = value
            break
          case 'Mayoría':
            result.mayoria = value
            break
          case 'Miembros del cuerpo':
            result.miembros = Number.parseInt(value) || 0
            break
          case 'Afirmativos':
            result.afirmativos = Number.parseInt(value) || 0
            break
          case 'Negativos':
            result.negativos = Number.parseInt(value) || 0
            break
          case 'Abstenciones':
            result.abstenciones = Number.parseInt(value) || 0
            break
          case 'Presentes':
            result.presentes = Number.parseInt(value) || 0
            break
          case 'Ausentes':
            result.ausentes = Number.parseInt(value) || 0
            break
          case 'AMN':
            result.amn = Number.parseInt(value) || 0
            break
          case 'Resultado':
            result.resultado = parseResultado(value)
            break
        }
      }
      else {
        i++
      }
    }
  }

  return result
}

function parseResultado(resultado: string): ResultadoEnum | string {
  switch (resultado.toLowerCase()) {
    case 'afirmativa':
      return ResultadoEnum.Afirmativa
    case 'negativa':
      return ResultadoEnum.Negativa
    case 'cancelada lev.vot.':
      return ResultadoEnum.CanceladaLevVot
    default:
      return resultado
  }
}

function parseFecha(fecha: string): string {
  return parseDate(fecha, 'dd/MM/yyyy HH:mm:ss', new Date()).toISOString()
}
