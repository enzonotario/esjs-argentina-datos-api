import { defineAsyncComponent } from 'vue'

export default {
  ChartFeriados: defineAsyncComponent(() => import('./ChartFeriados.vue')),
  ChartProximoFeriado: defineAsyncComponent(
    () => import('./ChartProximoFeriado.vue'),
  ),
  ChartDolares: defineAsyncComponent(() => import('./ChartDolares.vue')),
  ChartDolaresCasa: defineAsyncComponent(
    () => import('./ChartDolaresCasa.vue'),
  ),
  ChartDolaresCasaFecha: defineAsyncComponent(
    () => import('./ChartDolaresCasaFecha.vue'),
  ),
  ChartEventosPresidenciales: defineAsyncComponent(
    () => import('./ChartEventosPresidenciales.vue'),
  ),
  ChartIndicesInflacion: defineAsyncComponent(
    () => import('./ChartIndicesInflacion.vue'),
  ),
  ChartIndicesInflacionInteranual: defineAsyncComponent(
    () => import('./ChartIndicesInflacionInteranual.vue'),
  ),
  ChartTasasDepositos30Dias: defineAsyncComponent(
    () => import('./ChartTasasDepositos30Dias.vue'),
  ),
  ChartIndicesUva: defineAsyncComponent(() => import('./ChartIndicesUva.vue')),
  ChartIndicesRiesgoPais: defineAsyncComponent(() => import('./ChartIndicesRiesgoPais.vue')),
}
