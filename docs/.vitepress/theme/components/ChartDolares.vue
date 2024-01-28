<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { collect } from 'collect.js'
import colors from 'tailwindcss/colors'
import * as echarts from 'echarts'
import { format, parseISO } from 'date-fns'
import { useApi } from '../composables/useApi'
import { useEcharts } from '../composables/useEcharts'

const selectedDefault = ['oficial', 'blue', 'mayorista', 'tarjeta', 'contadoconliqui']

const colorsMap = {
  oficial: colors.gray,
  blue: colors.blue,
  bolsa: colors.purple,
  contadoconliqui: colors.pink,
  mayorista: colors.yellow,
  solidario: colors.teal,
  cripto: colors.red,
  tarjeta: colors.indigo,
}

const chartRef = ref()

const { setOptions, theme } = useEcharts(chartRef)

const api = useApi()

async function fetchDolares() {
  try {
    const dolares = collect(await api.get('/cotizaciones/dolares'))
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

async function setChartOptions() {
  const dolares = await fetchDolares()

  const casas = collect(dolares).pluck('casa').unique().toArray()

  setOptions({
    legend: {
      data: casas,
      selected: casas.reduce(
        (carry, casa) => ({
          ...carry,
          [casa]: selectedDefault.includes(casa),
        }),
        {},
      ),
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
            const casa = item.seriesName
            const value = item.value

            return `<div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full" style="background-color: ${
                colorsMap.hasOwnProperty(casa)
                  ? colorsMap[casa][theme.value === 'dark' ? 300 : 500]
                  : colors.gray[theme.value === 'dark' ? 300 : 500]
              }"></div>
              <div>${casa}: $${value}</div>
            </div>`
          })
          .join('')

        return `<div class="flex flex-col gap-1">
          <div>${format(parseISO(date), 'dd/MM/yyyy')}</div>
          ${items}
        </div>`
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
      ...dolares
        .map(item => item.casa)
        .filter((value, index, self) => self.indexOf(value) === index)
        .map(casa => ({
          name: casa,
          data: dolares
            .filter(item => item.casa === casa)
            .map(item => item.venta),
          type: 'line',
          itemStyle: {
            color: colorsMap.hasOwnProperty(casa)
              ? colorsMap[casa][theme.value === 'dark' ? 300 : 500]
              : colors.gray[theme.value === 'dark' ? 300 : 500],
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorsMap.hasOwnProperty(casa)
                  ? colorsMap[casa][theme.value === 'dark' ? 800 : 100]
                  : colors.gray[theme.value === 'dark' ? 800 : 100],
              },
              {
                offset: 1,
                color: colorsMap.hasOwnProperty(casa)
                  ? colorsMap[casa][theme.value === 'dark' ? 900 : 300]
                  : colors.gray[theme.value === 'dark' ? 900 : 300],
              },
            ]),
          },
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
