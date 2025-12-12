export const migration_001_initial_schema = {
  version: 1,
  name: 'initial_schema',

  async up(db: any) {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS diputados (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        diputadoId TEXT NOT NULL,
        nombre TEXT NOT NULL,
        apellido TEXT,
        genero TEXT,
        provincia TEXT,
        periodoMandatoInicio TEXT,
        periodoMandatoFin TEXT,
        juramentoFecha TEXT,
        ceseFecha TEXT,
        bloque TEXT,
        periodoBloqueInicio TEXT,
        periodoBloqueFin TEXT,
        foto TEXT,
        data TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `)

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_diputados_diputadoId ON diputados(diputadoId)
    `)

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_diputados_timestamp ON diputados(timestamp)
    `)

    await db.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_diputados_diputadoId_unique ON diputados(diputadoId)
    `)
  },

  async down(db: any) {
    await db.execute('DROP INDEX IF EXISTS idx_diputados_diputadoId_unique')
    await db.execute('DROP INDEX IF EXISTS idx_diputados_timestamp')
    await db.execute('DROP INDEX IF EXISTS idx_diputados_diputadoId')
    await db.execute('DROP TABLE IF EXISTS diputados')
  },
}


