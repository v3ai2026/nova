<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
    <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNGgtMnYyaDJ2LTJ6bTAgNmgtMnYyaDJ2LTJ6bTAtMTRoLTJ2Mmgydi0yem0wIDRoLTJ2Mmgydi0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>

    <nav class="relative z-10 border-b border-white/10 backdrop-blur-lg bg-white/5">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Rocket class="w-6 h-6 text-white" />
          </div>
          <h1 class="text-2xl font-bold text-white">DeployHub</h1>
        </div>
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/login"
            class="px-4 py-2 text-sm font-medium text-white hover:text-blue-300 transition"
          >
            Sign in
          </NuxtLink>
          <NuxtLink
            to="/signup"
            class="px-6 py-2.5 text-sm font-medium bg-white text-slate-900 rounded-lg hover:bg-blue-50 transition shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Get started
          </NuxtLink>
        </div>
      </div>
    </nav>

    <div class="relative z-10 max-w-7xl mx-auto px-6 py-24">
      <div class="text-center space-y-8 animate-fade-in">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-sm text-blue-300 mb-6">
          <Sparkles class="w-4 h-4" />
          <span>The modern deployment platform</span>
        </div>

        <h1 class="text-7xl font-bold text-white leading-tight">
          Deploy with
          <span class="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-glow">
            confidence
          </span>
        </h1>

        <p class="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
          Build, deploy, and scale your applications instantly. The platform that developers love and enterprises trust.
        </p>

        <div class="flex items-center justify-center gap-4 pt-8">
          <NuxtLink
            to="/signup"
            class="group relative px-8 py-4 text-base font-medium bg-white text-slate-900 rounded-xl hover:bg-blue-50 transition shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105"
          >
            <span class="flex items-center gap-2">
              Start deploying
              <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition" />
            </span>
          </NuxtLink>
          <button class="px-8 py-4 text-base font-medium border-2 border-white/20 text-white rounded-xl hover:bg-white/10 backdrop-blur-lg transition">
            View demo
          </button>
        </div>

        <div class="flex items-center justify-center gap-8 pt-8 text-blue-200 text-sm">
          <div class="flex items-center gap-2">
            <Zap class="w-4 h-4" />
            <span>Lightning fast</span>
          </div>
          <div class="flex items-center gap-2">
            <Shield class="w-4 h-4" />
            <span>Enterprise security</span>
          </div>
          <div class="flex items-center gap-2">
            <Globe class="w-4 h-4" />
            <span>Global CDN</span>
          </div>
        </div>
      </div>

      <div class="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition hover-lift">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition rounded-2xl"></div>
          <div class="relative">
            <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-blue-500/50 transition">
              <Zap class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-white mb-3">Lightning Fast</h3>
            <p class="text-blue-200 leading-relaxed">Deploy in seconds with optimized build pipelines and global edge network for instant loading.</p>
          </div>
        </div>

        <div class="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition hover-lift">
          <div class="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent opacity-0 group-hover:opacity-100 transition rounded-2xl"></div>
          <div class="relative">
            <div class="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-green-500/50 transition">
              <Shield class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-white mb-3">Enterprise Security</h3>
            <p class="text-blue-200 leading-relaxed">Built-in security features with automatic SSL, DDoS protection, and enterprise compliance.</p>
          </div>
        </div>

        <div class="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition hover-lift">
          <div class="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition rounded-2xl"></div>
          <div class="relative">
            <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-purple-500/50 transition">
              <Settings class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-xl font-semibold text-white mb-3">Easy Customization</h3>
            <p class="text-blue-200 leading-relaxed">Flexible configuration with environment variables, custom domains, and advanced build settings.</p>
          </div>
        </div>
      </div>

      <div class="mt-32 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-sm text-blue-300 mb-6">
          <TrendingUp class="w-4 h-4" />
          <span>Trusted by thousands of developers</span>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
          <div class="text-center">
            <div class="text-4xl font-bold text-white mb-2">10K+</div>
            <div class="text-blue-300 text-sm">Projects Deployed</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-white mb-2">99.9%</div>
            <div class="text-blue-300 text-sm">Uptime</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-white mb-2">50ms</div>
            <div class="text-blue-300 text-sm">Avg Response</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-white mb-2">24/7</div>
            <div class="text-blue-300 text-sm">Support</div>
          </div>
        </div>
      </div>
    </div>

    <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
  </div>
</template>

<script setup lang="ts">
import { Rocket, Sparkles, ArrowRight, Zap, Shield, Globe, Settings, TrendingUp } from 'lucide-vue-next'

definePageMeta({
  layout: false
})
</script>
