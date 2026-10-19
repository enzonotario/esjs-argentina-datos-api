import { interpretarDecimalConComa } from '@/utils/numeros.js'
import { logGrupo, logError, logMensaje } from '@/log.js'

export const URL_UALA_PLAZO_FIJO =
  'https://www.uala.com.ar/inversiones/plazo-fijo'

const REGEX_SECCION_TASAS =
  /aria-label="Tasas y porcentajes"[\s\S]*?<\/ul>/i
const REGEX_TRAMO_TNA =
  /<li[^>]*>[\s\S]*?>(\d+[.,]\d+)%<\/span>[\s\S]*?>TNA\s+(\d+)\s+d[ií]as<\/span>/gi
const REGEX_FILA_TABLA =
  /"internalName":"AR_Fila_plazo-fijo_[^"]+","label":"(\d+)\s+d[ií]as","values":\[([^\]]*)\]/gi
const REGEX_TEXTO_TNA =
  /Plazo Fijo a (\d+)\s+d[ií]as:[\s\S]{0,180}?TNA\)?\s+de\s+(\d+(?:[.,]\d+)?)\s*%/gi

function tnaDesdePorcentaje(texto) {
  const valor = interpretarDecimalConComa(String(texto).replace('%', '').trim())

  if (!Number.isFinite(valor) || valor <= 0) return null

  return valor > 1 ? valor / 100 : valor
}

function tramoPlazoFijo(plazoDias, tna) {
  return {
    montoMinimo: null,
    montoMaximo: null,
    plazoMinDias: plazoDias,
    plazoMaxDias: plazoDias,
    tna,
  }
}

function ordenarTasas(tasas) {
  const porPlazo = new Map()

  for (const tasa of tasas) {
    if (!porPlazo.has(tasa.plazoMinDias)) porPlazo.set(tasa.plazoMinDias, tasa)
  }

  return [...porPlazo.values()].sort((a, b) => a.plazoMinDias - b.plazoMinDias)
}

function indiceColumnaTna(html) {
  const encabezado = html.match(
    /"columnHeaders":\s*\[([^\]]*)\]\s*,\s*"rows":\s*\[[\s\S]*?"internalName":"AR_Fila_plazo-fijo_/,
  )

  if (!encabezado) return 0

  const headers = [...encabezado[1].matchAll(/"([^"]*)"/g)].map(match => match[1])
  const indice = headers.findIndex(header => header.toUpperCase().startsWith('TNA'))

  return indice >= 0 ? indice : 0
}

function parsearFilasTabla(html) {
  const indiceTna = indiceColumnaTna(html)
  const regex = new RegExp(REGEX_FILA_TABLA.source, 'gi')
  const tasas = []
  let coincidencia = regex.exec(html)

  while (coincidencia) {
    const plazoDias = Number(coincidencia[1])
    const valores = [...coincidencia[2].matchAll(/"([^"]*)"/g)].map(match => match[1])
    const tna = tnaDesdePorcentaje(valores[indiceTna] ?? '')

    if (!Number.isNaN(plazoDias) && tna != null) {
      tasas.push(tramoPlazoFijo(plazoDias, tna))
    }

    coincidencia = regex.exec(html)
  }

  return tasas
}

function parsearListaHtml(html) {
  const seccion = html.match(REGEX_SECCION_TASAS)?.[0] ?? html
  const regexTramo = new RegExp(REGEX_TRAMO_TNA.source, 'gi')
  const tasas = []
  let coincidencia = regexTramo.exec(seccion)

  while (coincidencia) {
    const plazoDias = Number(coincidencia[2])
    const tna = tnaDesdePorcentaje(coincidencia[1])

    if (!Number.isNaN(plazoDias) && tna != null) {
      tasas.push(tramoPlazoFijo(plazoDias, tna))
    }

    coincidencia = regexTramo.exec(seccion)
  }

  return tasas
}

function parsearTextoLegal(html) {
  const regex = new RegExp(REGEX_TEXTO_TNA.source, 'gi')
  const tasas = []
  let coincidencia = regex.exec(html)

  while (coincidencia) {
    const plazoDias = Number(coincidencia[1])
    const tna = tnaDesdePorcentaje(coincidencia[2])

    if (!Number.isNaN(plazoDias) && tna != null) {
      tasas.push(tramoPlazoFijo(plazoDias, tna))
    }

    coincidencia = regex.exec(html)
  }

  return tasas
}

export function parsearTasasPlazoFijoUala(html) {
  if (!html || typeof html !== 'string') {
    return []
  }

  const desdeTabla = parsearFilasTabla(html)

  if (desdeTabla.length > 0) return ordenarTasas(desdeTabla)

  const desdeLista = parsearListaHtml(html)

  if (desdeLista.length > 0) return ordenarTasas(desdeLista)

  return ordenarTasas(parsearTextoLegal(html))
}

export async function extraerUalaPlazoFijo() {
  const log = logGrupo({
    fuente: 'extraerUala',
    tipo: 'plazoFijo',
  })

  try {
    const respuesta = await fetch(URL_UALA_PLAZO_FIJO)

    if (!respuesta.ok) {
      throw new Error(
        `Error al obtener la página de Ualá: ${respuesta.statusText}`,
      )
    }

    const htmlText = await respuesta.text()
    const tasas = parsearTasasPlazoFijoUala(htmlText)

    if (tasas.length === 0) {
      logMensaje(log, 'No se encontraron tasas TNA en la página de Ualá')
      throw new Error('No se pudo encontrar la tasa TNA en la página de Ualá')
    }

    const tna30Dias = tasas.find(tramo => tramo.plazoMinDias === 30)?.tna

    if (tna30Dias === undefined) {
      throw new Error('No se pudo encontrar la tasa TNA a 30 días en Ualá')
    }

    return {
      entidad: 'UALA',
      logo: 'https://icons.com.ar/icons/bancos-apps/uala.svg',
      tnaClientes: tna30Dias,
      tnaNoClientes: tna30Dias,
      enlace: URL_UALA_PLAZO_FIJO,
      tasas,
    }
  } catch (error) {
    logError(log, error)
    return null
  }
}
