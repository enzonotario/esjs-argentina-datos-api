<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useOpenapi } from 'vitepress-theme-openapi'
import { ApiClient, useRequestStore } from '@scalar/api-client'
import {
  OkuDialog,
  OkuDialogContent,
  OkuDialogDescription,
  OkuDialogOverlay,
  OkuDialogPortal,
  OkuDialogTitle,
  OkuDialogTrigger,
} from '@oku-ui/dialog'
import { codeToHtml } from 'shikiji'
import { useData } from 'vitepress'

const props = defineProps({
  operationId: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
})

const { isDark } = useData()

const openapi = useOpenapi()

const operationPath = openapi.getOperationPath(props.operationId)

const baseUrl = openapi.getBaseUrl()

const apiKey = ref(null)

const html = ref(null)

const { setActiveRequest } = useRequestStore()

const codeSamples = useOpenapi().getOperationCodeSamples(props.operationId)

const curl = codeSamples.find(codeSample => codeSample.lang === 'curl')

onMounted(async () => {
  setupScalar()

  setupCodeSample()
})

async function setupCodeSample() {
  if (!curl)
    return

  html.value = await codeToHtml(curl.source, {
    lang: 'bash',
    theme: isDark.value ? 'vitesse-dark' : 'vitesse-light',
  })
}

function setupScalar() {
  const operation = openapi.getOperation(props.operationId)

  const variables = (operation.parameters || []).map((parameter) => {
    return {
      name: parameter.name,
      value: parameter.schema.default,
      required: parameter.required,
      enabled: true,
    }
  })

  setActiveRequest({
    url: baseUrl,
    type: 'GET',
    path: operationPath,
    name: props.operationId,
    headers: [
      {
        name: 'x-argentinadatos-key',
        value: apiKey.value,
        required: true,
        enabled: true,
      },
    ],
    variables,
  })
}
</script>

<template>
  <div class="flex flex-col space-y-2 rounded border border-gray-200 dark:border-gray-700">
    <OperationEndpoint :method="props.method" :base-url="baseUrl" :path="operationPath" />

    <div v-if="curl" class="p-2 overflow-x-auto" v-html="html" />

    <div class="flex flex-row justify-end px-2 pb-2">
      <div class="flex flex-shrink">
        <OkuDialog>
          <OkuDialogTrigger as-child>
            <button
              class="button-primary py-1 px-2 text-sm rounded"
            >
              {{ $t('Try it out') }}
            </button>
          </OkuDialogTrigger>
          <OkuDialogPortal>
            <OkuDialogOverlay
              class="z-40 bg-black/40 data-[state=open]:animate-overlayShow fixed inset-0"
            />
            <OkuDialogTitle
              class="text-blackOA-900 dark:text-white m-0 text-[17px] font-medium"
            >
              {{ $t('Try it out') }}
            </OkuDialogTitle>
            <OkuDialogDescription
              class="text-blackOA-600 dark:text-grayOA-300 dark:text mt-[10px] mb-5 text-[15px] leading-normal"
            >
              {{ $t('Try requests directly from the documentation') }}
            </OkuDialogDescription>
            <OkuDialogContent
              class="z-50 bg-white dark:bg-gray-900 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] translate-x-[-50%] translate-y-[-50%] overflow-x-hidden rounded-[6px] p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"
            >
              <ApiClient theme="none" />
            </OkuDialogContent>
          </OkuDialogPortal>
        </OkuDialog>
      </div>
    </div>
  </div>
</template>
