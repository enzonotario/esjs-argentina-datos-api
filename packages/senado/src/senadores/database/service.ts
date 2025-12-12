import { createClient } from '@libsql/client'
import { MigrationRunner } from './migrations/migration-runner.ts'
import type { Senador } from '../crawlSenadores.ts'

export class SenadoresDatabaseService {
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

  async insertSenador(senador: Senador, timestamp: string) {
    await this.db.execute({
      sql: `
        INSERT OR REPLACE INTO senadores (senadorId, nombre, provincia, partido, periodoLegalInicio, periodoLegalFin, periodoRealInicio, periodoRealFin, reemplazo, observaciones, foto, email, telefono, redes, data, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        this.sanitizeNumber(senador.id),
        senador.nombre,
        senador.provincia || null,
        senador.partido || null,
        senador.periodoLegal.inicio || null,
        senador.periodoLegal.fin || null,
        senador.periodoReal.inicio || null,
        senador.periodoReal.fin || null,
        senador.reemplazo || null,
        senador.observaciones || null,
        senador.foto || null,
        senador.email || null,
        senador.telefono || null,
        senador.redes ? JSON.stringify(senador.redes) : null,
        JSON.stringify(senador),
        timestamp,
      ],
    })
  }

  async insertBatchSenadores(items: Array<{ senador: Senador, timestamp: string }>) {
    if (items.length === 0) {
      return
    }

    const CHUNK_SIZE = 100
    for (let i = 0; i < items.length; i += CHUNK_SIZE) {
      const chunk = items.slice(i, i + CHUNK_SIZE)
      const statements = chunk.map(item => ({
        sql: `
        INSERT OR REPLACE INTO senadores (senadorId, nombre, provincia, partido, periodoLegalInicio, periodoLegalFin, periodoRealInicio, periodoRealFin, reemplazo, observaciones, foto, email, telefono, redes, data, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        args: [
          this.sanitizeNumber(item.senador.id),
          item.senador.nombre,
          item.senador.provincia || null,
          item.senador.partido || null,
          item.senador.periodoLegal.inicio || null,
          item.senador.periodoLegal.fin || null,
          item.senador.periodoReal.inicio || null,
          item.senador.periodoReal.fin || null,
          item.senador.reemplazo || null,
          item.senador.observaciones || null,
          item.senador.foto || null,
          item.senador.email || null,
          item.senador.telefono || null,
          item.senador.redes ? JSON.stringify(item.senador.redes) : null,
          JSON.stringify(item.senador),
          item.timestamp,
        ],
      }))

      await this.db.batch(statements)
    }
  }

  async getAllSenadores() {
    const result = await this.db.execute({
      sql: `
        SELECT data
        FROM senadores
        ORDER BY nombre ASC
      `,
    })
    return result.rows.map((row: any) => JSON.parse(row.data))
  }

  close() {
    this.db.close()
  }
}

