---
aside: false
outline: false
title: Índices de inflación
---

<script setup>
import { useRoute, useData } from 'vitepress'

const route = useRoute()

const { isDark } = useData()
</script>

<Operation method="GET" id="get-finanzas-indices-inflacion">

<template #header="header">

# Índices de inflación

</template>

<template #description="description">

Devuelve los índices de inflación mensuales.

<!--@include: ./parts/get-finanzas-indices-inflacion-description-after.md -->

</template>

<template #parameters="parameters">

## {{ $t('Parameters') }}

<Parameters operation-id="get-finanzas-indices-inflacion" :parameters="parameters.parameters" />

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

<!--@include: ./parts/get-finanzas-indices-inflacion-footer.md -->

</template>

</Operation>
