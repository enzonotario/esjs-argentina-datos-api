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

  async insertActa(actaId: number, año: number, data: any, timestamp: string) {
    const safeActaId = this.sanitizeNumber(actaId)
    const safeAño = this.sanitizeNumber(año)
    
    if (safeActaId === null || safeActaId === undefined) {
      throw new Error(`Invalid actaId value: ${actaId}`)
    }
    if (safeAño === null || safeAño === undefined) {
      throw new Error(`Invalid año value: ${año}`)
    }

    await this.db.execute({
      sql: `
        INSERT OR REPLACE INTO senado_actas (actaId, año, titulo, fecha, votosAfirmativos, votosNegativos, abstenciones, ausentes, presidente, data, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        safeActaId,
        safeAño,
        data.titulo || null,
        data.fecha || null,
        this.sanitizeNumber(data.votosAfirmativos),
        this.sanitizeNumber(data.votosNegativos),
        this.sanitizeNumber(data.abstenciones),
        this.sanitizeNumber(data.ausentes),
        data.presidente || null,
        JSON.stringify(data),
        timestamp,
      ],
    })
  }

  async insertBatchActas(items: Array<{ actaId: number, año: number, data: any, timestamp: string }>) {
    if (items.length === 0) {
      return
    }

    const validItems = items.filter(item => {
      const actaId = this.sanitizeNumber(item.actaId)
      const año = this.sanitizeNumber(item.año)
      return actaId !== null && actaId !== undefined && año !== null && año !== undefined
    })

    if (validItems.length === 0) {
      return
    }

    const CHUNK_SIZE = 100
    for (let i = 0; i < validItems.length; i += CHUNK_SIZE) {
      const chunk = validItems.slice(i, i + CHUNK_SIZE)
      const statements = chunk.map(item => {
        const safeActaId = this.sanitizeNumber(item.actaId)
        const safeAño = this.sanitizeNumber(item.año)

        return {
          sql: `
        INSERT OR REPLACE INTO senado_actas (actaId, año, titulo, fecha, votosAfirmativos, votosNegativos, abstenciones, ausentes, presidente, data, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
          args: [
            safeActaId,
            safeAño,
            item.data.titulo || null,
            item.data.fecha || null,
            this.sanitizeNumber(item.data.votosAfirmativos),
            this.sanitizeNumber(item.data.votosNegativos),
            this.sanitizeNumber(item.data.abstenciones),
            this.sanitizeNumber(item.data.ausentes),
            item.data.presidente || null,
            JSON.stringify(item.data),
            item.timestamp,
          ],
        }
      })

      await this.db.batch(statements)
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
        FROM senado_actas
        WHERE año = ?
        ORDER BY actaId ASC
      `,
      args: [safeAño],
    })
    return result.rows.map((row: any) => JSON.parse(row.data))
  }

  async getAllActas() {
    const result = await this.db.execute({
      sql: `
        SELECT data
        FROM senado_actas
        ORDER BY año DESC, actaId ASC
      `,
    })
    return result.rows.map((row: any) => JSON.parse(row.data))
  }

  close() {
    this.db.close()
  }
}

