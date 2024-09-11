---
aside: false
outline: false
title: Renta fija
---

<script setup>
import { useRoute, useData } from 'vitepress'

const route = useRoute()

const { isDark } = useData()
</script>

<OAOperation operation-id="get-finanzas-fci-renta-fija-fecha">

<template #footer="footer">

<OAFooter />

<!--@include: ./parts/get-finanzas-fci-renta-fija-fecha-footer.md -->

</template>

</OAOperation>
