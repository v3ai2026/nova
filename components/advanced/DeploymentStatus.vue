<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <component :is="statusIcon" :class="statusClasses" class="w-6 h-6" />
        <div>
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
            {{ statusText }}
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            {{ deployment.commit_message || 'No commit message' }}
          </p>
        </div>
      </div>
      <Badge :variant="statusVariant">
        {{ deployment.status }}
      </Badge>
    </div>

    <div v-if="showProgress" class="space-y-2">
      <div class="flex items-center justify-between text-sm">
        <span class="text-slate-600 dark:text-slate-400">{{ progressText }}</span>
        <span class="font-medium text-slate-900 dark:text-white">{{ progress }}%</span>
      </div>
      <div class="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          class="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-500 rounded-full"
          :style="{ width: `${progress}%` }"
          :class="{ 'animate-pulse': isBuilding }"
        />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 text-sm">
      <div>
        <p class="text-slate-500 dark:text-slate-400">Commit</p>
        <p class="font-mono text-slate-900 dark:text-white mt-1">
          {{ deployment.commit_hash?.substring(0, 7) || 'N/A' }}
        </p>
      </div>
      <div>
        <p class="text-slate-500 dark:text-slate-400">Started</p>
        <p class="text-slate-900 dark:text-white mt-1">
          {{ formatDate(deployment.created_at, 'relative') }}
        </p>
      </div>
    </div>

    <div v-if="deployment.deployed_url" class="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
      <ExternalLink class="w-4 h-4 text-slate-600 dark:text-slate-400" />
      <a
        :href="deployment.deployed_url"
        target="_blank"
        class="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate"
      >
        {{ deployment.deployed_url }}
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Clock, Loader2, CheckCircle, XCircle, ExternalLink } from 'lucide-vue-next'
import { formatDate } from '~/utils/formatting'
import type { Deployment } from '~/types'

interface Props {
  deployment: Deployment
}

const props = defineProps<Props>()

const statusIcon = computed(() => {
  const icons: Record<string, any> = {
    pending: Clock,
    building: Loader2,
    success: CheckCircle,
    failed: XCircle
  }
  return icons[props.deployment.status] || Clock
})

const statusClasses = computed(() => {
  const classes: Record<string, string> = {
    pending: 'text-yellow-600 dark:text-yellow-400',
    building: 'text-blue-600 dark:text-blue-400 animate-spin',
    success: 'text-green-600 dark:text-green-400',
    failed: 'text-red-600 dark:text-red-400'
  }
  return classes[props.deployment.status] || ''
})

const statusVariant = computed(() => {
  const variants: Record<string, any> = {
    pending: 'warning',
    building: 'info',
    success: 'success',
    failed: 'error'
  }
  return variants[props.deployment.status] || 'default'
})

const statusText = computed(() => {
  const texts: Record<string, string> = {
    pending: 'Deployment Pending',
    building: 'Building...',
    success: 'Deployment Successful',
    failed: 'Deployment Failed'
  }
  return texts[props.deployment.status] || 'Unknown Status'
})

const showProgress = computed(() => {
  return props.deployment.status === 'pending' || props.deployment.status === 'building'
})

const isBuilding = computed(() => {
  return props.deployment.status === 'building'
})

const progress = ref(0)
const progressText = computed(() => {
  if (progress.value < 30) return 'Preparing environment...'
  if (progress.value < 60) return 'Installing dependencies...'
  if (progress.value < 90) return 'Building application...'
  return 'Finalizing deployment...'
})

// Simulate progress for building deployments
watchEffect(() => {
  if (props.deployment.status === 'building') {
    const interval = setInterval(() => {
      if (progress.value < 95) {
        progress.value += Math.random() * 10
      }
    }, 1000)
    
    return () => clearInterval(interval)
  } else if (props.deployment.status === 'success') {
    progress.value = 100
  } else if (props.deployment.status === 'pending') {
    progress.value = 0
  }
})
</script>
