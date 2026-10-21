import { escribirRuta } from '@/utils/rutas.js'

export async function guardarAlternativasFal(payload) {
  return escribirRuta('/finanzas/fal', payload)
}
