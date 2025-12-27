<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
    <div class="flex h-screen">
      <aside class="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div class="p-6 border-b border-slate-200 dark:border-slate-800">
          <h1 class="text-xl font-bold text-slate-900 dark:text-white">DeployHub</h1>
        </div>

        <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
          <NuxtLink
            v-for="item in navigation"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition"
            :class="isActive(item.path)
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'"
          >
            <component :is="item.icon" class="w-5 h-5" />
            {{ item.name }}
          </NuxtLink>
        </nav>

        <div class="p-4 border-t border-slate-200 dark:border-slate-800">
          <div class="flex items-center gap-3 px-4 py-2.5">
            <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
              <span class="text-sm font-medium text-slate-900 dark:text-white">
                {{ userInitial }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-900 dark:text-white truncate">
                {{ profile?.full_name || 'User' }}
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400 truncate">
                {{ profile?.email }}
              </p>
            </div>
          </div>
          <button
            @click="handleSignOut"
            class="w-full mt-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LayoutDashboard, FolderGit2, Rocket, Users, Settings, Key } from 'lucide-vue-next'

const route = useRoute()
const { profile, signOut } = useAuth()

const navigation = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', path: '/projects', icon: FolderGit2 },
  { name: 'Deployments', path: '/deployments', icon: Rocket },
  { name: 'Team', path: '/team', icon: Users },
  { name: 'API Tokens', path: '/settings/tokens', icon: Key },
  { name: 'Settings', path: '/settings', icon: Settings }
]

const isActive = (path: string) => {
  if (path === '/dashboard') {
    return route.path === path
  }
  return route.path.startsWith(path)
}

const userInitial = computed(() => {
  return profile.value?.full_name?.charAt(0).toUpperCase() || 'U'
})

const handleSignOut = async () => {
  await signOut()
}
</script>
