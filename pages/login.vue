<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden p-6">
    <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNGgtMnYyaDJ2LTJ6bTAgNmgtMnYyaDJ2LTJ6bTAtMTRoLTJ2Mmgydi0yem0wIDRoLTJ2Mmgydi0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>

    <div class="absolute top-8 left-8">
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition">
          <Rocket class="w-6 h-6 text-white" />
        </div>
        <span class="text-xl font-bold text-white">DeployHub</span>
      </NuxtLink>
    </div>

    <div class="w-full max-w-md relative z-10 animate-slide-up">
      <div class="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 hover-lift">
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-sm text-blue-300 mb-4">
            <Sparkles class="w-4 h-4" />
            <span>Welcome back</span>
          </div>
          <h1 class="text-3xl font-bold text-white mb-2">Sign in to your account</h1>
          <p class="text-blue-200">Continue your deployment journey</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div v-if="error" class="bg-red-500/20 backdrop-blur-lg border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle class="w-4 h-4" />
            {{ error }}
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-blue-100 mb-2">
              Email
            </label>
            <div class="relative">
              <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-white placeholder-blue-300/50"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-blue-100 mb-2">
              Password
            </label>
            <div class="relative">
              <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
              <input
                id="password"
                v-model="password"
                type="password"
                required
                class="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-white placeholder-blue-300/50"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full relative py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] flex items-center justify-center gap-2 group"
          >
            <span>{{ loading ? 'Signing in...' : 'Sign in' }}</span>
            <ArrowRight v-if="!loading" class="w-5 h-5 group-hover:translate-x-1 transition" />
            <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </button>
        </form>

        <div class="mt-6 text-center text-sm">
          <span class="text-blue-200">Don't have an account?</span>
          <NuxtLink to="/signup" class="text-white font-medium hover:text-blue-300 transition ml-1">
            Sign up
          </NuxtLink>
        </div>
      </div>

      <div class="mt-6 text-center text-xs text-blue-300">
        By signing in, you agree to our Terms of Service and Privacy Policy
      </div>
    </div>

    <div class="absolute bottom-8 right-8 flex gap-4 text-blue-300">
      <button class="hover:text-white transition">Help</button>
      <button class="hover:text-white transition">Privacy</button>
      <button class="hover:text-white transition">Terms</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Rocket, Sparkles, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-vue-next'

const { signIn } = useAuth()

definePageMeta({
  layout: false
})

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''
    await signIn(email.value, password.value)
    navigateTo('/dashboard')
  } catch (e: any) {
    error.value = e.message || 'Failed to sign in'
  } finally {
    loading.value = false
  }
}
</script>
