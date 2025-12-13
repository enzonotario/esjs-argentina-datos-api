import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { HipotecariosUvaDatabaseService } from '@/finanzas/hipotecariosUva/database/service.esjs'

const TEST_URL = import.meta.env.VITE_TURSO_DATABASE_URL || 'libsql://test.turso.io'
const TEST_AUTH_TOKEN = import.meta.env.VITE_TURSO_AUTH_TOKEN || 'test-token'

describe('HipotecariosUvaDatabaseService', () => {
  let db

  beforeEach(async () => {
    db = new HipotecariosUvaDatabaseService(TEST_URL, TEST_AUTH_TOKEN)
    await db.initialize()
  })

  afterEach(() => {
    if (db) {
      db.close()
    }
  })

  it('inicializa la base de datos correctamente', () => {
    expect(db).toBeDefined()
  })

  it('inserta un TNA', async () => {
    const timestamp = new Date().toISOString()
    await db.insertTna('BANCO NACIÓN ARGENTINA', 'Banco Nación', 6, timestamp)

    const ultimo = await db.getLatestTnaByEntidad('BANCO NACIÓN ARGENTINA')

    expect(ultimo).toBeDefined()
    expect(ultimo.entidad).toBe('BANCO NACIÓN ARGENTINA')
    expect(ultimo.nombreComercial).toBe('Banco Nación')
    expect(ultimo.tna).toBe(6)
    expect(ultimo.timestamp).toBe(timestamp)
  })

  it('obtiene el ultimo TNA por entidad', async () => {
    const timestamp1 = new Date(Date.now() - 1000).toISOString()
    const timestamp2 = new Date().toISOString()

    await db.insertTna('BANCO BBVA ARGENTINA', 'BBVA', 7.5, timestamp1)
    await db.insertTna('BANCO BBVA ARGENTINA', 'BBVA', 8, timestamp2)

    const ultimo = await db.getLatestTnaByEntidad('BANCO BBVA ARGENTINA')

    expect(ultimo.tna).toBe(8)
  })

  it('obtiene todos los ultimos TNA', async () => {
    const timestamp = new Date().toISOString()

    await db.insertTna('BANCO CIUDAD', 'Banco Ciudad', 9.3, timestamp)
    await db.insertTna('BANCO DEL SOL', 'Banco del Sol', 9, timestamp)

    const todos = await db.getAllLatestTna()

    expect(todos.length).toBeGreaterThanOrEqual(2)
    expect(todos.find(r => r.entidad === 'BANCO CIUDAD')).toBeDefined()
    expect(todos.find(r => r.entidad === 'BANCO DEL SOL')).toBeDefined()
  })

  it('retorna null si no existe la entidad', async () => {
    const ultimo = await db.getLatestTnaByEntidad('BANCO INEXISTENTE')

    expect(ultimo).toBeNull()
  })

  it('inserta en batch correctamente', async () => {
    const timestamp = new Date().toISOString()
    const items = [
      { entidad: 'BANCO COMAFI', nombreComercial: 'Comafi', tna: 10.5, timestamp },
      { entidad: 'BANCO ICBC', nombreComercial: 'ICBC', tna: 11, timestamp },
    ]

    await db.insertBatchTna(items)

    const todos = await db.getAllLatestTna()
    expect(todos.find(r => r.entidad === 'BANCO COMAFI')).toBeDefined()
    expect(todos.find(r => r.entidad === 'BANCO ICBC')).toBeDefined()
  })
})

