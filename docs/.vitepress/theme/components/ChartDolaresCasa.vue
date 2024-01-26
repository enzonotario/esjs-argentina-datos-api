<script setup lang="ts">
import { ref, watch } from 'vue'
import { collect } from 'collect.js'
import { FwbSelect } from 'flowbite-vue'
import colors from 'tailwindcss/colors'
import { useApi } from '../composables/useApi'
import { useEcharts } from '../composables/useEcharts'

const chartRef = ref()

const { setOptions } = useEcharts(chartRef)

const api = useApi()

const casa = ref('blue')

const options = [
  {
    value: 'oficial',
    name: 'Oficial',
  },
  {
    value: 'blue',
    name: 'Blue',
  },
  {
    value: 'bolsa',
    name: 'Bolsa',
  },
  {
    value: 'contadoconliqui',
    name: 'Contado con liquidación',
  },
  {
    value: 'mayorista',
    name: 'Mayorista',
  },
  {
    value: 'cripto',
    name: 'Cripto',
  },
  {
    value: 'tarjeta',
    name: 'Tarjeta',
  },

]

async function fetchDolares(casa: string) {
  try {
    const dolares = collect(await api.get(`/cotizaciones/dolares/${casa}`))
      .reverse()
      .groupBy('fecha')
      .flatten(1)
      .toArray()

    return dolares
  }
  catch (error) {
    return []
  }
}

async function setChartOptions(casa: string) {
  const dolares = await fetchDolares(casa)

  setOptions({
    legend: {
      data: [
        'Venta',
        'Compra',
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
      {
        name: 'Venta',
        data: dolares.map(item => item.venta),
        type: 'line',
        itemStyle: {
          color: colors.blue[500],
        },
      },

      {
        name: 'Compra',
        data: dolares.map(item => item.compra),
        type: 'line',
        itemStyle: {
          color: colors.teal[500],
        },
      },
    ],
  } as any)
}

watch(casa, async (value) => {
  await setChartOptions(value)
}, {
  immediate: true,
})
</script>

<template>
  <div>
    <div class="flex flex-row items-center space-x-2">
      <h3 style="margin: 0">
        Cotización de dólar por casa de cambio
      </h3>

      <FwbSelect v-model="casa" :options="options" />
    </div>

    <div ref="chartRef" class="h-[50rem]" />
  </div>
</template>
