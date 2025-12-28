<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Projects</h1>
        <p class="text-slate-300">Manage and deploy your projects</p>
      </div>
      <Button :iconLeft="Plus" @click="createProject">
        New Project
      </Button>
    </div>

    <!-- Search and Filter -->
    <div class="flex items-center gap-4 mb-6">
      <div class="flex-1">
        <SearchBar v-model="searchQuery" placeholder="Search projects..." />
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
              v-for="status in ['All', 'Active', 'Paused', 'Error']"
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

    <!-- Projects Grid -->
    <div v-if="filteredProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProjectCard
        v-for="project in filteredProjects"
        :key="project.id"
        :project="project"
        @deploy="handleDeploy"
        @settings="handleSettings"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <!-- Empty State -->
    <div v-else>
      <EmptyState
        :icon="FolderGit2"
        title="No projects found"
        description="Get started by creating your first project"
        actionText="Create Project"
        actionLink="/projects/new"
        :actionIcon="Plus"
      />
    </div>

    <!-- Delete Confirmation Modal -->
    <Modal :isOpen="deleteModal.isOpen" @close="deleteModal.isOpen = false">
      <template #header>
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Delete Project</h3>
      </template>
      <p class="text-slate-600 dark:text-slate-400">
        Are you sure you want to delete <strong>{{ deleteModal.project?.name }}</strong>?
        This action cannot be undone.
      </p>
      <template #footer>
        <div class="flex justify-end gap-3">
          <Button variant="ghost" @click="deleteModal.isOpen = false">
            Cancel
          </Button>
          <Button variant="danger" @click="confirmDelete">
            Delete
          </Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { Plus, FolderGit2, ChevronDown } from 'lucide-vue-next'
import type { Project } from '~/types'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { projects, fetchProjects, deleteProject } = useProjects()
const { success, error: errorNotif } = useNotification()

const searchQuery = ref('')
const selectedStatus = ref('All')

// Fetch projects on mount
onMounted(() => {
  fetchProjects()
})

const filteredProjects = computed(() => {
  let filtered = [...projects.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description?.toLowerCase().includes(query)
    )
  }

  if (selectedStatus.value !== 'All') {
    filtered = filtered.filter(p => p.status === selectedStatus.value.toLowerCase())
  }

  return filtered
})

const deleteModal = ref({
  isOpen: false,
  project: null as Project | null
})

const createProject = () => {
  navigateTo('/projects/new')
}

const filterByStatus = (status: string, close: () => void) => {
  selectedStatus.value = status
  close()
}

const handleDeploy = (project: Project) => {
  success('Deployment started', `Deploying ${project.name}...`)
  navigateTo(`/projects/${project.id}`)
}

const handleSettings = (project: Project) => {
  navigateTo(`/projects/${project.id}/settings`)
}

const handleEdit = (project: Project) => {
  navigateTo(`/projects/${project.id}/edit`)
}

const handleDelete = (project: Project) => {
  deleteModal.value.project = project
  deleteModal.value.isOpen = true
}

const confirmDelete = async () => {
  if (deleteModal.value.project) {
    const result = await deleteProject(deleteModal.value.project.id)
    if (result) {
      success('Project deleted', `${deleteModal.value.project.name} has been deleted`)
    } else {
      errorNotif('Delete failed', 'Failed to delete project')
    }
  }
  deleteModal.value.isOpen = false
  deleteModal.value.project = null
}
</script>
