<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">Settings</h1>
      <p class="text-slate-300">Manage your account settings and preferences</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card hover class="cursor-pointer" @click="navigateTo('/settings/profile')">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <User class="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 class="font-semibold text-white">Profile</h3>
            <p class="text-sm text-slate-400">Manage your personal information</p>
          </div>
        </div>
      </Card>

      <Card hover class="cursor-pointer" @click="navigateTo('/settings/tokens')">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Key class="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h3 class="font-semibold text-white">API Tokens</h3>
            <p class="text-sm text-slate-400">Manage API access tokens</p>
          </div>
        </div>
      </Card>

      <Card hover class="cursor-pointer">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
            <Settings class="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h3 class="font-semibold text-white">Preferences</h3>
            <p class="text-sm text-slate-400">Configure your preferences</p>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, Key, Settings } from 'lucide-vue-next'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})
</script>
