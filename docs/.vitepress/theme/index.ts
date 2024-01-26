import { theme, useOpenapi } from 'vitepress-theme-openapi'
import DefaultTheme from 'vitepress/theme'
import spec from '../../public/openapi.json' assert { type: 'json' }

import { useECharts } from '../plugins/echarts'

import ChartFeriados from './components/ChartFeriados.vue'
import ChartDolares from './components/ChartDolares.vue'
import ChartDolaresCasa from './components/ChartDolaresCasa.vue'

import 'vitepress-theme-openapi/dist/style.css'
import './style.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    const openapi = useOpenapi()
    openapi.setSpec(spec)
    theme.enhanceApp({ app })

    app.use(useECharts)

    app.component('ChartFeriados', ChartFeriados)
    app.component('ChartDolares', ChartDolares)
    app.component('ChartDolaresCasa', ChartDolaresCasa)
  },
}
