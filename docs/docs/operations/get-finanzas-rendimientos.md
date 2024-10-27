---
aside: false
outline: false
title: Rendimientos de todas las entidades
---

<script setup>
import { useRoute, useData } from 'vitepress'

const route = useRoute()

const { isDark } = useData()
</script>

<OAOperation operation-id="get-finanzas-rendimientos">

<template #footer="footer">

<!--@include: ./parts/get-finanzas-rendimientos-footer.md -->

</template>

</OAOperation>
