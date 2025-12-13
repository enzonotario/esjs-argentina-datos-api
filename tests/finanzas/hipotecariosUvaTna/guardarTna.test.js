import { describe, expect, it } from 'vitest'
import { guardarTna } from '@/finanzas/hipotecariosUva/guardado/guardarTna.esjs'
import { HipotecariosUvaDatabaseService } from '@/finanzas/hipotecariosUva/database/service.esjs'
import { leerRuta } from '@/utils/rutas.esjs'

const TEST_URL = import.meta.env.VITE_TURSO_DATABASE_URL || 'libsql://test.turso.io'
const TEST_AUTH_TOKEN = import.meta.env.VITE_TURSO_AUTH_TOKEN || 'test-token'

describe('guardarTna', () => {
  it('guarda nuevos valores en la base de datos', async () => {
    const items = [
      { entidad: 'BANCO NACIÓN ARGENTINA', nombreComercial: 'Banco Nación', tnaPorcentaje: 6 },
    ]

    await guardarTna(items, TEST_URL, TEST_AUTH_TOKEN)

    const db = new HipotecariosUvaDatabaseService(TEST_URL, TEST_AUTH_TOKEN)
    await db.initialize()
    const ultimo = await db.getLatestTnaByEntidad('BANCO NACIÓN ARGENTINA')
    db.close()

    expect(ultimo).toBeDefined()
    expect(ultimo.entidad).toBe('BANCO NACIÓN ARGENTINA')
    expect(ultimo.nombreComercial).toBe('Banco Nación')
    expect(ultimo.tna).toBe(6)
  })

  it('no guarda valores duplicados', async () => {
    const items = [
      { entidad: 'BANCO BBVA ARGENTINA', nombreComercial: 'BBVA', tnaPorcentaje: 7.5 },
    ]

    await guardarTna(items, TEST_URL, TEST_AUTH_TOKEN)
    await guardarTna(items, TEST_URL, TEST_AUTH_TOKEN)

    const db = new HipotecariosUvaDatabaseService(TEST_URL, TEST_AUTH_TOKEN)
    await db.initialize()
    const todos = await db.getAllLatestTna()
    db.close()

    const bbvaEntries = todos.filter(r => r.entidad === 'BANCO BBVA ARGENTINA')
    expect(bbvaEntries.length).toBeGreaterThanOrEqual(1)
  })

  it('guarda valores cuando cambian', async () => {
    const items1 = [
      { entidad: 'BANCO DEL SOL', nombreComercial: 'Banco del Sol', tnaPorcentaje: 9 },
    ]

    const items2 = [
      { entidad: 'BANCO DEL SOL', nombreComercial: 'Banco del Sol', tnaPorcentaje: 9.5 },
    ]

    await guardarTna(items1, TEST_URL, TEST_AUTH_TOKEN)
    await guardarTna(items2, TEST_URL, TEST_AUTH_TOKEN)

    const db = new HipotecariosUvaDatabaseService(TEST_URL, TEST_AUTH_TOKEN)
    await db.initialize()
    const ultimo = await db.getLatestTnaByEntidad('BANCO DEL SOL')
    db.close()

    expect(ultimo.tna).toBe(9.5)
  })

  it('genera el endpoint estatico correctamente', async () => {
    const items = [
      { entidad: 'BANCO CIUDAD', nombreComercial: 'Banco Ciudad', tnaPorcentaje: 9.3 },
    ]

    await guardarTna(items, TEST_URL, TEST_AUTH_TOKEN)

    const guardado = leerRuta('/finanzas/hipotecarios-uva')

    expect(guardado).toBeDefined()
    expect(Array.isArray(guardado)).toBe(true)
    expect(guardado.length).toBeGreaterThan(0)

    const ciudadEntry = guardado.find(r => r.entidad === 'BANCO CIUDAD')
    expect(ciudadEntry).toBeDefined()
    expect(ciudadEntry).toEqual({
      entidad: 'BANCO CIUDAD',
      nombreComercial: 'Banco Ciudad',
      tna: 9.3,
    })
  })
})

