<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { collect } from 'collect.js'
import { differenceInDays, format, isToday, parseISO } from 'date-fns'
import { useApi } from '../composables/useApi'

const api = useApi()

const feriados = ref()

async function fetchFeriados() {
  try {
    const feriados = await api.get(`/feriados/${new Date().getFullYear()}`)

    return feriados
  }
  catch (error) {
    return []
  }
}

onMounted(async () => {
  feriados.value = await fetchFeriados()
})

const proximosFeriados = computed(() => {
  if (!feriados.value)
    return []

  const today = new Date()

  return collect(feriados.value)
    .filter(feriado => parseISO(feriado.fecha) >= today)
    .toArray()
})

function formatLabel(date) {
  if (isToday(date))
    return 'Hoy'

  const days = differenceInDays(date, new Date())

  if (days === 0)
    return 'Mañana'

  if (days === 1)
    return 'Pasado mañana'

  return `Faltan ${days} días`
}
</script>

<template>
  <div>
    <h3>
      Próximos feriados
    </h3>

    <div v-if="proximosFeriados" class="flex flex-row p-2 space-x-2 overflow-x-auto">
      <div v-for="(feriado, idx) in proximosFeriados" :key="idx" class="flex flex-row space-x-2">
        <div class="flex flex-col">
          <span>
            {{ formatLabel(parseISO(feriado.fecha)) }}
          </span>

          <div class="flex flex-col flex-1 space-y-1 p-2 rounded border mr-auto min-w-[15rem]">
            <span class="text-sm">
              {{ format(parseISO(feriado.fecha), "eeee") }}
            </span>

            <span class="text-sm">
              {{ format(parseISO(feriado.fecha), "dd 'de' MMMM 'de' yyyy") }}
            </span>

            <span class="text-xl font-bold">
              {{ feriado?.nombre }}
            </span>

            <span class="flex-1" />

            <span class="text-sm">
              {{ feriado?.tipo }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
