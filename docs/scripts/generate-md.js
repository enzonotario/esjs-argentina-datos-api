import fs from 'node:fs'
import { useOpenapi } from 'vitepress-openapi'

const loadJSON = (path) =>
  JSON.parse(fs.readFileSync(new URL(path, import.meta.url)))

const spec = loadJSON('../public/openapi.json')

const openapi = useOpenapi({ spec })

export function init() {
  return Object.keys(spec.paths).map((path) => {
    const { operationId } = spec.paths[path].get

    const markdown = generateMarkdown(operationId)

    fs.writeFileSync(`docs/operations/${operationId}.md`, markdown)
  })
}

function generateMarkdown(operationId) {
  const operation = openapi.getOperation(operationId)

  const markdown = `---
aside: false
outline: false
title: ${operation.summary}
---

<script setup>
import { useRoute, useData } from 'vitepress'

const route = useRoute()

const { isDark } = useData()
</script>

<OAOperation operation-id="${operationId}">

<template #footer="footer">

<OAFooter />

<!--@include: ./parts/${operationId}-footer.md -->

</template>

</OAOperation>
`
  return markdown
}

try {
  init()
} catch (error) {
  console.error(error)
}
