import type { ActaData } from '../actas/parseActa.ts'
import fs from 'node:fs'
import path from 'node:path'
import { DATOS_PATH } from '@argentinadatos/core/src/constants.ts'
import { readEndpoint } from '@argentinadatos/core/src/utils/readEndpoint.ts'
import { writeEndpoint } from '@argentinadatos/core/src/utils/writeEndpoint.ts'
import { collect } from 'collect.js'

export async function compileActasIndex(): Promise<void> {
  const actasBasePath = path.resolve(DATOS_PATH, 'senado/actas')
  const years = fs.readdirSync(actasBasePath)
    .filter((item) => {
      const itemPath = path.join(actasBasePath, item)
      return fs.statSync(itemPath).isDirectory() && /^\d{4}$/.test(item)
    })
    .map(year => Number.parseInt(year, 10))
    .sort()

  console.log(`Found ${years.length} years to process`)

  const allActas: ActaData[] = []

  for (const year of years) {
    console.log(`Processing year ${year}...`)

    const yearPath = path.join(actasBasePath, year.toString())
    const actaIds = fs.readdirSync(yearPath)
      .filter((item) => {
        const itemPath = path.join(yearPath, item)
        return fs.statSync(itemPath).isDirectory() && item !== 'index.json'
      })
      .map(id => Number.parseInt(id, 10))
      .sort()

    console.log(`Found ${actaIds.length} actas for year ${year}`)

    const actas: ActaData[] = []
    for (const actaId of actaIds) {
      const actaData = readEndpoint(`/senado/actas/${year}/${actaId}`)
      if (actaData) {
        try {
          const acta = JSON.parse(actaData) as ActaData
          actas.push(acta)
          allActas.push(acta)
        }
        catch (error) {
          console.error(`Error parsing acta ${actaId} for year ${year}:`, error)
        }
      }
    }

    const sortedActas = collect(actas)
      .sortBy('actaId')
      .all()

    writeEndpoint(`/senado/actas/${year}`, sortedActas)
    console.log(`Wrote ${sortedActas.length} actas to index.json for year ${year}`)
  }

  const sortedAllActas = collect(allActas)
    .sortBy('actaId')
    .all()

  writeEndpoint('/senado/actas', sortedAllActas)
  console.log(`Wrote ${sortedAllActas.length} actas to combined index.json`)

  console.log('Compilation of actas index completed successfully')
}

if (require.main === module) {
  compileActasIndex()
    .then(() => console.log('Done!'))
    .catch(error => console.error('Error:', error))
}
