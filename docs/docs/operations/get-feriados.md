---
aside: false
outline: false
title: Feriados
---

<script setup>
import { useRoute, useData } from 'vitepress'

const route = useRoute()

const { isDark } = useData()
</script>

<OAOperation operation-id="get-feriados">

<template #footer="footer">

<!--@include: ./parts/get-feriados-footer.md -->

</template>

</OAOperation>
