<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">Activity Feed</h1>
      <p class="text-slate-300">Recent activity across your projects</p>
    </div>

    <div class="mb-6">
      <Dropdown position="right">
        <template #trigger>
          <Button variant="ghost" :iconRight="ChevronDown">
            {{ selectedFilter }}
          </Button>
        </template>
        <template #default="{ close }">
          <div class="py-1">
            <button
              v-for="filter in ['All Activity', 'Deployments', 'Projects', 'Teams']"
              :key="filter"
              @click="() => { selectedFilter = filter; close() }"
              class="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800"
            >
              {{ filter }}
            </button>
          </div>
        </template>
      </Dropdown>
    </div>

    <ActivityFeed />
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const selectedFilter = ref('All Activity')
</script>
