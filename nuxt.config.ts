// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  app: {
    baseURL: '/milad-kamali.github.io/', // baseURL: '/<repository>/'
    buildAssetsDir: 'assets', // don't use "_" at the begining of the folder name to avoids nojkill conflict
  },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: [
    '@vite-pwa/nuxt'
  ],
  pwa: {
    manifest: {
      name: 'PDF Splitter',
      short_name: 'PDF Splitter',
      description: 'Developed by Milad Kamali'
    },
  },
  devtools: { enabled: true }
})
