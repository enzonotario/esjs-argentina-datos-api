---
aside: false
outline: false
title: Riesgo país
---

<script setup>
import { useRoute, useData } from 'vitepress'

const route = useRoute()

const { isDark } = useData()
</script>

<OAPath method="GET" id="get-finanzas-indices-riesgo-pais">

<template #header="header">

# Riesgo país

</template>

<template #description="description">

Devuelve una lista de riesgo país. Para obtener el último valor, consultar `/v1/finanzas/indices/riesgo-pais/ultimo`.

<!--@include: ./parts/get-finanzas-indices-riesgo-pais-description-after.md -->

</template>

<template #parameters="parameters">

## {{ $t('Parameters') }}

<OAParameters operation-id="get-finanzas-indices-riesgo-pais" :parameters="parameters.parameters" />

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

<!--@include: ./parts/get-finanzas-indices-riesgo-pais-footer.md -->

</template>

</OAPath>
