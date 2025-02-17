import { URL, fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vitepress'
import { useSidebar } from 'vitepress-openapi'
import { genjiAttrs } from 'genji-theme-vitepress/config'
import spec from '../public/openapi.json' with { type: 'json' }

const env = loadEnv('', process.cwd())

const gTag = env.VITE_GTAG

const sidebar = useSidebar({ spec })

function addDocsPrefix(group: string) {
  return {
    ...group,
    items: group.items.map((item) => {
      return {
        ...item,
        link: `/docs${item.link}`,
      }
    }),
  }
}

export default defineConfig({
  title: 'ArgentinaDatos API',
  description: 'API para diferentes datos de Argentina',

  themeConfig: {
    logo: '/assets/logo.webp',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/enzonotario/esjs-argentina-datos-api' },
    ],
    outline: [1, 3],
    sidebar: [
      {
        text: `<span class="OASidebarItem">
        <svg class="i-mdi-home w-5 h-5" />
        <span class="OASidebarItem-text">Inicio</span>
      </span>`,
        link: '/',
      },
      {
        text: `<span class="OASidebarItem">
        <svg class="i-mdi-github w-5 h-5" />
        <span class="OASidebarItem-text">GitHub</span>
      </span>`,
        link: 'https://github.com/enzonotario/esjs-argentina-datos-api',
      },
      {
        text: 'Eventos',
        items: [
          addDocsPrefix(sidebar.generateSidebarGroup({
            tag: 'Eventos',
            text: '',
          })),
        ],
      },
      {
        text: 'Cotizaciones históricas',
        items: [
          addDocsPrefix(sidebar.generateSidebarGroup({
            tag: 'Cotizaciones históricas',
            text: '',
          })),
        ],
      },
      {
        text: 'Cotización actual',
        items: [
          {
            items: [
              {
                text: `<span class="OASidebarItem">
              <svg class="i-mdi-currency-usd w-5 h-5" />
              <span class="OASidebarItem-text">DolarApi</span> 
              </span>`,
                link: 'https://dolarapi.com/',
              },
            ],
          },
        ],
      },

      {
        text: 'Finanzas',
        items: [
          addDocsPrefix({
            ...sidebar.generateSidebarGroup({
              tag: ['Finanzas', 'Índices'],
              text: 'Índices',
            }),
            collapsed: true,
          }),
          addDocsPrefix({
            ...sidebar.generateSidebarGroup({
              tag: ['Finanzas', 'Tasas'],
              text: 'Tasas',
            }),
            collapsed: true,
          }),
          addDocsPrefix({
            ...sidebar.generateSidebarGroup({
              tag: ['Finanzas', 'Rendimientos'],
              text: 'Rendimientos',
            }),
            collapsed: true,
          }),
          addDocsPrefix({
            ...sidebar.generateSidebarGroup({
              tag: ['Finanzas', 'FCI'],
              text: 'FCI',
            }),
            collapsed: true,
          }),
        ],
      },
      {
        text: 'API',
        items: [
          addDocsPrefix(sidebar.generateSidebarGroup({
            tag: 'API',
            text: '',
          })),
        ],
      },
    ],
    nav: [
      { text: 'Aviso Legal', link: '/docs/legal' },
    ],
    footer: {
      message: 'Liberado bajo la <a href="https://github.com/enzonotario/esjs-argentina-datos-api/blob/main/LICENSE">Licencia MIT</a>.',
      copyright: '<a href="/docs/legal">Aviso Legal</a>',
    },
    search: {
      provider: 'algolia',
      options: {
        appId: 'UNH9XU8JKG',
        apiKey: '11a8390143d57724a4fd9b8b120899ce',
        indexName: 'argentinadatos',
      },
    },
  },

  head: [
    // Google Analytics
    [
      'script',
      { async: '', src: `https://www.googletagmanager.com/gtag/js?id=${gTag}` },
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gTag}');`,
    ],
  ],

  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./', import.meta.url)),
      },
    },
    optimizeDeps: {
      include: [
        'genji-theme-vitepress > genji-runtime > esprima',
        'genji-theme-vitepress > genji-runtime > estraverse',
      ],
    },
  },

  markdown: {
    config: (md) => {
      md.use(genjiAttrs)
    },
  },
})
