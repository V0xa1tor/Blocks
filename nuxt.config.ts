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

  modules: ["@pinia/nuxt"]
});