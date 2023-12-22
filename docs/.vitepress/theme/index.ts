import { theme, useOpenapi } from 'vitepress-theme-openapi'
import DefaultTheme from 'vitepress/theme'
import { ApiClient } from '@scalar/api-client'

import spec from '../../public/openapi.json' assert {type: 'json'}
import 'vitepress-theme-openapi/dist/style.css'
import './style.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    const openapi = useOpenapi()
    openapi.setSpec(spec)
    theme.enhanceApp({ app })

    app.component('ApiClient', ApiClient)
  },
}
