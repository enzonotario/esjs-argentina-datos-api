import { logMensaje } from '@/log.js'
import { normalizarRemesa } from '@/finanzas/remesas/extraccion/extraerRemesas.js'

/**
 * Proveedores que siguen en Dolarito: AirTM, Global66, Lemon y Astropay.
 */
export const FUENTES_REMESAS_DIRECTAS = [
  {
    nombre: 'wallbit',
    url: 'https://www.wallbit.io/es/pricing',
    mapear: mapearWallbitRemesas,
  },
  {
    nombre: 'takenos',
    url: 'https://takenos.com/blog/takenos-y-sus-comisiones-cu%C3%A1les-son-los-costos-y-comisiones-de-takenos',
    mapear: mapearTakenosRemesas,
  },
  {
    nombre: 'grabrfi',
    url: 'https://help.grabrfi.com/en/content/full-schedule-of-fees',
    mapear: mapearGrabrfiRemesas,
  },
  {
    nombre: 'wise',
    url: 'https://wise.com/us/pricing/receive',
    mapear: mapearWiseRemesas,
  },
  {
    nombre: 'payoneer',
    url: 'https://www.payoneer.com/about/pricing/',
    mapear: mapearPayoneerRemesas,
  },
  {
    nombre: 'arq',
    url: 'https://www.arqfinance.com/en-AR/help/articles/arq-costs-and-fees-mexico',
    mapear: mapearArqRemesas,
  },
]

export function htmlATexto(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\u0441/g, 'c')
    .replace(/\s+/g, ' ')
    .trim()
}

function exigir(texto, fragmento) {
  if (!texto.toLowerCase().includes(fragmento.toLowerCase())) {
    throw new Error(`Fuente oficial sin "${fragmento}"`)
  }
}

export function mapearWallbitRemesas(texto) {
  exigir(texto, 'Depósitos (ACH, Wire, Moneda local, Cripto) Gratis')
  exigir(texto, 'Cuenta a tu nombre en Estados Unidos')
  exigir(texto, 'Tarjeta Visa')
  exigir(texto, '12.000 activos')
  exigir(texto, 'FX estándar')

  return normalizarRemesa({
    compania: 'wallbit',
    cuentaPropia: true,
    moneda: 'FIAT',
    inversiones: /12\.000 activos|cuenta remunerada/i.test(texto),
    tarjetaUsa: true,
    costoRecibirPagos: '0',
    costoMantenimientoTarjeta: '0 USD',
    costoTarjeta: '0%',
    retiroArs: 'FX',
    detalles: {
      costoRecibirPagos:
        'Depósitos ACH, Wire, moneda local y cripto gratis en el plan Classic.',
      costoMantenimientoTarjeta:
        'Plan Classic: 0 USD/mes. Emisión de tarjeta virtual: 5 USD, pago único.',
      costoTarjeta:
        'Uso en USD gratis. En otra moneda, sin comisión en USD o 2% FX.',
      retiroArs:
        'Retiro a moneda local con FX estándar. En algunos países hay 0,35 USD fijos por transacción.',
      tarjetaUsa: 'Tarjeta Visa Platinum de la cuenta en Estados Unidos.',
      inversiones: /2\.75%/i.test(texto)
        ? 'Cuenta remunerada desde 2,75% APR e inversiones en EE.UU.'
        : null,
    },
  })
}

export function mapearTakenosRemesas(texto) {
  exigir(texto, 'transferencias ACH')
  exigir(texto, 'totalmente gratis')
  exigir(texto, '25 USD')
  exigir(texto, 'comisión del 1%')
  exigir(texto, 'totalmente gratuitos')

  return normalizarRemesa({
    compania: 'takenos',
    cuentaPropia: true,
    moneda: 'CRIPTO',
    inversiones: /inversiones/i.test(texto),
    tarjetaUsa: /takecard/i.test(texto),
    costoRecibirPagos: '0',
    costoMantenimientoTarjeta: '0 USD',
    costoTarjeta: '1%',
    retiroArs: '0',
    detalles: {
      moneda: 'Los pagos se acreditan como USD digital.',
      costoRecibirPagos: 'ACH en USD gratis. Wire en USD: 25 USD.',
      costoTarjeta:
        'TakeCard: 1% por compra. Spicy Card: sin comisión de gasto.',
      retiroArs: 'Retiros en ARS a cuenta bancaria argentina gratis.',
      tarjetaUsa: 'TakeCard para compras internacionales con USD digital.',
    },
  })
}

export function mapearGrabrfiRemesas(texto) {
  exigir(texto, 'Same-day incoming ACH $0')
  exigir(texto, 'Standard incoming ACH $0')
  exigir(texto, 'Monthly maintenance $0')
  exigir(texto, 'Argentina $5')
  exigir(texto, 'issued by Lead Bank')

  return normalizarRemesa({
    compania: 'grabrfi',
    cuentaPropia: true,
    moneda: /USDC/i.test(texto) ? 'CRIPTO' : 'FIAT',
    inversiones: false,
    tarjetaUsa: true,
    costoRecibirPagos: '0',
    costoMantenimientoTarjeta: '0 USD',
    costoTarjeta: '0%',
    retiroArs: '5 USD',
    detalles: {
      moneda:
        'El saldo de la cuenta global está en dólares digitales (USDB o USDC).',
      costoRecibirPagos:
        'ACH entrante: 0 USD. Wire doméstico entrante en EE.UU.: 15 USD.',
      costoTarjeta: 'Compras en EE.UU. gratis. Compras fuera de EE.UU.: 1,5%.',
      retiroArs: 'Retiro a moneda local en Argentina: 5 USD.',
      tarjetaUsa: 'Visa prepaga emitida por Lead Bank (EE.UU.).',
      inversiones:
        'Boost es un incentivo promocional, no un producto de inversión.',
    },
  })
}

