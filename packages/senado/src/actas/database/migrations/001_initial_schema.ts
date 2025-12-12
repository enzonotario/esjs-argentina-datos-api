export const migration_001_initial_schema = {
  version: 1,
  name: 'initial_schema',

  async up(db: any) {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS senado_actas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        actaId INTEGER NOT NULL,
        año INTEGER NOT NULL,
        titulo TEXT,
        fecha TEXT,
        votosAfirmativos INTEGER,
        votosNegativos INTEGER,
        abstenciones INTEGER,
        ausentes INTEGER,
        presidente TEXT,
        data TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `)

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_senado_actas_actaId ON senado_actas(actaId)
    `)

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_senado_actas_año ON senado_actas(año)
    `)

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_senado_actas_timestamp ON senado_actas(timestamp)
    `)

    await db.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_senado_actas_actaId_año_unique ON senado_actas(actaId, año)
    `)
  },

  async down(db: any) {
    await db.execute('DROP INDEX IF EXISTS idx_senado_actas_actaId_año_unique')
    await db.execute('DROP INDEX IF EXISTS idx_senado_actas_timestamp')
    await db.execute('DROP INDEX IF EXISTS idx_senado_actas_año')
    await db.execute('DROP INDEX IF EXISTS idx_senado_actas_actaId')
    await db.execute('DROP TABLE IF EXISTS senado_actas')
  },
}
