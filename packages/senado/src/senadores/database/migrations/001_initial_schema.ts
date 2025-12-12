export const migration_001_initial_schema = {
  version: 1,
  name: 'initial_schema',

  async up(db: any) {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS senadores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        senadorId TEXT NOT NULL,
        nombre TEXT NOT NULL,
        provincia TEXT,
        partido TEXT,
        periodoLegalInicio TEXT,
        periodoLegalFin TEXT,
        periodoRealInicio TEXT,
        periodoRealFin TEXT,
        reemplazo TEXT,
        observaciones TEXT,
        foto TEXT,
        email TEXT,
        telefono TEXT,
        redes TEXT,
        data TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `)

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_senadores_senadorId ON senadores(senadorId)
    `)

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_senadores_timestamp ON senadores(timestamp)
    `)

    await db.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_senadores_senadorId_unique ON senadores(senadorId)
    `)
  },

  async down(db: any) {
    await db.execute('DROP INDEX IF EXISTS idx_senadores_senadorId_unique')
    await db.execute('DROP INDEX IF EXISTS idx_senadores_timestamp')
    await db.execute('DROP INDEX IF EXISTS idx_senadores_senadorId')
    await db.execute('DROP TABLE IF EXISTS senadores')
  },
}


