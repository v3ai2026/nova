<template>
  <Dropdown position="right">
    <template #trigger="{ isOpen }">
      <button
        class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
          <span class="text-sm font-medium text-white">
            {{ userInitial }}
          </span>
        </div>
        <div class="hidden md:block text-left">
          <p class="text-sm font-medium text-slate-900 dark:text-white">
            {{ user?.user_metadata?.full_name || 'User' }}
          </p>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            {{ user?.email }}
          </p>
        </div>
        <ChevronDown class="w-4 h-4 text-slate-400" />
      </button>
    </template>
    <template #default="{ close }">
      <div class="py-1">
        <NuxtLink
          to="/settings/profile"
          @click="close"
          class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <User class="w-4 h-4" />
          Profile
        </NuxtLink>
        <NuxtLink
          to="/settings"
          @click="close"
          class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <Settings class="w-4 h-4" />
          Settings
        </NuxtLink>
        <NuxtLink
          to="/settings/tokens"
          @click="close"
          class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <Key class="w-4 h-4" />
          API Tokens
        </NuxtLink>
        <div class="border-t border-slate-200 dark:border-slate-800 my-1" />
        <button
          @click="handleSignOut"
          class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <LogOut class="w-4 h-4" />
          Sign out
        </button>
      </div>
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
import { User, Settings, Key, LogOut, ChevronDown } from 'lucide-vue-next'

const { user, signOut } = useAuth()

const userInitial = computed(() => {
  const name = user.value?.user_metadata?.full_name
  return name ? name.charAt(0).toUpperCase() : 'U'
})

const handleSignOut = async () => {
  await signOut()
}
</script>
