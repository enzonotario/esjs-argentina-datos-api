---
aside: false
outline: false
title: Plazo fijo
---

<script setup>
import { useRoute, useData } from 'vitepress'

const route = useRoute()

const { isDark } = useData()
</script>

<OAPath method="GET" id="get-finanzas-tasas-plazo-fijo">

<template #header="header">

# Plazo fijo

</template>

<template #description="description">

Tasa Nominal Anual para colocaciones online de $100.000 a 30 días.(*).

Las tasas son reportadas por los bancos al BCRA en cumplimiento del Régimen Informativo de Transparencia, capítulo I.

(*): La tasa puede cambiar para otros montos o plazos.

<!--@include: ./parts/get-finanzas-tasas-plazo-fijo-description-after.md -->

</template>

<template #parameters="parameters">

## {{ $t('Parameters') }}

<OAParameters operation-id="get-finanzas-tasas-plazo-fijo" :parameters="parameters.parameters" />

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

<!--@include: ./parts/get-finanzas-tasas-plazo-fijo-footer.md -->

</template>

</OAPath>
