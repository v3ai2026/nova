<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">All Deployments</h1>
        <p class="text-slate-300">View and manage all deployments across projects</p>
      </div>
    </div>

    <div class="flex items-center gap-4 mb-6">
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
              class="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800"
            >
              {{ status }}
            </button>
          </div>
        </template>
      </Dropdown>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>

    <div v-else-if="filteredDeployments.length > 0" class="space-y-4">
      <Card
        v-for="deployment in filteredDeployments"
        :key="deployment.id"
        hover
        class="cursor-pointer"
        @click="navigateTo(`/projects/${deployment.project?.id || deployment.project_id}/deployments/${deployment.id}`)"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-lg font-semibold text-white">
                {{ deployment.project?.name || 'Project' }}
              </h3>
              <Badge :variant="getStatusVariant(deployment.status)">
                {{ deployment.status }}
              </Badge>
            </div>
            <p v-if="deployment.commit_message" class="text-sm text-slate-400 mb-2">
              {{ deployment.commit_message }}
            </p>
            <div class="flex items-center gap-4 text-xs text-slate-500">
              <span>{{ formatDate(deployment.created_at) }}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <EmptyState
      v-else
      :icon="Rocket"
      title="No deployments found"
      description="Deploy your first project to see deployments here"
      actionText="Go to Projects"
      actionLink="/projects"
    />
  </div>
</template>

<script setup lang="ts">
import { Rocket, ChevronDown } from 'lucide-vue-next'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { fetchDeployments, deployments, loading } = useDeployments()
const searchQuery = ref('')
const selectedStatus = ref('All')

const filteredDeployments = computed(() => {
  let filtered = deployments.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(d =>
      d.project?.name?.toLowerCase().includes(query) ||
      d.commit_message?.toLowerCase().includes(query)
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
  const variants = { success: 'success', failed: 'danger', building: 'warning', pending: 'default' }
  return variants[status] || 'default'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

onMounted(() => {
  fetchDeployments()
})
</script>