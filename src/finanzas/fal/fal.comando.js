import { extraerAlternativasFal } from '@/finanzas/fal/extraccion/extraerAlternativasFal.js'
import { guardarAlternativasFal } from '@/finanzas/fal/guardado/guardarAlternativasFal.js'

export async function ejecutarAlternativasFal() {
  try {
    const datos = await extraerAlternativasFal()
    await guardarAlternativasFal(datos)
  } catch (error) {
    console.error('Error al extraer alternativas FAL', error)
  }
}

export default ejecutarAlternativasFal
