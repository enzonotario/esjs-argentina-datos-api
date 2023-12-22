import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import EsJS from '@es-js/vite-plugin-esjs'
import devServer from '@hono/vite-dev-server'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // https://github.com/es-js/esjs
    EsJS(),

    // https://github.com/honojs/vite-plugins
    devServer({
      entry: './api/app.esjs',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.esjs',
    ],
  },
  build: {
    outDir: './dist',
    rollupOptions: {
      input: './api/app.esjs',
    },
  },
})
