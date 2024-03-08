// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  app: {
    // baseURL: '/https://pdf-splitter-mk.netlify.app/',
    // buildAssetsDir: 'assets', // don't use "_" at the begining of the folder name to avoids nojkill conflict
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css' }
      ]
    }
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
