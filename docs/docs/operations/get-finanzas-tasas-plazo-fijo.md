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

<OAOperation operation-id="get-finanzas-tasas-plazo-fijo">

<template #footer="footer">

<!--@include: ./parts/get-finanzas-tasas-plazo-fijo-footer.md -->

</template>

</OAOperation>
