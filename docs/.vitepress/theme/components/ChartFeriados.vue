<script setup lang="ts">
import { ref, watch } from 'vue'
import colors from 'tailwindcss/colors'
import { collect } from 'collect.js'
import { FwbInput, FwbSpinner } from 'flowbite-vue'
import { format, parseISO } from 'date-fns'
import { useApi } from '../composables/useApi'
import { useEcharts } from '../composables/useEcharts'

const chartRef = ref()

const { setOptions, theme } = useEcharts(chartRef)

const api = useApi()

const year = ref(new Date().getFullYear())

const colorsMap = {
  inamovible: colors.orange[500],
  trasladable: colors.blue[500],
  puente: colors.green[500],
}

const loading = ref(false)

function weekends() {
  const weekends = []
  const startDate = new Date(`${year.value}-01-01`)
  const endDate = new Date(`${year.value}-12-31`)
  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    if (d.getDay() === 5 || d.getDay() === 6)
      weekends.push([d.toISOString().split('T')[0], 0])
  }
  return weekends
}

async function fetchFeriados() {
  loading.value = true

  try {
    const feriados = await api.get(`/feriados/${year.value}`)

    return feriados
  }
  catch (error) {
    return []
  }
  finally {
    loading.value = false
  }
}

async function setChartOptions() {
  const feriados = await fetchFeriados()

  const today = new Date()

  const allTypes = collect(feriados)
    .pluck('tipo')
    .unique()
    .all()

  setOptions({
    tooltip: {},
    calendar: {
      top: 100,
      left: 30,
      right: 30,
      cellSize: ['auto', 13],
      range: year,
      itemStyle: {
        borderWidth: 0.5,
      },
      yearLabel: {
        show: false,
      },
    },
    legend: {
      top: '30',
      left: '100',
      data: ['Fin de semana', ...allTypes, 'Hoy'],
      textStyle: {
        color: theme.value === 'dark' ? colors.gray[300] : colors.gray[700],
      },
    },
    series: [
      {
        name: 'Fin de semana',
        type: 'scatter',
        coordinateSystem: 'calendar',
        data: weekends(),
        itemStyle: {
          color: theme.value === 'dark' ? colors.gray[600] : colors.gray[300],
        },
        tooltip: {
          formatter(params) {
            const data = params.data

            if (data.length === 2 && data[1] === 0) {
              return `<div class="flex flex-col">
                <span class="text-xs">${format(
                  parseISO(data[0]),
                  'EEEE, d MMMM yyyy',
                )}</span>
                <div class="text-md font-bold">Fin de semana</div>
              </div>`
            }
          },
        },
      },

      ...collect(feriados)
        .pluck('tipo')
        .unique()
        .all()
        .map(type => ({
          name: type,
          type: 'scatter',
          coordinateSystem: 'calendar',
          data: feriados
            .filter(item => item.tipo === type)
            .map((item) => {
              return [item.fecha, 1]
            }),
          itemStyle: {
            color: colorsMap[type],
          },
          tooltip: {
            formatter(params) {
              const data = params.data

              if (data.length === 2 && data[1] === 1) {
                const feriado = feriados.find(item => item.fecha === data[0])

                if (feriado) {
                  return `<div class="flex flex-col">
                  <span class="text-xs">${format(
                    parseISO(feriado.fecha),
                    'EEEE, d MMMM yyyy',
                  )}</span>
                  <div class="text-md font-bold">${feriado.nombre}</div>
                  <div class="text-sm">Tipo: <span class="font-bold">${
                    feriado.tipo
                  }</span></div>
                </div>`
                }
              }
            },
          },
        })),

      ...(today.getFullYear() === year.value
        ? [
            {
              name: 'Hoy',
              type: 'scatter',
              coordinateSystem: 'calendar',
              data: [[today.toISOString().split('T')[0], 2]],
              itemStyle: {
                color:
                  theme.value === 'dark'
                    ? colors.indigo[100]
                    : colors.indigo[500],
              },
              label: {
                show: true,
                formatter: 'Hoy',
                color:
                  theme.value === 'dark' ? colors.gray[100] : colors.gray[700],
                position: 'top',
              },
              tooltip: {
                formatter(params) {
                  const data = params.data

                  if (data.length === 2 && data[1] === 2) {
                    return `<div class="flex flex-col">
                <span class="text-xs">${format(
                  parseISO(data[0]),
                  'EEEE, d MMMM yyyy',
                )}</span>
                <div class="text-md font-bold">Hoy</div>
              </div>`
                  }
                },
              },
            },
          ]
        : []),
    ],
  } as any)
}

watch(
  year,
  async () => {
    await setChartOptions()
  },
  { immediate: true },
)
</script>

<template>
  <div>
    <div class="flex justify-start items-center space-x-4">
      <h3 style="margin: 0">
        Feriados del año
      </h3>

      <FwbInput
        v-model="year"
        type="number"
        :min="2000"
        :max="new Date().getFullYear()"
        :step="1"
      />

      <FwbSpinner v-show="loading" size="6" />
    </div>

    <div ref="chartRef" class="h-[20rem]" />
  </div>
</template>
