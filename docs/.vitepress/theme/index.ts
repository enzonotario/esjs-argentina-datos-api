import { generateCodeSample, theme, useOpenapi } from 'vitepress-openapi/client'
import DefaultTheme from 'vitepress/theme'
import { setDefaultOptions } from 'date-fns'
import { es } from 'date-fns/locale'
import { h } from 'vue'
import Layout from 'genji-theme-vitepress'
import * as ObservablePlot from '@observablehq/plot'
import spec from '../../public/openapi.json' with { type: 'json' }
import { useECharts } from '../plugins/echarts'
import chartComponents from './components/charts'
import CustomLayout from './CustomLayout.vue'

import 'vitepress-openapi/dist/style.css'
import './style.css'

const props = {
  Theme: {
    Layout: CustomLayout,
  },
  library: {
    Plot: ObservablePlot,
  },
}

export default {
  extends: DefaultTheme,
  Layout() {
    return h(Layout, props)
  },
  enhanceApp({ app }) {
    setDefaultOptions({ locale: es })

    const openapi = useOpenapi({
      spec,
      config: {
        i18n: {
          locale: 'es',
        },
        codeSamples: {
          generator: async (lang, request) => {
            if (lang === 'curl') {
              return `curl -L '${request.url}'`
            }

            return generateCodeSample(lang, request)
          },
        },
      },
    })

    theme.enhanceApp({ app, openapi })

    app.use(useECharts)
    for (const [name, component] of Object.entries(chartComponents))
      app.component(name, component)
  },
}
