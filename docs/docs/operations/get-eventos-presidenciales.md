---
aside: false
outline: false
title: Eventos presidenciales
---

<script setup>
import { useRoute, useData } from 'vitepress'

const route = useRoute()

const { isDark } = useData()
</script>

<OAOperation operation-id="get-eventos-presidenciales" />

<!--@include: ./parts/get-eventos-presidenciales-footer.md -->
