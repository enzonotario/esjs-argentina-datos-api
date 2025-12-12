export const migration_001_initial_schema = {
  version: 1,
  name: 'initial_schema',

  async up(db: any) {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS diputados_actas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        actaId TEXT NOT NULL,
        año INTEGER NOT NULL,
        periodo TEXT,
        reunion TEXT,
        numeroActa TEXT,
        titulo TEXT,
        resultado TEXT,
        fecha TEXT,
        presidente TEXT,
        votosAfirmativos INTEGER,
        votosNegativos INTEGER,
        abstenciones INTEGER,
        ausentes INTEGER,
        data TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `)

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_diputados_actas_actaId ON diputados_actas(actaId)
    `)

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_diputados_actas_año ON diputados_actas(año)
    `)

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_diputados_actas_timestamp ON diputados_actas(timestamp)
    `)

    await db.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_diputados_actas_actaId_año_unique ON diputados_actas(actaId, año)
    `)
  },

  async down(db: any) {
    await db.execute('DROP INDEX IF EXISTS idx_diputados_actas_actaId_año_unique')
    await db.execute('DROP INDEX IF EXISTS idx_diputados_actas_timestamp')
    await db.execute('DROP INDEX IF EXISTS idx_diputados_actas_año')
    await db.execute('DROP INDEX IF EXISTS idx_diputados_actas_actaId')
    await db.execute('DROP TABLE IF EXISTS diputados_actas')
  },
}

