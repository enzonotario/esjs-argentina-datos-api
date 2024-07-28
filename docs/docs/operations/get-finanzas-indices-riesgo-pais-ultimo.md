---
aside: false
outline: false
title: Riesgo país (último)
---

<script setup>
import { useRoute, useData } from 'vitepress'

const route = useRoute()

const { isDark } = useData()
</script>

<Path method="GET" id="get-finanzas-indices-riesgo-pais-ultimo">

<template #header="header">

# Riesgo país (último)

</template>

<template #description="description">

Devuelve el último valor de riesgo país.

<!--@include: ./parts/get-finanzas-indices-riesgo-pais-ultimo-description-after.md -->

</template>

<template #parameters="parameters">

## {{ $t('Parameters') }}

<Parameters operation-id="get-finanzas-indices-riesgo-pais-ultimo" :parameters="parameters.parameters" />

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

<OAFooter />

<!--@include: ./parts/get-finanzas-indices-riesgo-pais-ultimo-footer.md -->

</template>

</Path>
