<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Deployments</h1>
        <p class="text-slate-300">Track all deployment activities across your projects</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex items-center gap-4 mb-6">
      <div class="flex-1">
        <SearchBar v-model="searchQuery" placeholder="Search deployments..." />
      </div>
      <Dropdown position="right">
        <template #trigger>
          <Button variant="ghost" :iconRight="ChevronDown">
            {{ selectedProject || 'All Projects' }}
          </Button>
        </template>
        <template #default="{ close }">
          <div class="py-1">
            <button
              v-for="project in ['All Projects', 'my-web-app', 'api-service', 'landing-page']"
              :key="project"
              @click="filterByProject(project, close)"
              class="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {{ project }}
            </button>
          </div>
        </template>
      </Dropdown>
      <Dropdown position="right">
        <template #trigger>
          <Button variant="ghost" :iconRight="ChevronDown">
            {{ selectedStatus || 'All Status' }}
          </Button>
        </template>
        <template #default="{ close }">
          <div class="py-1">
            <button
              v-for="status in ['All Status', 'pending', 'building', 'success', 'failed']"
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

    <!-- Deployments Table -->
    <Card v-if="!loading && filteredDeployments.length > 0">
      <Table :columns="columns" :data="paginatedDeployments">
        <template #cell-project_id="{ value }">
          <NuxtLink
            :to="`/projects/${value}`"
            class="font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Project {{ value }}
          </NuxtLink>
        </template>
        <template #cell-status="{ value }">
          <Badge :variant="getStatusVariant(value)">
            {{ value }}
          </Badge>
        </template>
        <template #cell-commit_hash="{ value }">
          <code class="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
            {{ value }}
          </code>
        </template>
        <template #cell-created_at="{ value }">
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

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-6 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
        <div class="text-sm text-slate-600 dark:text-slate-400">
          Showing {{ startIndex + 1 }} to {{ Math.min(endIndex, filteredDeployments.length) }} of {{ filteredDeployments.length }} deployments
        </div>
        <div class="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            Previous
          </Button>
          <div class="flex gap-1">
            <Button
              v-for="page in displayedPages"
              :key="page"
              :variant="page === currentPage ? 'primary' : 'ghost'"
              size="sm"
              @click="currentPage = page"
            >
              {{ page }}
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            Next
          </Button>
        </div>
      </div>
    </Card>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <LoadingSpinner />
    </div>

    <!-- Empty State -->
    <EmptyState
      v-if="!loading && filteredDeployments.length === 0"
      :icon="Rocket"
      title="No deployments found"
      description="Start deploying your projects to see them here"
      actionText="View Projects"
      actionLink="/projects"
    />
  </div>
</template>

<script setup lang="ts">
import { Rocket, Eye, ChevronDown } from 'lucide-vue-next'
import { formatDate } from '~/utils/formatting'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { deployments, loading, fetchDeployments } = useDeployments()

const searchQuery = ref('')
const selectedProject = ref('All Projects')
const selectedStatus = ref('All Status')
const currentPage = ref(1)
const perPage = 10

const columns = [
  { key: 'project_id', label: 'Project' },
  { key: 'status', label: 'Status' },
  { key: 'commit_hash', label: 'Commit' },
  { key: 'commit_message', label: 'Message' },
  { key: 'created_at', label: 'Time' },
  { key: 'actions', label: '' }
]

const filteredDeployments = computed(() => {
  let filtered = [...deployments.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(d =>
      d.commit_message?.toLowerCase().includes(query) ||
      d.commit_hash?.toLowerCase().includes(query)
    )
  }

  if (selectedProject.value !== 'All Projects') {
    filtered = filtered.filter(d => d.project_id === selectedProject.value)
  }

  if (selectedStatus.value !== 'All Status') {
    filtered = filtered.filter(d => d.status === selectedStatus.value)
  }

  return filtered.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
})

const totalPages = computed(() => Math.ceil(filteredDeployments.value.length / perPage))
const startIndex = computed(() => (currentPage.value - 1) * perPage)
const endIndex = computed(() => startIndex.value + perPage)

const paginatedDeployments = computed(() => 
  filteredDeployments.value.slice(startIndex.value, endIndex.value)
)

const displayedPages = computed(() => {
  const pages: number[] = []
  const maxPages = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxPages / 2))
  let end = Math.min(totalPages.value, start + maxPages - 1)
  
  if (end - start + 1 < maxPages) {
    start = Math.max(1, end - maxPages + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const getStatusVariant = (status: string) => {
  const variants: Record<string, any> = {
    success: 'success',
    building: 'info',
    pending: 'warning',
    failed: 'error'
  }
  return variants[status] || 'default'
}

const filterByProject = (project: string, close: () => void) => {
  selectedProject.value = project
  currentPage.value = 1
  close()
}

const filterByStatus = (status: string, close: () => void) => {
  selectedStatus.value = status
  currentPage.value = 1
  close()
}

const viewDeployment = (deployment: any) => {
  navigateTo(`/projects/${deployment.project_id}/deployments/${deployment.id}`)
}

// Fetch deployments on mount
onMounted(() => {
  fetchDeployments()
})
</script>
