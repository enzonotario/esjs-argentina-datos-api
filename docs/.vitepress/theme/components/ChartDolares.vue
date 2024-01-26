<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { collect } from 'collect.js'
import { useApi } from '../composables/useApi'
import { useEcharts } from '../composables/useEcharts'

const chartRef = ref()

const { setOptions } = useEcharts(chartRef)

const api = useApi()

async function fetchDolares() {
  try {
    const dolares = collect(await api.get('/cotizaciones/dolares'))
      .reverse()
      .groupBy('fecha')
      .take(365 * 1)
      .flatten(1)
      .toArray()

    return dolares
  }
  catch (error) {
    return []
  }
}

async function setChartOptions() {
  const dolares = await fetchDolares()

  setOptions({
    legend: {
      data: [
        ...dolares
          .map(item => item.casa)
          .filter((value, index, self) => self.indexOf(value) === index),
      ],
    },
    tooltip: {
      trigger: 'axis',
    },
    dataZoom: [
      {
        startValue: 0,
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
    xAxis: {
      type: 'category',
      data: collect(dolares).pluck('fecha').unique().toArray(),
      inverse: true,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      ...dolares
        .map(item => item.casa)
        .filter((value, index, self) => self.indexOf(value) === index)
        .map(casa => ({
          name: casa,
          data: dolares
            .filter(item => item.casa === casa)
            .map(item => item.venta),
          type: 'line',
        })),
    ],
  } as any)
}

onMounted(async () => {
  await setChartOptions()
})
</script>

<template>
  <div>
    <h3>Cotización histórica del dólar</h3>

    <div ref="chartRef" class="h-[50rem]" />
  </div>
</template>
