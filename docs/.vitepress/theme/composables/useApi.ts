export const useApi = () => {
  const baseUrl = 'https://api.argentinadatos.com/v1'

  function get(url: string) {
    return fetch(`${baseUrl}${url}`).then(res => res.json())
  }

  return {
    get,
  }
}
