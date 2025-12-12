import type { Acta } from '../crawlActas.ts'
import { createClient } from '@libsql/client'
import { MigrationRunner } from './migrations/migration-runner.ts'

export class ActasDatabaseService {
  private db: any
  private migrationRunner: MigrationRunner

  constructor(url: string, authToken: string) {
    this.db = createClient({
      url,
      authToken,
    })
    this.migrationRunner = new MigrationRunner(this.db)
  }

  async initialize() {
    await this.migrationRunner.runPendingMigrations()
  }

  private sanitizeNumber(value: any): number | null {
    if (value === null || value === undefined) {
      return null
    }
    const num = Number(value)
    if (isNaN(num) || !isFinite(num)) {
      return null
    }
    return num
  }

  async insertActa(acta: Acta, año: number, timestamp: string) {
    const safeAño = this.sanitizeNumber(año)
    if (safeAño === null || safeAño === undefined) {
      throw new Error(`Invalid año value: ${año}`)
    }

    await this.db.execute({
      sql: `
        INSERT OR REPLACE INTO diputados_actas (actaId, año, periodo, reunion, numeroActa, titulo, resultado, fecha, presidente, votosAfirmativos, votosNegativos, abstenciones, ausentes, data, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        this.sanitizeNumber(acta.id),
        safeAño,
        acta.periodo || null,
        acta.reunion || null,
        acta.numeroActa || null,
        acta.titulo || null,
        acta.resultado || null,
        acta.fecha ? acta.fecha.toISOString() : null,
        acta.presidente || null,
        this.sanitizeNumber(acta.votosAfirmativos),
        this.sanitizeNumber(acta.votosNegativos),
        this.sanitizeNumber(acta.abstenciones),
        this.sanitizeNumber(acta.ausentes),
        JSON.stringify(acta),
        timestamp,
      ],
    })
  }

  async insertBatchActas(items: Array<{ acta: Acta, año: number, timestamp: string }>) {
    if (items.length === 0) {
      return
    }

    const validItems = items.filter(item => {
      const año = this.sanitizeNumber(item.año)
      return año !== null && año !== undefined
    })

    if (validItems.length === 0) {
      return
    }

    const CHUNK_SIZE = 100
    for (let i = 0; i < validItems.length; i += CHUNK_SIZE) {
      const chunk = validItems.slice(i, i + CHUNK_SIZE)
      const statements = chunk.map((item) => {
        const safeActaFecha = this.getActaFecha(item)
        const safeAño = this.sanitizeNumber(item.año)

        return ({
          sql: `
        INSERT OR REPLACE INTO diputados_actas (actaId, año, periodo, reunion, numeroActa, titulo, resultado, fecha, presidente, votosAfirmativos, votosNegativos, abstenciones, ausentes, data, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
          args: [
            this.sanitizeNumber(item.acta.id),
            safeAño,
            item.acta.periodo || null,
            item.acta.reunion || null,
            item.acta.numeroActa || null,
            item.acta.titulo || null,
            item.acta.resultado || null,
            safeActaFecha,
            item.acta.presidente || null,
            this.sanitizeNumber(item.acta.votosAfirmativos),
            this.sanitizeNumber(item.acta.votosNegativos),
            this.sanitizeNumber(item.acta.abstenciones),
            this.sanitizeNumber(item.acta.ausentes),
            JSON.stringify(item.acta),
            item.timestamp,
          ],
        })
      })

      await this.db.batch(statements)
    }
  }

  private getActaFecha(item: { acta: Acta }) {
    try {
      return item.acta.fecha ? new Date(item.acta.fecha).toISOString() : null
    }
    catch (error) {
      return null
    }
  }

  async getActasByAño(año: number) {
    const safeAño = this.sanitizeNumber(año)
    if (safeAño === null || safeAño === undefined) {
      return []
    }

    const result = await this.db.execute({
      sql: `
        SELECT data
        FROM diputados_actas
        WHERE año = ?
        ORDER BY fecha ASC
      `,
      args: [safeAño],
    })
    return result.rows.map((row: any) => {
      const acta = JSON.parse(row.data)
      return {
        ...acta,
        fecha: new Date(acta.fecha),
      }
    })
  }

  async getAllActas() {
    const result = await this.db.execute({
      sql: `
        SELECT data
        FROM diputados_actas
        ORDER BY fecha ASC
      `,
    })
    return result.rows.map((row: any) => {
      const acta = JSON.parse(row.data)
      return {
        ...acta,
        fecha: new Date(acta.fecha),
      }
    })
  }

  close() {
    this.db.close()
  }
}
