export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase', '@vueuse/nuxt'],
  
  supabase: {
    redirect: false
  },
  
  runtimeConfig: {
    // 私有配置（仅服务端可用）
    // DATABASE_URL: 用于直接数据库连接和 Neon Serverless SQL
    // POSTGRES_URL: Vercel Postgres 兼容格式
    databaseUrl: process.env.DATABASE_URL,
    postgresUrl: process.env.POSTGRES_URL,
    // 公开配置（客户端也可访问）
    public: {
      apiBase: '/api'
    }
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
  compatibilityDate: '2024-12-27'
})
