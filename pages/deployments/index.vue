<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">All Deployments</h1>
      <p class="text-slate-300">View and manage all deployments across projects</p>
    </div>

    <!-- Filters -->
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
              v-for="status in ['All', 'pending', 'building', 'success', 'failed']"
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

    <!-- Deployments List -->
    <Card v-if="!loading && filteredDeployments.length > 0">
      <Table :columns="columns" :data="filteredDeployments">
        <template #cell-project="{ row }">
          <NuxtLink
            :to="`/projects/${row.projectId}`"
            class="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {{ row.project?.name || 'Unknown' }}
          </NuxtLink>
        </template>
        
        <template #cell-status="{ value }">
          <Badge :variant="getStatusVariant(value)">
            {{ value }}
          </Badge>
        </template>

        <template #cell-commitSha="{ value }">
          <code class="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">
            {{ value ? value.substring(0, 7) : 'N/A' }}
          </code>
        </template>

        <template #cell-chainTxHash="{ value }">
          <span v-if="value">
            <Badge variant="success" class="flex items-center gap-1">
              <Shield class="w-3 h-3" />
              On-chain
            </Badge>
          </span>
          <span v-else class="text-slate-400 text-sm">-</span>
        </template>

        <template #cell-createdAt="{ value }">
          <span class="text-sm text-slate-600 dark:text-slate-400">
            {{ formatDate(value, 'relative') }}
          </span>
        </template>

        <template #cell-actions="{ row }">
          <Button
            variant="ghost"
            size="sm"
            :iconLeft="Eye"
            @click="viewDeployment(row)"
          >
            View
          </Button>
        </template>
      </Table>
    </Card>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <LoadingSpinner />
    </div>

    <!-- Empty State -->
    <div v-if="!loading && filteredDeployments.length === 0">
      <EmptyState
        :icon="Rocket"
        title="No deployments found"
        description="No deployments match your search criteria"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Rocket, Eye, ChevronDown, Shield } from 'lucide-vue-next'
import { formatDate } from '~/utils/formatting'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { deployments, loading, fetchDeployments } = useDeployments()

const searchQuery = ref('')
const selectedStatus = ref('All')

const columns = [
  { key: 'project', label: 'Project' },
  { key: 'status', label: 'Status' },
  { key: 'commitSha', label: 'Commit' },
  { key: 'commitMessage', label: 'Message' },
  { key: 'chainTxHash', label: 'Blockchain' },
  { key: 'createdAt', label: 'Time' },
  { key: 'actions', label: '' }
]

const filteredDeployments = computed(() => {
  let filtered = deployments.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(d =>
      d.project?.name?.toLowerCase().includes(query) ||
      d.commitMessage?.toLowerCase().includes(query) ||
      d.commitSha?.toLowerCase().includes(query)
    )
  }

  if (selectedStatus.value !== 'All') {
    filtered = filtered.filter(d => d.status === selectedStatus.value)
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

const viewDeployment = (deployment: any) => {
  navigateTo(`/projects/${deployment.projectId}/deployments/${deployment.id}`)
}

onMounted(() => {
  fetchDeployments()
})
</script>
