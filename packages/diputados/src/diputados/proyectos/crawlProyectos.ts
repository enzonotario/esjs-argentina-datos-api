// import * as cheerio from 'cheerio'
// import { formatISO, parseISO } from 'date-fns'
// import { BASE_URL } from '../../constants.ts'
// import { writeEndpoint } from '../../utils/writeEndpoint.ts'
//
// export interface Proyecto {
//   id: string
//   expedienteId: string
//   cabecera: string
//   dictamenTipo: string
//   ordenNumero: number
//   ordenPublicacion: string
//   fecha: string
//   resultado: string
// }
//
// export async function crawlProyectos(
//   { year }: { year: number } = { year: new Date().getFullYear() },
// ): Promise<Proyecto[]> {
//   return await processWeb({ year })
// }
//
// async function processWeb({ year }: { year: number }): Promise<Proyecto[]> {
//   const page = await parsePage(`${BASE_URL}/dataset/resultado-proyectos`)
//
//   const csvPage = await parseCsvPage(page.csvPageUrl)
//
//   const csv = await getCsv(csvPage.csvUrl)
//
//   const proyectos = parseCsv(csv)
//     .filter((proyecto) => {
//       return proyecto.fecha.startsWith(`${year}-`)
//     })
//
//   writeEndpoint('proyectos', proyectos)
//
//   return proyectos
// }
//
// async function parsePage(url: string): Promise<any> {
//   const response = await fetch(url)
//
//   const html = await response.text()
//
//   const $ = cheerio.load(html)
//
//   const csvPageRelativeUrl = $('a.heading').attr('href')
//
//   if (!csvPageRelativeUrl) {
//     throw new Error('CSV Page URL not found')
//   }
//
//   const csvPageUrl = `${BASE_URL}${csvPageRelativeUrl}`
//
//   return {
//     csvPageUrl,
//   }
// }
//
// async function parseCsvPage(url: string): Promise<any> {
//   const response = await fetch(url)
//
//   const html = await response.text()
//
//   const $ = cheerio.load(html)
//
//   const csvUrl = $('a[href$=".csv"]').attr('href')
//
//   if (!csvUrl) {
//     throw new Error('CSV URL not found')
//   }
//
//   return {
//     csvUrl,
//   }
// }
//
// async function getCsv(url: string): Promise<string> {
//   const response = await fetch(url)
//
//   const csv = await response.text()
//
//   /**
//    * csv is like:
//    * "Expediente.ID","Cabecera","Dictamen.Tipo","OD.Número","OD.Publicación","Fecha","Resultado"
//    * "HCDN127617","HCDN127617","Orden del Dia",2408,"2011-09-01T00:00:00","",""
//    * "HCDN126022","HCDN126022","Orden del Dia",859,"2012-09-07T00:00:00","",""
//    * "HCDN160776","HCDN160776","Orden del Dia",169,"2014-05-27T00:00:00","",""
//    * "HCDN160776","cabecera","Orden del Dia",169,"2014-05-27T00:00:00","1899-12-30T00:00:00","APROBADO"
//    * "HCDN092906","cabecera","Orden del Dia",346,"2008-06-06T00:00:00","",""
//    * "HCDN095064","cabecera","Orden del Dia",420,"2008-06-19T00:00:00","2008-08-20T00:00:00","APROBADO"
//    * "HCDN137519","cabecera","Orden del Dia",649,"2012-08-13T00:00:00","1899-12-30T00:00:00","APROBADO"
//    * "HCDN112869","cabecera","Orden del Dia",153,"2010-04-19T00:00:00","2010-05-12T00:00:00","APROBADO"
//    * "HCDN103502","cabecera","Orden del Dia",1740,"2009-06-02T00:00:00","2009-08-05T00:00:00","APROBADO"
//    */
//
//   return csv
// }
//
// function parseCsv(csv: string): Proyecto[] {
//   const lines = csv.split('\n')
//
//   const items = lines
//     .slice(1)
//     .map((line) => {
//       const fields = line.split(',')
//         .map(field => field.replace(/^"|"$/g, '')) // Remove quotes.
//         // Remove `\"\r` from the end of the line.
//         .map(field => field.replace(/"\r$/, ''))
//
//       if (fields.length < 7) {
//         return null
//       }
//
//       const expedienteId = fields[0]
//
//       return {
//         id: String(expedienteId),
//         expedienteId,
//         cabecera: fields[1],
//         dictamenTipo: fields[2],
//         ordenNumero: Number.parseInt(fields[3]),
//         ordenPublicacion: fields[4],
//         fecha: fields[5],
//         resultado: fields[6],
//       }
//     })
//     .filter(item => item !== null)
//
//   return items
// }
//
// function parseFecha(fecha: string): string | null {
//   try {
//     return formatISO(parseISO(fecha))
//   }
//   catch (error) {
//     console.warn('Invalid fecha', {
//       fecha,
//       error,
//     })
//     return null
//   }
// }
