---
aside: false
outline: false
title: Depósitos a 30 días
---

<script setup>
import { useRoute, useData } from 'vitepress'

const route = useRoute()

const { isDark } = useData()
</script>

<OAOperation operation-id="get-finanzas-tasas-depositos-30-dias" />

<!--@include: ./parts/get-finanzas-tasas-depositos-30-dias-footer.md -->
