---
aside: false
outline: false
title: Índices UVA
---

<script setup>
import { useRoute, useData } from 'vitepress'

const route = useRoute()

const { isDark } = useData()
</script>

<OAPath method="GET" id="get-finanzas-indices-uva">

<template #header="header">

# Índices UVA

</template>

<template #description="description">

Devuelve los índices UVA.

<!--@include: ./parts/get-finanzas-indices-uva-description-after.md -->

</template>

<template #parameters="parameters">

## {{ $t('Parameters') }}

<OAParameters operation-id="get-finanzas-indices-uva" :parameters="parameters.parameters" />

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

<!--@include: ./parts/get-finanzas-indices-uva-footer.md -->

</template>

</OAPath>
