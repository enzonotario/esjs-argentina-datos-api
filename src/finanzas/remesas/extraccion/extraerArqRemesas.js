import { normalizarRemesa } from '@/finanzas/remesas/extraccion/extraerRemesas.js'

function exigir(texto, fragmento) {
  if (!texto.toLowerCase().includes(fragmento.toLowerCase())) {
    throw new Error(`Fuente oficial sin "${fragmento}"`)
  }
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

export const fuenteArqRemesas = {
  nombre: 'arq',
  url: 'https://www.arqfinance.com/en-AR/help/articles/arq-costs-and-fees-mexico',
  mapear: mapearArqRemesas,
}
