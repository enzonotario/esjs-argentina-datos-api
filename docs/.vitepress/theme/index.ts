import { theme, useOpenapi } from 'vitepress-theme-openapi'
import DefaultTheme from 'vitepress/theme'
import { setDefaultOptions } from 'date-fns'
import { es } from 'date-fns/locale'
import spec from '../../public/openapi.json' assert { type: 'json' }

import { useECharts } from '../plugins/echarts'

import ChartFeriados from './components/ChartFeriados.vue'
import ChartProximoFeriado from './components/ChartProximoFeriado.vue'
import ChartDolares from './components/ChartDolares.vue'
import ChartDolaresCasa from './components/ChartDolaresCasa.vue'
import ChartDolaresCasaFecha from './components/ChartDolaresCasaFecha.vue'
import ChartEventosPresidenciales from './components/ChartEventosPresidenciales.vue'
import ChartIndicesInflacion from './components/ChartIndicesInflacion.vue'
import ChartIndicesInflacionInteranual from './components/ChartIndicesInflacionInteranual.vue'
import ChartTasasPlazoFijo from './components/ChartTasasPlazoFijo.vue'
import ChartTasasDepositos30Dias from './components/ChartTasasDepositos30Dias.vue'

import 'vitepress-theme-openapi/dist/style.css'
import './style.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    setDefaultOptions({ locale: es })

    const openapi = useOpenapi()
    openapi.setSpec(spec)
    theme.enhanceApp({ app })

    app.use(useECharts)

    app.component('ChartFeriados', ChartFeriados)
    app.component('ChartProximoFeriado', ChartProximoFeriado)
    app.component('ChartDolares', ChartDolares)
    app.component('ChartDolaresCasa', ChartDolaresCasa)
    app.component('ChartDolaresCasaFecha', ChartDolaresCasaFecha)
    app.component('ChartEventosPresidenciales', ChartEventosPresidenciales)
    app.component('ChartIndicesInflacion', ChartIndicesInflacion)
    app.component('ChartIndicesInflacionInteranual', ChartIndicesInflacionInteranual)
    app.component('ChartTasasPlazoFijo', ChartTasasPlazoFijo)
    app.component('ChartTasasDepositos30Dias', ChartTasasDepositos30Dias)
  },
}
