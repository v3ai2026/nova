<template>
  <div>
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">Deployments</h1>
          <p class="text-slate-300">View and manage all deployments across projects</p>
        </div>
        <Button :iconLeft="Plus" @click="$router.push('/projects')">
          New Deployment
        </Button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total Deployments"
        :value="stats.total"
        :icon="Rocket"
        iconColor="blue"
      />
      <StatsCard
        title="Successful"
        :value="stats.successful"
        :icon="CheckCircle"
        iconColor="green"
      />
      <StatsCard
        title="Failed"
        :value="stats.failed"
        :icon="XCircle"
        iconColor="red"
      />
      <StatsCard
        title="In Progress"
        :value="stats.inProgress"
        :icon="Clock"
        iconColor="orange"
      />
    </div>

    <!-- Filters -->
    <Card class="mb-6">
      <div class="flex items-center gap-4">
        <div class="flex-1">
          <SearchBar v-model="searchQuery" placeholder="Search deployments..." />
        </div>
        <Dropdown position="right">
          <template #trigger>
            <Button variant="ghost" :iconRight="ChevronDown">
              {{ selectedStatus || 'All Status' }}
            </Button>
          </template>
          <template #default="{ close }">
            <div class="py-1">
              <button
                v-for="status in ['All', 'Pending', 'Building', 'Success', 'Failed']"
                :key="status"
                @click="filterByStatus(status, close)"
                class="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {{ status }}
              </button>
            </div>
          </template>
        </Dropdown>
      </div>
    </Card>

    <!-- Deployments List -->
    <Card v-if="loading" class="text-center py-8">
      <LoadingSpinner />
    </Card>

    <Card v-else-if="filteredDeployments.length === 0">
      <EmptyState
        :icon="Rocket"
        title="No deployments found"
        description="Start deploying your projects to see them here"
        actionText="Go to Projects"
        actionLink="/projects"
        :actionIcon="FolderGit2"
      />
    </Card>

    <div v-else class="space-y-4">
      <Card
        v-for="deployment in filteredDeployments"
        :key="deployment.id"
        hover
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4 flex-1">
            <div 
              class="w-12 h-12 rounded-lg flex items-center justify-center"
              :class="getStatusColor(deployment.status)"
            >
              <component 
                :is="getStatusIcon(deployment.status)" 
                class="w-6 h-6"
              />
            </div>
            
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-1">
                <h3 class="font-semibold text-slate-900 dark:text-white">
                  {{ deployment.project?.name || 'Unknown Project' }}
                </h3>
                <Badge :variant="getStatusVariant(deployment.status)">
                  {{ deployment.status }}
                </Badge>
              </div>
              
              <div class="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <span v-if="deployment.commit_hash" class="flex items-center gap-1">
                  <GitCommit class="w-4 h-4" />
                  {{ deployment.commit_hash?.slice(0, 7) }}
                </span>
                <span class="flex items-center gap-1">
                  <Clock class="w-4 h-4" />
                  {{ formatDate(deployment.created_at, 'relative') }}
                </span>
                <span v-if="deployment.completed_at" class="flex items-center gap-1">
                  <Timer class="w-4 h-4" />
                  {{ getDuration(deployment.created_at, deployment.completed_at) }}
                </span>
              </div>
              
              <p v-if="deployment.commit_message" class="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {{ deployment.commit_message }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <Tooltip text="View Details">
              <Button
                variant="ghost"
                size="sm"
                :iconLeft="Eye"
                @click="viewDeployment(deployment)"
              />
            </Tooltip>
            <Tooltip text="View Project">
              <Button
                variant="ghost"
                size="sm"
                :iconLeft="FolderGit2"
                @click="viewProject(deployment)"
              />
            </Tooltip>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Rocket, CheckCircle, XCircle, Clock, Plus, ChevronDown, 
  Eye, FolderGit2, GitCommit, Timer 
} from 'lucide-vue-next'
import { formatDate } from '~/utils/formatting'
import type { Deployment } from '~/types'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { deployments, loading, fetchDeployments } = useDeployments()

const searchQuery = ref('')
const selectedStatus = ref('All')

const stats = computed(() => {
  const total = deployments.value.length
  const successful = deployments.value.filter(d => d.status === 'success').length
  const failed = deployments.value.filter(d => d.status === 'failed').length
  const inProgress = deployments.value.filter(d => 
    d.status === 'pending' || d.status === 'building'
  ).length

  return { total, successful, failed, inProgress }
})

const filteredDeployments = computed(() => {
  let filtered = deployments.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(d =>
      d.project?.name?.toLowerCase().includes(query) ||
      d.commit_message?.toLowerCase().includes(query) ||
      d.commit_hash?.toLowerCase().includes(query)
    )
  }

  if (selectedStatus.value !== 'All') {
    filtered = filtered.filter(d => d.status === selectedStatus.value.toLowerCase())
  }

  return filtered
})

const filterByStatus = (status: string, close: () => void) => {
  selectedStatus.value = status
  close()
}

const getStatusVariant = (status: string) => {
  const variants: Record<string, any> = {
    success: 'success',
    building: 'info',
    pending: 'warning',
    failed: 'error'
  }
  return variants[status] || 'default'
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    success: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    building: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    pending: 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    failed: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
  }
  return colors[status] || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
}

const getStatusIcon = (status: string) => {
  const icons: Record<string, any> = {
    success: CheckCircle,
    building: Clock,
    pending: Clock,
    failed: XCircle
  }
  return icons[status] || Rocket
}

const getDuration = (start: string, end: string) => {
  const diff = new Date(end).getTime() - new Date(start).getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  
  if (minutes === 0) return `${seconds}s`
  return `${minutes}m ${seconds % 60}s`
}

const viewDeployment = (deployment: Deployment) => {
  navigateTo(`/projects/${deployment.project_id}/deployments/${deployment.id}`)
}

const viewProject = (deployment: Deployment) => {
  navigateTo(`/projects/${deployment.project_id}`)
}

onMounted(() => {
  fetchDeployments()
})
</script>
