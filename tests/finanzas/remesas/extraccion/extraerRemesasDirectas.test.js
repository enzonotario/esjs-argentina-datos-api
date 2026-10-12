import { describe, expect, it } from 'vitest'
import { logGrupo } from '@/log.js'
import {
  extraerFuentesDirectasRemesas,
  htmlATexto,
  mapearArqRemesas,
  mapearGrabrfiRemesas,
  mapearPayoneerRemesas,
  mapearTakenosRemesas,
  mapearWallbitRemesas,
  mapearWiseRemesas,
} from '@/finanzas/remesas/extraccion/extraerRemesasDirectas.js'
import { reemplazarRemesa } from '@/finanzas/remesas/extraccion/extraerRemesas.js'

const WALLBIT = `
Wallbit no cobra comisiones por depósitos en USD, EUR, USDC, USDT ni moneda local.
Cuenta a tu nombre en Estados Unidos.
Depósitos 100% gratuitos. Acceso a más de 12.000 activos de inversión.
Tarjeta Visa Platinum. Cuenta remunerada con 2.75% APR.
Depósitos (ACH, Wire, Moneda local, Cripto) Gratis Gratis Gratis
Uso de tarjeta en USD Gratis. Uso de tarjeta en otra moneda Sin comisión (USD) o 2% FX
Todos los países FX estándar. fee fijo adicional de 0.35 USD
`

const TAKENOS = `
Recibir transferencias ACH en USD son totalmente gratis.
Wire Transfer en USD tiene un costo de 25 USD.
Gastos con la TakeCard: se aplica una comisión del 1% por cada transacción.
Saldo en USD Digital. Retiros en pesos argentinos (ARS) son totalmente gratuitos.
Inversiones
`

const GRABRFI = `
Same-day incoming ACH $0. Standard incoming ACH $0.
Monthly maintenance $0.
US domestic incoming wire $15.
Foreign transaction fee (purchases in the United States) Free.
Foreign transaction fee (purchases outside the United States) 1.5%.
Withdrawals to local currency. Argentina $5.
held as digital dollars (USDB or USDC).
Prepaid Debit Visa Card is issued by Lead Bank.
Boost earnings are not interest, yield or investment returns.
`

const WISE = `
Receiving domestic payments (non-Swift / non-wire) Receive AUD, CAD, EUR, GBP, USD Free.
Receiving USD wire and Swift payments Fixed fee per payment 6.11 USD.
`

const PAYONEER = `
Via a receiving account in a currency that is not your local currency 1% (minimum fee of 1.00 USD or equivalent).
From a payer using ACH bank debit (US only) 1%.
Annual card fee 29.95 USD.
Card purchases without currency conversion Up to 1.8%.
Card transactions with currency conversion Up to 3.5%.
To a bank account in the recipient's local currency 1.2% – 4%.
`

const ARQ = `
U.S. account details on ARQ.
Maintain your digital dollars or euros. earn rewards at no additional cost.
Virtual ARQ: Get your virtual card without any charge.
Deposits and transfers in local currencies without fees.
3 USDc fee when depositing funds from US dollar accounts.
International purchases in Argentine pesos: 5% commission.
ATM withdrawals: 1% commission.
`

describe('mapear remesas desde fuente oficial', () => {
  it('lee Wallbit desde la página de precios', () => {
    expect(mapearWallbitRemesas(WALLBIT)).toMatchObject({
      compania: 'wallbit',
      cuentaPropia: true,
      moneda: 'FIAT',
      inversiones: true,
      tarjetaUsa: true,
      costoRecibirPagos: '0',
      costoTarjeta: '0%',
      retiroArs: 'FX',
    })
  })

  it('lee Takenos desde el blog de comisiones', () => {
    const remesa = mapearTakenosRemesas(TAKENOS)

    expect(remesa).toMatchObject({
      compania: 'takenos',
      moneda: 'CRIPTO',
      costoRecibirPagos: '0',
      costoTarjeta: '1%',
      retiroArs: '0',
    })
    expect(remesa.detalles.costoRecibirPagos).toContain('25 USD')
  })

  it('lee GrabrFi desde el schedule de fees', () => {
    expect(mapearGrabrfiRemesas(GRABRFI)).toMatchObject({
      compania: 'grabrfi',
      moneda: 'CRIPTO',
      tarjetaUsa: true,
      costoRecibirPagos: '0',
      costoTarjeta: '0%',
      retiroArs: '5 USD',
      inversiones: false,
    })
  })

  it('lee Wise: ACH gratis y wire 6,11 USD', () => {
    const remesa = mapearWiseRemesas(WISE)

    expect(remesa).toMatchObject({
      compania: 'wise',
      cuentaPropia: false,
      tarjetaUsa: false,
      costoRecibirPagos: '0',
      retiroArs: null,
    })
    expect(remesa.detalles.costoRecibirPagos).toContain('6,11 USD')
  })

  it('lee Payoneer desde la página de pricing', () => {
    expect(mapearPayoneerRemesas(PAYONEER)).toMatchObject({
      compania: 'payoneer',
      costoRecibirPagos: '1%',
      costoMantenimientoTarjeta: '29.95 USD',
      costoTarjeta: '1.8% a 3.5%',
      retiroArs: '1.2% a 4%',
      tarjetaUsa: false,
    })
  })

  it('lee ARQ desde el help center', () => {
    expect(mapearArqRemesas(ARQ)).toMatchObject({
      compania: 'arq',
      cuentaPropia: true,
      moneda: 'CRIPTO',
      costoRecibirPagos: '3 USD',
      costoMantenimientoTarjeta: '0 USD',
      retiroArs: '0',
    })
  })

  it('limpia HTML antes de buscar frases', () => {
    const texto = htmlATexto(
      '<script>ignore 6.11 USD</script><p>Receiving domestic payments USD Free</p>',
    )

    expect(texto).not.toContain('ignore')
    expect(texto).toContain('Receiving domestic payments')
  })

  it('reemplaza la fila de Dolarito si la fuente oficial responde', () => {
    const remesas = [
      { compania: 'wise', costoRecibirPagos: '6,11 USD' },
      { compania: 'airtm', costoRecibirPagos: '0' },
    ]

    reemplazarRemesa(remesas, mapearWiseRemesas(WISE))

    expect(remesas).toHaveLength(2)
    expect(remesas[0].costoRecibirPagos).toBe('0')
    expect(remesas[1].compania).toBe('airtm')
  })
})

describe('fuentes oficiales vivas', () => {
  it('parsea las seis páginas oficiales', async () => {
    const log = logGrupo({ fuente: 'test', tipo: 'extraccion' })
    const resultados = await extraerFuentesDirectasRemesas(log)
    const fallos = resultados.filter(resultado => !resultado.ok)

    expect(fallos.map(fallo => fallo.error?.message)).toEqual([])

    const porNombre = Object.fromEntries(
      resultados.map(resultado => [
        resultado.remesa.compania,
        resultado.remesa,
      ]),
    )

    expect(porNombre.wallbit.costoRecibirPagos).toBe('0')
    expect(porNombre.takenos.costoTarjeta).toBe('1%')
    expect(porNombre.takenos.detalles.costoRecibirPagos).toContain('25 USD')
    expect(porNombre.grabrfi.retiroArs).toBe('5 USD')
    expect(porNombre.wise.costoRecibirPagos).toBe('0')
    expect(porNombre.wise.detalles.costoRecibirPagos).toContain('6,11 USD')
    expect(porNombre.payoneer.costoRecibirPagos).toBe('1%')
    expect(porNombre.arq.costoRecibirPagos).toBe('3 USD')
  }, 60000)
})
