<script setup lang="ts">
import { ref, watch } from 'vue'
import { collect } from 'collect.js'
import { FwbSelect } from 'flowbite-vue'
import colors from 'tailwindcss/colors'
import * as echarts from 'echarts'
import { format, parseISO } from 'date-fns'
import { useApi } from '../../composables/useApi'
import { useEcharts } from '../../composables/useEcharts'

const chartRef = ref()

const { setOptions, theme } = useEcharts(chartRef)

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
  {
    value: 'solidario',
    name: 'Solidario',
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
      data: ['Venta', 'Compra'],
      selected: {
        Venta: true,
        Compra: false,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
      formatter: (params: any) => {
        const date = params[0].axisValue

        const items = params
          .map((item: any) => {
            return `
              <div>
                <span>${item.seriesName}:</span>
                <span class="font-bold">$${item.value}</span>
              </div>
            `
          })
          .join('')

        return `
          <div class="flex flex-col gap-1">
            <div>${format(parseISO(date), 'dd/MM/yyyy')}</div>
            ${items}
          </div>
        `
      },
    },
    dataZoom: [
      {
        type: 'inside',
        start: 10,
        end: 0,
      },
      {
        startValue: 0,
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
      axisLabel: {
        formatter: (value: string) => {
          return format(parseISO(value), 'dd/MM/yyyy')
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => {
          return `$${value.toFixed(0)}`
        },
      },
    },
    series: [
      {
        name: 'Venta',
        data: dolares.map(item => item.venta),
        type: 'line',
        itemStyle: {
          color: colors.indigo[theme.value === 'dark' ? 500 : 300],
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: colors.indigo[theme.value === 'dark' ? 800 : 300],
            },
            {
              offset: 1,
              color: colors.indigo[theme.value === 'dark' ? 900 : 100],
            },
          ]),
        },
      },

      {
        name: 'Compra',
        data: dolares.map(item => item.compra),
        type: 'line',
        itemStyle: {
          color: colors.gray[500],
        },
      },
    ],
  } as any)
}

watch(
  casa,
  async (value) => {
    await setChartOptions(value)
  },
  {
    immediate: true,
  },
)
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
