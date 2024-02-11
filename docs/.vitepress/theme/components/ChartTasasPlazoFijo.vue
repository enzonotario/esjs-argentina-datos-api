<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import colors from 'tailwindcss/colors'
import { useApi } from '../composables/useApi'
import { useEcharts } from '../composables/useEcharts'

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
    const data = await api.get('/finanzas/tasas/plazoFijo')

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
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}%',
    },
    legend: {
      left: 'left',
      data: ['Clientes', 'No Clientes'],
      textStyle: {
        color: theme.value === 'dark' ? colors.gray[100] : colors.gray[800],
      },
    },
    series: [
      {
        name: 'Clientes',
        type: 'bar',
        data: seriesData.map(item => (item.tnaClientes * 100).toFixed(2)),
        itemStyle: {
          color: colors.indigo[500],
        },
      },
      {
        name: 'No Clientes',
        type: 'bar',
        data: seriesData.map(item => (item.tnaNoClientes * 100).toFixed(2)),
        itemStyle: {
          color: colors.indigo[200],
        },
      },
    ],
    xAxis: {
      type: 'value',
      axisLabel: {
        color: theme.value === 'dark' ? colors.gray[100] : colors.gray[800],
      },
    },
    yAxis: {
      type: 'category',
      data: seriesData.map(item => item.entidad),
      axisLabel: {
        color: theme.value === 'dark' ? colors.gray[100] : colors.gray[800],
        textStyle: {
          fontSize: autoFontSize.value,
        },
      },
      inverse: true,
    },
    grid: {
      containLabel: true,
    },
  } as any)
}

onMounted(async () => {
  await setChartOptions()
})
</script>

<template>
  <div>
    <h3>TNA Plazo Fijo</h3>

    <div ref="chartRef" class="h-[50rem]" />
  </div>
</template>
