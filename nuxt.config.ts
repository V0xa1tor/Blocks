export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
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
  }
});
