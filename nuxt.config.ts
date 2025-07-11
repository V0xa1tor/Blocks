export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },

  css: [
    "/node_modules/bootstrap/dist/css/bootstrap.css",
    "/node_modules/bootstrap-icons/font/bootstrap-icons.css"
  ],

  app: {
    head: {
      title: "Bloctopus",
      link: [
        { rel: "icon", href: "/favicon.svg" }
      ],
      script: [
        { src: "/auto-theme.js" }
      ]
    }
  },

  pwa: {
    manifest: {
      name: 'Bloctopus',
      short_name: 'Bloctopus',
      description: 'Block and octopus',
      theme_color: '#000000',
      background_color: "#000000",
      icons: [
        {
          src: '/bloctopus.svg',
          sizes: 'any',
          type: 'image/svg+xml',
        },
        {
          src: '/bloctopus_192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/bloctopus_512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ],
    },
    registerType: 'autoUpdate',
    workbox: {
      navigateFallback: '/'
    }
  },

  modules: ["@pinia/nuxt", "@vite-pwa/nuxt"]
});
