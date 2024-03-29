import { theme, useOpenapi } from 'vitepress-theme-openapi'
import DefaultTheme from 'vitepress/theme'
import { setDefaultOptions } from 'date-fns'
import { es } from 'date-fns/locale'
import spec from '../../public/openapi.json' assert { type: 'json' }
import { useECharts } from '../plugins/echarts'
import chartComponents from './components/charts'
import { h } from 'vue'
import GitHubStars from './components/GitHubStars.vue'

import 'vitepress-theme-openapi/dist/style.css'
import './style.css'

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(GitHubStars),
    })
  },
  enhanceApp({ app }) {
    setDefaultOptions({ locale: es })

    const openapi = useOpenapi()
    openapi.setSpec(spec)
    theme.enhanceApp({ app })

    app.use(useECharts)
    for (const [name, component] of Object.entries(chartComponents))
      app.component(name, component)
  },
}
