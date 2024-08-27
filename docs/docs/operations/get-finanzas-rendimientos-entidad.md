---
aside: false
outline: false
title: Por entidad
---

<script setup>
import { useRoute, useData } from 'vitepress'

const route = useRoute()

const { isDark } = useData()
</script>

<OAPath method="GET" id="get-finanzas-rendimientos-entidad">

<template #header="header">

# Por entidad

</template>

<template #description="description">

Rendimientos de distintas monedas por entidad.

Las entidades disponibles son:

- [Buenbit](https://buenbit.com/?ref=argentinadatos.com)

- [Fiwind](https://www.fiwind.io/?ref=argentinadatos.com)

- [Letsbit](https://letsbit.io/?ref=argentinadatos.com)

- [Belo](https://www.belo.app/?ref=argentinadatos.com)

- [Lemon Cash](https://www.lemon.me/?ref=argentinadatos.com)

- [Ripio](https://www.ripio.com/ar/?ref=argentinadatos.com)

<!--@include: ./parts/get-finanzas-rendimientos-entidad-description-after.md -->

</template>

<template #parameters="parameters">

## {{ $t('Parameters') }}

<OAParameters operation-id="get-finanzas-rendimientos-entidad" :parameters="parameters.parameters" />

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

<!--@include: ./parts/get-finanzas-rendimientos-entidad-footer.md -->

</template>

</OAPath>
