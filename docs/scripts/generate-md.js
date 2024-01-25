import fs from 'node:fs'
import { useOpenapi } from 'vitepress-theme-openapi'

const loadJSON = (path) =>
  JSON.parse(fs.readFileSync(new URL(path, import.meta.url)))

const spec = loadJSON('../public/openapi.json')

const openapi = useOpenapi()
openapi.setSpec(spec)

export function init() {
  return Object.keys(spec.paths).map((path) => {
    const { operationId } = spec.paths[path].get

    const markdown = generateMarkdown(operationId)

    fs.writeFileSync(`docs/operations/${operationId}.md`, markdown)
  })
}

function generateMarkdown(operationId) {
  const operation = openapi.getOperation(operationId)

  const schemas = openapi.getSchemas()

  const response200 = operation.responses['200']

  const responseType = response200.content['application/json'].schema.items
    ? 'array'
    : 'object'

  const schemaTitle = (
    responseType === 'array'
      ? response200.content['application/json'].schema.items
      : response200.content['application/json'].schema
  ).$ref
    .split('/')
    .pop()

  const schema = Object.values(schemas).find(
    (schema) => schema.title === schemaTitle,
  )

  const schemaJson = useOpenapi().propertiesTypesJson(schema, responseType)

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

<Operation method="GET" id="${operationId}">

<template #header="header">

# ${operation.summary}

</template>

<template #description="description">

${operation.description || ''}

<!--@include: ./parts/${operationId}-description-after.md -->

</template>

<template #parameters="parameters">

## {{ $t('Parameters') }}

<Parameters :operation-id="${operationId}" :parameters="parameters.parameters" />

</template>

<template #responses="responses">

## {{ $t('Response') }}

<Responses :responses="responses.responses" :schema="responses.schema" :responseType="responses.responseType" :isDark="isDark">

<template #body="body">

<ResponseBody :schema="body.schema" :responseType="body.responseType" />

</template>

</Responses>

</template>

<template #try-it="tryIt">

<TryWithVariables :operation-id="tryIt.operationId" :method="tryIt.method" :path="tryIt.path" :baseUrl="tryIt.baseUrl" :isDark="isDark" />

</template>

<template #footer="footer">

<!--@include: ./parts/${operationId}-footer.md -->

</template>

</Operation>
`
  return markdown
}

try {
  init()
} catch (error) {
  console.error(error)
}
