---
aside: false
outline: false
title: Dólares
---

<script setup>
import { useRoute, useData } from 'vitepress'

const route = useRoute()

const { isDark } = useData()
</script>

<OAPath method="GET" id="get-cotizaciones-dolares">

<template #header="header">

# Dólares

</template>

<template #description="description">

Devuelve las cotizaciones de todas las casas de cambio.

<!--@include: ./parts/get-cotizaciones-dolares-description-after.md -->

</template>

<template #parameters="parameters">

## {{ $t('Parameters') }}

<OAParameters operation-id="get-cotizaciones-dolares" :parameters="parameters.parameters" />

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

<!--@include: ./parts/get-cotizaciones-dolares-footer.md -->

</template>

</OAPath>
