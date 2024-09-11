---
aside: false
outline: false
title: Otros
---

<script setup>
import { useRoute, useData } from 'vitepress'

const route = useRoute()

const { isDark } = useData()
</script>

<OAOperation operation-id="get-finanzas-fci-otros-fecha">

<template #footer="footer">

<OAFooter />

<!--@include: ./parts/get-finanzas-fci-otros-fecha-footer.md -->

</template>

</OAOperation>
