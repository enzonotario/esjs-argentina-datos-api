<script setup lang="ts">
import { onMounted, ref } from 'vue'
import colors from 'tailwindcss/colors'
import { format } from 'date-fns'
import { useApi } from '../composables/useApi'
import { useEcharts } from '../composables/useEcharts'

const chartRef = ref()

const { setOptions, theme } = useEcharts(chartRef)

const api = useApi()

async function fetchData() {
  try {
    const data = await api.get('/finanzas/indices/uva')

    return data
  }
  catch (error) {
    return []
  }
}

async function setChartOptions() {
  const seriesData = await fetchData()

  setOptions({
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const date = new Date(params[0].name)

        const formattedDate = format(date, 'dd/MM/yyyy')

        return `${formattedDate}: ${params[0].value}`
      },
    },
    legend: {
      left: 'left',
      data: ['Valor'],
      textStyle: {
        color: theme.value === 'dark' ? colors.gray[100] : colors.gray[800],
      },
    },
    series: [
      {
        name: 'Valor',
        type: 'line',
        data: seriesData.map(item => item.valor),
        itemStyle: {
          color: colors.indigo[500],
        },
      },
    ],
    xAxis: {
      type: 'category',
      data: seriesData.map(item => item.fecha),
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: theme.value === 'dark' ? colors.gray[100] : colors.gray[800],
      },
    },
    dataZoom: [
      {
        type: 'inside',
        start: 95,
        end: 100,
      },
      {
        start: 0,
        end: 10,
        handleSize: '80%',
        handleStyle: {
          color: colors.indigo[500],
        },
      },
    ],
  } as any)
}

onMounted(async () => {
  await setChartOptions()
})
</script>

<template>
  <div>
    <h3>Índices UVA</h3>

    <div ref="chartRef" class="h-[50rem]" />
  </div>
</template>
