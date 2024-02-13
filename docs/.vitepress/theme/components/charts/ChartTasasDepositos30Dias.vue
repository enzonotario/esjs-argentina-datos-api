<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import colors from 'tailwindcss/colors'
import { useApi } from '../../composables/useApi'
import { useEcharts } from '../../composables/useEcharts'

const chartRef = ref()

const { setOptions, theme } = useEcharts(chartRef)

const api = useApi()

const autoFontSize = computed(() => {
  const chartWidth = chartRef.value?.clientWidth

  const max = 14

  const min = 8

  return Math.max(Math.min(chartWidth / 50, max), min)
})

async function fetchData() {
  try {
    const data = await api.get('/finanzas/tasas/depositos30Dias')

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
      formatter: '{a} <br/>{b} : {c}%',
    },
    legend: {
      left: 'left',
      data: ['Tasa de interés'],
      textStyle: {
        color: theme.value === 'dark' ? colors.gray[100] : colors.gray[800],
      },
    },
    series: [
      {
        name: 'Tasa de interés',
        type: 'line',
        data: seriesData.map(item => (item.valor * 100).toFixed(2)),
        itemStyle: {
          color: colors.indigo[500],
        },
      },
    ],
    xAxis: {
      type: 'category',
      data: seriesData.map(item => item.fecha),
      axisLabel: {
        color: theme.value === 'dark' ? colors.gray[100] : colors.gray[800],
        fontSize: autoFontSize.value,
      },
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
        start: 0,
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
    <h3>Tasas de interés de depósitos a 30 días</h3>

    <div ref="chartRef" class="h-[50rem]" />
  </div>
</template>
