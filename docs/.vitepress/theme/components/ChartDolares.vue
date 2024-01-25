<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import 'echarts'
import VChart, { THEME_KEY } from 'vue-echarts'
import { collect } from 'collect.js'
import { useApi } from '../composables/useApi'

provide(THEME_KEY, 'light')

const option = ref({})

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

async function setOption() {
  const dolares = await fetchDolares()

  option.value = {
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
  }
}

onMounted(async () => {
  await setOption()
})
</script>

<template>
  <div>
    <h3>Cotización histórica del dólar</h3>

    <VChart class="h-[50rem]" :option="option" autoresize />
  </div>
</template>
