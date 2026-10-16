import { logMensaje } from '@/log.js'
import { scrapeHtmlWithFirecrawl } from '@/shared/extraction/firecrawl/scrapeHtmlWithFirecrawl.js'
import { normalizarRemesa } from '@/finanzas/remesas/extraccion/extraerRemesas.js'

const FUENTES_GLOBAL66_REMESAS = [
  {
    nombre: 'tarjeta',
    url: 'https://www.global66.com/ar/tarjeta/',
  },
  {
    nombre: 'iban',
    url: 'https://www.global66.com/ar/iban/',
  },
  {
    nombre: 'viajeros',
    url: 'https://www.global66.com/ar/viajeros/',
  },
  {
    nombre: 'recibir',
    url: 'https://ayuda.global66.com/docs/primeros-pasos/recibe-dinero-directamente-a-tu-cuenta-en-usd-eur-y-gbp-con-global66/',
  },
  {
    nombre: 'cuenta-propia',
    url: 'https://ayuda.global66.com/docs/transferencias/puedo-usar-global66-para-enviar-dinero-a-wise-en-estados-unidos/',
  },
]

function exigir(texto, fragmento) {
  if (!texto.toLowerCase().includes(fragmento.toLowerCase())) {
    throw new Error(`Fuente oficial sin "${fragmento}"`)
  }
}

export function mapearGlobal66Remesas(texto) {
  exigir(texto, 'recargos por moneda extranjera')
  exigir(texto, 'tarjeta digital y global')
  exigir(texto, 'ACH son gratuitas')
  exigir(texto, '$10 USD')
  exigir(texto, 'al menos una compra al mes')
  exigir(texto, 'exclusivamente en formato virtual')
  exigir(texto, 'sin cargos ocultos por compras internacionales')
  exigir(texto, 'tipo Checking')
  exigir(texto, 'sin costos de mantención')
  exigir(texto, 'Recepción gratuita')
  exigir(texto, 'rendimiento de hasta 6%')
  exigir(texto, 'no permite que las transferencias lleguen a tu nombre')
  exigir(texto, 'proveedor de pagos')

  return normalizarRemesa({
    compania: 'Global66',
    cuentaPropia: false,
    moneda: 'FIAT',
    inversiones: true,
    tarjetaUsa: true,
    costoRecibirPagos: '0',
    costoMantenimientoTarjeta: '0 si hay 1 compra al mes',
    costoTarjeta: '0',
    retiroArs: null,
    detalles: {
      cuentaPropia:
        'Dan Account Number y Routing Number y la describen como una cuenta tipo Checking. El centro de ayuda dice que las transferencias no llegan a tu nombre, sino al de su proveedor de pagos en Estados Unidos.',
      costoRecibirPagos:
        'ACH gratis. Wire y SWIFT tienen un costo fijo de recepción de 10 USD.',
      costoMantenimientoTarjeta:
        'La Smart Card no tiene mantenimiento si hay al menos una compra al mes. En Argentina es solo virtual. La cuenta no tiene costo de mantención.',
      costoTarjeta:
        'Sin recargo por moneda extranjera y sin cargos ocultos en compras internacionales.',
      retiroArs:
        'No publican un costo fijo para convertir el saldo a pesos. La cuenta en USD no permite retiros en efectivo.',
      tarjetaUsa:
        'La Smart Card es una tarjeta digital y global para pagar en dólares. En Argentina es solo virtual. Una tarjeta global cuenta como tarjeta de EE.UU.',
      inversiones:
        'El centro de ayuda, que incluye a personas en Argentina, dice que la cuenta en dólares mantiene un rendimiento de hasta 6% anual.',
    },
  })
}

export async function extraerGlobal66Remesas(log) {
  const textos = await Promise.all(
    FUENTES_GLOBAL66_REMESAS.map(async (fuente) => {
      logMensaje(log, `Fuente oficial: global66 ${fuente.nombre}`, {
        url: fuente.url,
      })

      const { markdown } = await scrapeHtmlWithFirecrawl(log, fuente.url)

      if (!markdown.trim()) {
        throw new Error(`Fuente oficial vacía: ${fuente.url}`)
      }

      return markdown
    }),
  )

  return mapearGlobal66Remesas(textos.join('\n'))
}
