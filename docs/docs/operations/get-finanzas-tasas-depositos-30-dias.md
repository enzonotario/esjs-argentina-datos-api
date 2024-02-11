---
aside: false
outline: false
title: Tasas de depósitos a 30 días
---

<script setup>
import { useRoute, useData } from 'vitepress'

const route = useRoute()

const { isDark } = useData()
</script>

<Operation method="GET" id="get-finanzas-tasas-depositos-30-dias">

<template #header="header">

# Tasas de depósitos a 30 días

</template>

<template #description="description">

Tasas de interés por depósitos a 30 días de plazo.

<!--@include: ./parts/get-finanzas-tasas-depositos-30-dias-description-after.md -->

</template>

<template #parameters="parameters">

## {{ $t('Parameters') }}

<Parameters operation-id="get-finanzas-tasas-depositos-30-dias" :parameters="parameters.parameters" />

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

<!--@include: ./parts/get-finanzas-tasas-depositos-30-dias-footer.md -->

</template>

</Operation>
