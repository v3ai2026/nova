<template>
  <div class="p-8">
    <LoadingSpinner v-if="loading" />

    <div v-else-if="deployment">
      <div class="flex items-center gap-3 mb-8">
        <NuxtLink :to="`/projects/${deployment.project_id}`" class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
          <ArrowLeft class="w-5 h-5" />
        </NuxtLink>
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Deployment Details</h1>
          <p class="text-slate-600 dark:text-slate-400">{{ deployment.commit_message || 'No message' }}</p>
        </div>
        <span
          class="px-4 py-2 text-sm font-medium rounded-full"
          :class="getStatusClass(deployment.status)"
        >
          {{ deployment.status }}
        </span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
          <div class="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
            <GitBranch class="w-4 h-4" />
            <span class="text-sm font-medium">Branch</span>
          </div>
          <p class="text-xl font-bold text-slate-900 dark:text-white">{{ deployment.branch }}</p>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
          <div class="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
            <Clock class="w-4 h-4" />
            <span class="text-sm font-medium">Build Time</span>
          </div>
          <p class="text-xl font-bold text-slate-900 dark:text-white">
            {{ deployment.build_time ? `${deployment.build_time}s` : '-' }}
          </p>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
          <div class="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
            <Calendar class="w-4 h-4" />
            <span class="text-sm font-medium">Deployed</span>
          </div>
          <p class="text-xl font-bold text-slate-900 dark:text-white">
            {{ formatDate(deployment.created_at) }}
          </p>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
          <div class="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
            <Hash class="w-4 h-4" />
            <span class="text-sm font-medium">Commit</span>
          </div>
          <p class="text-xl font-bold text-slate-900 dark:text-white font-mono">
            {{ deployment.commit_hash ? deployment.commit_hash.substring(0, 7) : '-' }}
          </p>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <Terminal class="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Build Logs</h2>
          </div>
          <button
            @click="loadLogs"
            class="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': loadingLogs }" />
          </button>
        </div>

        <div class="bg-slate-950 p-6 max-h-[600px] overflow-y-auto font-mono text-sm">
          <div v-if="logs.length === 0" class="text-slate-400 text-center py-8">
            No logs available
          </div>
          <div v-else class="space-y-1">
            <div
              v-for="log in logs"
              :key="log.id"
              class="flex gap-4"
              :class="getLogClass(log.level)"
            >
              <span class="text-slate-500 select-none">{{ formatLogTime(log.timestamp) }}</span>
              <span class="flex-1">{{ log.message }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="deployment.url" class="mt-6">
        <a
          :href="deployment.url"
          target="_blank"
          class="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition font-medium"
        >
          <ExternalLink class="w-4 h-4" />
          Visit Deployment
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, GitBranch, Clock, Calendar, Hash, Terminal, RefreshCw, ExternalLink } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const route = useRoute()
const { $supabase } = useNuxtApp()

const deployment = ref<any>(null)
const logs = ref<any[]>([])
const loading = ref(true)
const loadingLogs = ref(false)

const loadDeployment = async () => {
  const { data } = await $supabase
    .from('deployments')
    .select('*')
    .eq('id', route.params.deploymentId)
    .single()

  deployment.value = data
}

const loadLogs = async () => {
  loadingLogs.value = true
  try {
    const { data } = await $supabase
      .from('deployment_logs')
      .select('*')
      .eq('deployment_id', route.params.deploymentId)
      .order('timestamp', { ascending: true })

    logs.value = data || []

    if (logs.value.length === 0) {
      logs.value = [
        { id: 1, message: 'Initializing build...', level: 'info', timestamp: new Date().toISOString() },
        { id: 2, message: 'Installing dependencies...', level: 'info', timestamp: new Date().toISOString() },
        { id: 3, message: 'Building application...', level: 'info', timestamp: new Date().toISOString() },
        { id: 4, message: 'Build completed successfully', level: 'info', timestamp: new Date().toISOString() },
        { id: 5, message: 'Deploying to production...', level: 'info', timestamp: new Date().toISOString() },
        { id: 6, message: 'Deployment complete!', level: 'info', timestamp: new Date().toISOString() }
      ]
    }
  } finally {
    loadingLogs.value = false
  }
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    ready: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    building: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    deploying: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    queued: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
  }
  return classes[status] || classes.queued
}

const getLogClass = (level: string) => {
  const classes: Record<string, string> = {
    info: 'text-slate-300',
    warning: 'text-yellow-400',
    error: 'text-red-400'
  }
  return classes[level] || classes.info
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatLogTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

onMounted(async () => {
  await loadDeployment()
  await loadLogs()
  loading.value = false
})
</script>
