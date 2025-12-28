<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">Activity Feed</h1>
      <p class="text-slate-300">Track all activities across your projects and deployments</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <Card>
          <template #header>
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h2>
          </template>
          <ActivityFeed />
        </Card>
      </div>

      <div>
        <Card class="mb-6">
          <template #header>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Activity Summary</h3>
          </template>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-600 dark:text-slate-400">Today</span>
              <Badge variant="info">12 events</Badge>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-600 dark:text-slate-400">This Week</span>
              <Badge variant="info">48 events</Badge>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-600 dark:text-slate-400">This Month</span>
              <Badge variant="info">156 events</Badge>
            </div>
          </div>
        </Card>

        <Card>
          <template #header>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Filter</h3>
          </template>
          <div class="space-y-2">
            <label class="flex items-center gap-2">
              <input type="checkbox" checked class="rounded" />
              <span class="text-sm text-slate-700 dark:text-slate-300">Deployments</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" checked class="rounded" />
              <span class="text-sm text-slate-700 dark:text-slate-300">Projects</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" checked class="rounded" />
              <span class="text-sm text-slate-700 dark:text-slate-300">Team</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" checked class="rounded" />
              <span class="text-sm text-slate-700 dark:text-slate-300">Blockchain</span>
            </label>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})
</script>
