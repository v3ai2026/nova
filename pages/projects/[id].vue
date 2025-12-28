<template>
  <div>
    <div class="mb-8">
      <NuxtLink
        to="/projects"
        class="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white mb-4 transition-colors"
      >
        <ArrowLeft class="w-4 h-4" />
        Back to Projects
      </NuxtLink>
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">{{ project?.name || 'Loading...' }}</h1>
          <p class="text-slate-300">{{ project?.description || '' }}</p>
        </div>
        <div class="flex items-center gap-3">
          <Badge :variant="statusVariant">
            {{ project?.status || 'loading' }}
          </Badge>
          <Button :iconLeft="Rocket" @click="handleDeploy">
            Deploy Now
          </Button>
          <Button variant="ghost" :iconLeft="Settings" @click="handleSettings">
            Settings
          </Button>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <Tabs :tabs="tabs" @change="handleTabChange">
      <template #tab-0>
        <!-- Deployments Tab -->
        <div class="space-y-6">
          <Card>
            <template #header>
              <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Latest Deployment</h2>
            </template>
            <DeploymentStatus :deployment="latestDeployment" />
          </Card>

          <Card>
            <template #header>
              <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Deployment History</h2>
            </template>
            <Table :columns="deploymentColumns" :data="deployments">
              <template #cell-status="{ value }">
                <Badge :variant="getStatusVariant(value)">
                  {{ value }}
                </Badge>
              </template>
              <template #cell-created_at="{ value }">
                {{ formatDate(value, 'short') }}
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
        </div>
      </template>

      <template #tab-1>
        <!-- Blockchain Tab -->
        <div class="space-y-6">
          <!-- Wallet Connection -->
          <Card>
            <template #header>
              <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Blockchain Integration</h2>
            </template>
            <WalletConnect />
          </Card>

          <!-- Chain Records -->
          <ChainRecords :projectId="projectId" />
        </div>
      </template>

      <template #tab-2>
        <!-- Activity Tab -->
        <ActivityFeed />
      </template>

      <template #tab-3>
        <!-- Settings Tab -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <template #header>
              <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Project Info</h2>
            </template>
            <div class="space-y-4">
              <div>
                <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
                <p class="mt-1 text-slate-900 dark:text-white">{{ project?.name }}</p>
              </div>
              <div v-if="project?.repositoryUrl">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Repository</label>
                <p class="mt-1">
                  <a
                    :href="project.repositoryUrl"
                    target="_blank"
                    class="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {{ project.repositoryUrl }}
                  </a>
                </p>
              </div>
              <div>
                <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Created</label>
                <p class="mt-1 text-slate-900 dark:text-white">{{ formatDate(project?.createdAt || '', 'long') }}</p>
              </div>
            </div>
          </Card>

          <Card>
            <template #header>
              <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Danger Zone</h2>
            </template>
            <div class="space-y-4">
              <div>
                <h3 class="font-medium text-slate-900 dark:text-white mb-2">Pause Project</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Temporarily pause deployments for this project.
                </p>
                <Button variant="warning" size="sm">Pause Project</Button>
              </div>
              <div class="pt-4 border-t border-slate-200 dark:border-slate-800">
                <h3 class="font-medium text-red-600 dark:text-red-400 mb-2">Delete Project</h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Permanently delete this project and all its deployments.
                </p>
                <Button variant="danger" size="sm">Delete Project</Button>
              </div>
            </div>
          </Card>
        </div>
      </template>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Rocket, Settings, Eye, Activity as ActivityIcon, Cog, Shield } from 'lucide-vue-next'
import { formatDate } from '~/utils/formatting'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const route = useRoute()
const projectId = route.params.id as string

const { currentProject: project, fetchProject } = useProjects()
const { deployments, fetchDeployments } = useDeployments()
const { success } = useNotification()

const tabs = [
  { label: 'Deployments', icon: Rocket },
  { label: 'Blockchain', icon: Shield },
  { label: 'Activity', icon: ActivityIcon },
  { label: 'Settings', icon: Cog }
]

const deploymentColumns = [
  { key: 'commitSha', label: 'Commit' },
  { key: 'status', label: 'Status' },
  { key: 'commitMessage', label: 'Message' },
  { key: 'createdAt', label: 'Date' },
  { key: 'actions', label: '' }
]

const latestDeployment = computed(() => deployments.value[0])

const statusVariant = computed(() => {
  const variants: Record<string, any> = {
    active: 'success',
    paused: 'warning',
    error: 'error'
  }
  return variants[project.value?.status] || 'default'
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

const handleTabChange = (index: number) => {
  console.log('Tab changed to:', index)
}

const handleDeploy = () => {
  success('Deployment started', 'Your project is being deployed...')
}

const handleSettings = () => {
  navigateTo(`/projects/${projectId}/settings`)
}

const viewDeployment = (deployment: any) => {
  navigateTo(`/projects/${projectId}/deployments/${deployment.id}`)
}

onMounted(async () => {
  await Promise.all([
    fetchProject(projectId),
    fetchDeployments(projectId)
  ])
})
</script>
