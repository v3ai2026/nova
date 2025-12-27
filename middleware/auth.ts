export default defineNuxtRouteMiddleware(async (to) => {
  const { $supabase } = useNuxtApp()

  const { data: { user } } = await $supabase.auth.getUser()

  if (!user && to.path !== '/login' && to.path !== '/signup') {
    return navigateTo('/login')
  }

  if (user && (to.path === '/login' || to.path === '/signup')) {
    return navigateTo('/dashboard')
  }
})
