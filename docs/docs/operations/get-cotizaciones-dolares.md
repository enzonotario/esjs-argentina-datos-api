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

<OAOperation operation-id="get-cotizaciones-dolares">

<template #footer="footer">

<!--@include: ./parts/get-cotizaciones-dolares-footer.md -->

</template>

</OAOperation>
