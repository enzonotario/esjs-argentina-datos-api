---
aside: false
outline: false
title: Renta fija
---

<script setup>
import { useRoute, useData } from 'vitepress'

const route = useRoute()

const { isDark } = useData()
</script>

<OAPath method="GET" id="get-finanzas-fci-renta-fija-fecha">

<template #header="header">

# Renta fija

</template>

<template #description="description">

Devuelve los valores de Renta Fija de los Fondos Comunes de Inversión en la fecha indicada (en formato `YYYY/MM/DD`).

También se puede consultar el `ultimo` y `penultimo` día con valores utilizando los endpoints: 

- `/v1/finanzas/fci/rentaFija/ultimo`
- `/v1/finanzas/fci/rentaFija/penultimo`

<!--@include: ./parts/get-finanzas-fci-renta-fija-fecha-description-after.md -->

</template>

<template #parameters="parameters">

## {{ $t('Parameters') }}

<OAParameters operation-id="get-finanzas-fci-renta-fija-fecha" :parameters="parameters.parameters" />

</template>

<template #responses="responses">

## {{ $t('Response') }}

<OAResponses :responses="responses.responses" :schema="responses.schema" :responseType="responses.responseType" :isDark="isDark">

<template #body="body">

<OAResponseBody :schema="body.schema" :responseType="body.responseType" />

</template>

</OAResponses>

</template>

<template #try-it="tryIt">

<OATryWithVariables :operation-id="tryIt.operationId" :method="tryIt.method" :path="tryIt.path" :baseUrl="tryIt.baseUrl" :isDark="isDark" />

</template>

<template #footer="footer">

<OAFooter />

<!--@include: ./parts/get-finanzas-fci-renta-fija-fecha-footer.md -->

</template>

</OAPath>
