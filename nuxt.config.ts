export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase', '@vueuse/nuxt'],
  
  supabase: {
    redirect: false
  },
  
  css: ['~/assets/css/main.css'],
  
  app: {
    head: {
      title: 'DeployHub - Modern Deployment Platform',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Deploy with confidence. The modern deployment platform.' }
      ]
    }
  },
  
  devtools: { enabled: true },
  compatibilityDate: '2024-07-30'
})
