---
aside: false
outline: false
title: Dólar por casa y fecha
---

<script setup>
import { useRoute, useData } from 'vitepress'

const route = useRoute()

const { isDark } = useData()
</script>

<OAOperation operation-id="get-cotizaciones-dolares-casa-fecha" />

<!--@include: ./parts/get-cotizaciones-dolares-casa-fecha-footer.md -->
