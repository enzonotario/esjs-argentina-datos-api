---
aside: false
outline: false
title: Dólares por casa
---

<script setup>
import { useRoute, useData } from 'vitepress'

const route = useRoute()

const { isDark } = useData()
</script>

<Operation method="GET" id="get-cotizaciones-dolares-casa">

<template #header="header">

# Dólares por casa

</template>

<template #description="description">

Devuelve las cotizaciones del dólar de la casa de cambio especificada.

<!--@include: ./parts/get-cotizaciones-dolares-casa-description-after.md -->

</template>

<template #parameters="parameters">

## {{ $t('Parameters') }}

<Parameters :operation-id="get-cotizaciones-dolares-casa" :parameters="parameters.parameters" />

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

<!--@include: ./parts/get-cotizaciones-dolares-casa-footer.md -->

</template>

</Operation>
