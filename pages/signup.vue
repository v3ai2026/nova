<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden p-6">
    <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNGgtMnYyaDJ2LTJ6bTAgNmgtMnYyaDJ2LTJ6bTAtMTRoLTJ2Mmgydi0yem0wIDRoLTJ2Mmgydi0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>

    <div class="absolute top-8 left-8">
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition">
          <Rocket class="w-6 h-6 text-white" />
        </div>
        <span class="text-xl font-bold text-white">DeployHub</span>
      </NuxtLink>
    </div>

    <div class="w-full max-w-md relative z-10 animate-slide-up">
      <div class="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 hover-lift">
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-sm text-purple-300 mb-4">
            <Sparkles class="w-4 h-4" />
            <span>Join thousands of developers</span>
          </div>
          <h1 class="text-3xl font-bold text-white mb-2">Create your account</h1>
          <p class="text-purple-200">Start deploying in minutes</p>
        </div>

        <form @submit.prevent="handleSignup" class="space-y-5">
          <div v-if="error" class="bg-red-500/20 backdrop-blur-lg border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle class="w-4 h-4" />
            {{ error }}
          </div>

          <div>
            <label for="fullName" class="block text-sm font-medium text-purple-100 mb-2">
              Full Name
            </label>
            <div class="relative">
              <User class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
              <input
                id="fullName"
                v-model="fullName"
                type="text"
                required
                class="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-white placeholder-purple-300/50"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-purple-100 mb-2">
              Email
            </label>
            <div class="relative">
              <Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-white placeholder-purple-300/50"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-purple-100 mb-2">
              Password
            </label>
            <div class="relative">
              <Lock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
              <input
                id="password"
                v-model="password"
                type="password"
                required
                minlength="6"
                class="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-white placeholder-purple-300/50"
                placeholder="••••••••"
              />
            </div>
            <p class="text-xs text-purple-300 mt-2 flex items-center gap-1">
              <Shield class="w-3 h-3" />
              Minimum 6 characters
            </p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full relative py-3.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] flex items-center justify-center gap-2 group"
          >
            <span>{{ loading ? 'Creating account...' : 'Create account' }}</span>
            <ArrowRight v-if="!loading" class="w-5 h-5 group-hover:translate-x-1 transition" />
            <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </button>
        </form>

        <div class="mt-6 text-center text-sm">
          <span class="text-purple-200">Already have an account?</span>
          <NuxtLink to="/login" class="text-white font-medium hover:text-purple-300 transition ml-1">
            Sign in
          </NuxtLink>
        </div>
      </div>

      <div class="mt-6 text-center text-xs text-purple-300">
        By signing up, you agree to our Terms of Service and Privacy Policy
      </div>
    </div>

    <div class="absolute bottom-8 right-8 flex gap-4 text-purple-300">
      <button class="hover:text-white transition">Help</button>
      <button class="hover:text-white transition">Privacy</button>
      <button class="hover:text-white transition">Terms</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Rocket, Sparkles, User, Mail, Lock, Shield, ArrowRight, AlertCircle } from 'lucide-vue-next'

const { signUp } = useAuth()

definePageMeta({
  layout: false
})

const fullName = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleSignup = async () => {
  try {
    loading.value = true
    error.value = ''
    await signUp(email.value, password.value, fullName.value)
    navigateTo('/onboarding')
  } catch (e: any) {
    error.value = e.message || 'Failed to create account'
  } finally {
    loading.value = false
  }
}
</script>
