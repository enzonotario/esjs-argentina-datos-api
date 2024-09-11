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

<OAOperation operation-id="get-finanzas-rendimientos-entidad">

<template #footer="footer">

<OAFooter />

<!--@include: ./parts/get-finanzas-rendimientos-entidad-footer.md -->

</template>

</OAOperation>
