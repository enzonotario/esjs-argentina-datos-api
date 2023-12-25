import { defineConfigWithTheme } from "vitepress";
import { useOpenapi, useSidebar } from "vitepress-theme-openapi";
import spec from '../public/openapi.json' assert { type: 'json' }

const openapi = useOpenapi()
openapi.setSpec(spec)
const sidebar = useSidebar()

export default defineConfigWithTheme({
  title: "ArgentinaDatos API",
  description: "API para diferentes datos de Argentina",
  themeConfig: {
    logo: '/assets/logo.webp',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/enzonotario/esjs-argentina-datos-api' },
    ],
    outline: [1, 3],
    sidebar: [
      ...sidebar.generateSidebarGroups(),
    ],
  },
})
