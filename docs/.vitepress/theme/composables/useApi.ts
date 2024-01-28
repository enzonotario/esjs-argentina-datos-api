import { useOpenapi } from 'vitepress-theme-openapi'

export const useApi = () => {
  const openapi = useOpenapi()

  const baseUrl = openapi.getBaseUrl()

  function get(url: string) {
    return fetch(`${baseUrl}/v1${url}`).then(res => res.json())
  }

  return {
    get,
  }
}
