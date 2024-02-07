<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { collect } from 'collect.js'
import colors from 'tailwindcss/colors'
import { format, parseISO } from 'date-fns'
import { useApi } from '../composables/useApi'
import { useEcharts } from '../composables/useEcharts'

const chartRef = ref()

const { setOptions, theme } = useEcharts(chartRef)

const api = useApi()

async function fetchData() {
  try {
    const data = await api.get('/finanzas/indices/inflacion')

    return data
  }
  catch (error) {
    return []
  }
}

async function setChartOptions() {
  const seriesData = await fetchData()
  const seriesDataCollection = collect(seriesData).sortBy('fecha')

  setOptions({
    dataZoom: [
      {
        type: 'slider',
        start: 95,
        end: 100,
      },
      {
        type: 'inside',
      },
    ],
    toolbox: {
      top: 20,
      right: 10,
      feature: {
        dataZoom: {
          yAxisIndex: 'none',
        },
        restore: {},
        saveAsImage: {},
      },
    },
    tooltip: {
      trigger: 'axis',
    },

    xAxis: {
      type: 'time',
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Inflación',
        type: 'bar',
        data: seriesDataCollection
          .map((item) => {
            return {
              name: format(parseISO(item.fecha), 'yyyy-MM-dd'),
              value: [format(parseISO(item.fecha), 'yyyy-MM-dd'), item.valor],
            }
          })
          .toArray(),
      },
    ],
    visualMap: {
      top: 10,
      right: 10,
      pieces: [
        {
          gt: 0,
          lte: 1,
          color: colors.blue[500],
        },
        {
          gt: 1,
          lte: 3,
          color: colors.yellow[400],
        },
        {
          gt: 3,
          lte: 5,
          color: colors.orange[300],
        },
        {
          gt: 5,
          lte: 7,
          color: colors.orange[500],
        },
        {
          gt: 7,
          lte: 11,
          color: colors.red[300],
        },
        {
          gt: 11,
          lte: 13,
          color: colors.red[500],
        },
        {
          gt: 13,
          color: colors.red[800],
        },
      ],
      outOfRange: {
        color: colors.gray[theme.value === 'dark' ? 300 : 500],
      },
    },
  } as any)
}

onMounted(async () => {
  await setChartOptions()
})
</script>

<template>
  <div>
    <h3>Inflación</h3>

    <div ref="chartRef" class="h-[50rem]" />
  </div>
</template>
