---
aside: false
outline: false
title: Información de Fondos Comunes de Inversión
---

<script setup>
import { useRoute, useData } from 'vitepress'

const route = useRoute()

const { isDark } = useData()
</script>

<Operation method="GET" id="get-finanzas-fci-mercado-dinero-fecha">

<template #header="header">

# Información de Fondos Comunes de Inversión

</template>

<template #description="description">

Devuelve la información de los Fondos Comunes de Inversión en la fecha indicada (en formato `YYYY/MM/DD`).

También se puede consultar el `ultimo` y `penultimo` día con valores utilizando los endpoints: 

- `/v1/finanzas/fci/mercadoDinero/ultimo`
- `/v1/finanzas/fci/mercadoDinero/penultimo`

<!--@include: ./parts/get-finanzas-fci-mercado-dinero-fecha-description-after.md -->

</template>

<template #parameters="parameters">

## {{ $t('Parameters') }}

<Parameters operation-id="get-finanzas-fci-mercado-dinero-fecha" :parameters="parameters.parameters" />

</template>

<template #responses="responses">

## {{ $t('Response') }}

<Responses :responses="responses.responses" :schema="responses.schema" :responseType="responses.responseType" :isDark="isDark">

<template #body="body">

<ResponseBody :schema="body.schema" :responseType="body.responseType" />

</template>

</Responses>

</template>

<template #try-it="tryIt">

<TryWithVariables :operation-id="tryIt.operationId" :method="tryIt.method" :path="tryIt.path" :baseUrl="tryIt.baseUrl" :isDark="isDark" />

</template>

<template #footer="footer">

<!--@include: ./parts/get-finanzas-fci-mercado-dinero-fecha-footer.md -->

</template>

</Operation>
