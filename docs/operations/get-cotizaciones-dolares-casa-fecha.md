---
aside: false
outline: false
title: Dólar por casa y fecha
---

<script setup>
import { useRoute, useData } from 'vitepress'

const route = useRoute()

const { isDark } = useData()
</script>

<Operation method="GET" id="get-cotizaciones-dolares-casa-fecha">

<template #header="header">

# Dólar por casa y fecha

</template>

<template #description="description">

<div v-if="description.operation.description" class="description" v-html="description.operation.description" />

</template>

<template #parameters="parameters">

## {{ $t('Parameters') }}

<Parameters :operation-id="get-cotizaciones-dolares-casa-fecha" :parameters="parameters.parameters" />

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

</Operation>
