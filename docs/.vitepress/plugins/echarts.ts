import { type App } from 'vue'
import * as echarts from 'echarts'

export function useECharts(app: App) {
  app.config.globalProperties.$echarts = echarts
}

export default echarts