export function mapearWiseRemesas(texto) {
  exigir(texto, 'Receiving domestic payments')
  exigir(texto, 'USD Free')
  exigir(texto, '6.11 USD')

  return normalizarRemesa({
    compania: 'wise',
    cuentaPropia: false,
    moneda: 'FIAT',
    inversiones: false,
    tarjetaUsa: false,
    costoRecibirPagos: '0',
    costoMantenimientoTarjeta: null,
    costoTarjeta: null,
    retiroArs: null,
    detalles: {
      cuentaPropia:
        'Wise da datos de cuenta para cobrar. No es una cuenta bancaria propia en EE.UU.',
      costoRecibirPagos:
        'Pagos domésticos (ACH, no wire) gratis. Wire o SWIFT en USD: 6,11 USD.',
      tarjetaUsa:
        'La página de cobros no publica una tarjeta emitida en EE.UU.',
    },
  })
}

export function mapearPayoneerRemesas(texto) {
  exigir(texto, 'not your local currency')
  exigir(texto, '1% (minimum fee of 1.00 USD')
  exigir(texto, 'Annual card fee')
  exigir(texto, '29.95 USD')
  exigir(texto, 'Up to 1.8%')
  exigir(texto, 'Up to 3.5%')
  exigir(texto, '1.2%')

  return normalizarRemesa({
    compania: 'payoneer',
    cuentaPropia: true,
    moneda: 'FIAT',
    inversiones: false,
    tarjetaUsa: false,
    costoRecibirPagos: '1%',
    costoMantenimientoTarjeta: '29.95 USD',
    costoTarjeta: '1.8% a 3.5%',
    retiroArs: '1.2% a 4%',
    detalles: {
      costoRecibirPagos:
        '1% (mín. 1 USD) si la receiving account no está en tu moneda local. ACH bank debit en EE.UU.: 1%. En moneda local: gratis.',
      costoMantenimientoTarjeta:
        'Fee anual de la tarjeta: 29,95 USD. Fee anual de cuenta si recibís menos de 6.000 USD en 12 meses.',
      costoTarjeta:
        'Compras sin conversión: hasta 1,8%. Con conversión: hasta 3,5%.',
      retiroArs: 'Retiro a banco en moneda local del destinatario: 1,2% a 4%.',
      tarjetaUsa:
        'Payoneer publica tarjeta y fees en USD. La página de precios no dice que esté emitida en EE.UU.',
    },
  })
}

export function mapearArqRemesas(texto) {
  exigir(texto, '3 USDc fee when depositing funds from US dollar accounts')
  exigir(texto, 'Virtual ARQ')
  exigir(texto, 'without any charge')
  exigir(texto, 'without fees')
  exigir(texto, '5% commission')
  exigir(texto, 'ATM withdrawals')

  return normalizarRemesa({
    compania: 'arq',
    cuentaPropia: /U\.S\. account details/i.test(texto),
    moneda: /digital dollars/i.test(texto) ? 'CRIPTO' : null,
    inversiones: /earn rewards/i.test(texto),
    tarjetaUsa: false,
    costoRecibirPagos: '3 USD',
    costoMantenimientoTarjeta: '0 USD',
    costoTarjeta: '0%',
    retiroArs: '0',
    detalles: {
      cuentaPropia:
        'Datos de cuenta en EE.UU. en ARQ. Depósito desde cuentas USD: 3 USDc.',
      costoRecibirPagos:
        '3 USDc al depositar desde cuentas en dólares, euros o cripto, y al usar los datos de cuenta de EE.UU.',
      costoMantenimientoTarjeta:
        'Tarjeta virtual sin cargo. Envío de tarjeta física: 4,99 USD.',
      costoTarjeta:
        'Pagos con ARQCard sin cargo. Si el comercio cobra en pesos argentinos: 5%.',
      retiroArs:
        'Transferencias en moneda local sin cargo. Extracción en ATM: 1% (no es el retiro a banco).',
      tarjetaUsa:
        'La página de costos no dice que la ARQCard esté emitida en EE.UU.',
      inversiones:
        'Guardar dólares digitales y sumar rewards no tiene costo extra.',
    },
  })
}

async function obtenerTexto(url) {
  const respuesta = await fetch(url, {
    redirect: 'follow',
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; ArgentinaDatos/1.0)',
      accept: 'text/html',
    },
  })

  if (!respuesta.ok) {
    throw new Error(
      `Error al obtener ${url}: ${respuesta.status} ${respuesta.statusText}`,
    )
  }

  return htmlATexto(await respuesta.text())
}

async function extraerFuente(log, fuente) {
  logMensaje(log, `Fuente oficial: ${fuente.nombre}`, { url: fuente.url })

  const texto = await obtenerTexto(fuente.url)
  const remesa = fuente.mapear(texto)

  if (remesa.compania?.toLowerCase() !== fuente.nombre) {
    throw new Error(`Parser de ${fuente.nombre} devolvió ${remesa.compania}`)
  }

  return remesa
}

export async function extraerFuentesDirectasRemesas(log) {
  return Promise.all(
    FUENTES_REMESAS_DIRECTAS.map(async fuente => {
      try {
        return { ok: true, remesa: await extraerFuente(log, fuente) }
      } catch (error) {
        logMensaje(
          log,
          `extraerRemesas: falló fuente oficial ${fuente.nombre}`,
          {
            url: fuente.url,
            errorMessage: error?.message,
          },
        )

        return { ok: false, nombre: fuente.nombre, error }
      }
    }),
  )
}
