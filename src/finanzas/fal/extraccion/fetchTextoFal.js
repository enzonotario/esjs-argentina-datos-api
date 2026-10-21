import axios from 'axios'
import { logMensaje } from '@/log.js'
import { scrapeHtmlWithFirecrawl } from '@/shared/extraction/firecrawl/scrapeHtmlWithFirecrawl.js'

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'es-AR,es;q=0.9',
}

/**
 * @param {string} valor
 */
export function textoPlano(valor) {
  const html = String(valor)
  const jsonLd = [
    ...html.matchAll(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ]
    .map(coincidencia => coincidencia[1])
    .join(' ')

  return `${html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#(\d+);/g, (_, codigo) => String.fromCharCode(Number(codigo)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')} ${jsonLd}`
    .replace(/\s+/g, ' ')
    .trim()
}

async function fetchAxios(url) {
  const respuesta = await axios.get(url, {
    responseType: 'text',
    timeout: 25000,
    headers: HEADERS,
    validateStatus: status => status >= 200 && status < 300,
  })

  return textoPlano(respuesta.data)
}

async function fetchNativo(url) {
  const respuesta = await fetch(url, {
    headers: HEADERS,
    signal: AbortSignal.timeout(25000),
    redirect: 'follow',
  })

  if (!respuesta.ok) {
    throw new Error(`HTTP ${respuesta.status}`)
  }

  return textoPlano(await respuesta.text())
}

/**
 * Lee el texto visible de una página. Si el sitio bloquea el fetch, usa Firecrawl.
 *
 * @param {string} url
 * @param {object} log
 */
export async function fetchTextoFal(url, log) {
  const intentos = [fetchAxios, fetchNativo]

  for (const intento of intentos) {
    try {
      const texto = await intento(url)

      if (texto.length > 400) return texto

      logMensaje(log, 'Fetch con poco texto', { url, largo: texto.length })
    } catch (error) {
      logMensaje(log, 'Fetch directo falló', {
        url,
        errorMessage: error.message,
      })

      if (/timeout/i.test(error.message)) break
    }
  }

  if (!import.meta.env.VITE_FIRECRAWL_API_KEY) {
    throw new Error(`No se pudo leer ${url}`)
  }

  const scraped = await scrapeHtmlWithFirecrawl(log, url)
  const texto = textoPlano(scraped.markdown || scraped.html || '')

  if (texto.length < 200) {
    throw new Error(`Firecrawl no devolvió texto útil para ${url}`)
  }

  return texto
}
