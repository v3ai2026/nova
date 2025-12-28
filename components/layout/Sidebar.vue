<template>
  <aside class="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full">
    <!-- Logo -->
    <div class="p-6 border-b border-slate-200 dark:border-slate-800">
      <NuxtLink to="/dashboard" class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
          <Rocket class="w-5 h-5 text-white" />
        </div>
        <h1 class="text-xl font-bold text-slate-900 dark:text-white">DeployHub</h1>
      </NuxtLink>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
      <NuxtLink
        v-for="item in navigation"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition group"
        :class="isActive(item.path)
          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'"
      >
        <component :is="item.icon" class="w-5 h-5" />
        {{ item.name }}
        <Badge v-if="item.badge" variant="info" class="ml-auto">{{ item.badge }}</Badge>
      </NuxtLink>
    </nav>

    <!-- Footer slot -->
    <div class="p-4 border-t border-slate-200 dark:border-slate-800">
      <slot name="footer" />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { LayoutDashboard, FolderGit2, Rocket, Users, Settings, Key, Activity, Package } from 'lucide-vue-next'

const route = useRoute()

const navigation = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', path: '/projects', icon: FolderGit2 },
  { name: 'Deployments', path: '/deployments', icon: Rocket },
  { name: 'Activity', path: '/activity', icon: Activity },
  { name: '3D 产品', path: '/products/3d-viewer', icon: Package },
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
</script>
