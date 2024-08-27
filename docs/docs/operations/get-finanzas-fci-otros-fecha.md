---
aside: false
outline: false
title: Otros
---

<script setup>
import { useRoute, useData } from 'vitepress'

const route = useRoute()

const { isDark } = useData()
</script>

<OAPath method="GET" id="get-finanzas-fci-otros-fecha">

<template #header="header">

# Otros

</template>

<template #description="description">

Devuelve los valores de Otros Fondos Comunes de Inversión en la fecha indicada (en formato `YYYY/MM/DD`).

También se puede consultar el `ultimo` y `penultimo` día con valores utilizando los endpoints: 

- `/v1/finanzas/fci/otros/ultimo`
- `/v1/finanzas/fci/otros/penultimo`

<!--@include: ./parts/get-finanzas-fci-otros-fecha-description-after.md -->

</template>

<template #parameters="parameters">

## {{ $t('Parameters') }}

<OAParameters operation-id="get-finanzas-fci-otros-fecha" :parameters="parameters.parameters" />

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

<!--@include: ./parts/get-finanzas-fci-otros-fecha-footer.md -->

</template>

</OAPath>
