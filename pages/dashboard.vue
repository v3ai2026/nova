<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">Dashboard</h1>
      <p class="text-slate-300">Welcome back! Here's what's happening with your projects.</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Total Projects"
        :value="stats.totalProjects"
        :icon="FolderGit2"
        iconColor="blue"
        :trend="12.5"
      />
      <StatsCard
        title="Active Deployments"
        :value="stats.activeDeployments"
        :icon="Rocket"
        iconColor="green"
        :trend="8.2"
      />
      <StatsCard
        title="Success Rate"
        :value="stats.successRate"
        :icon="TrendingUp"
        iconColor="purple"
        format="percentage"
        :trend="3.1"
      />
      <StatsCard
        title="Total Deploys"
        :value="stats.totalDeploys"
        :icon="Activity"
        iconColor="orange"
        :trend="-2.4"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Recent Deployments -->
      <div class="lg:col-span-2">
        <Card>
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold text-slate-900 dark:text-white">Recent Deployments</h2>
              <NuxtLink to="/deployments">
                <Button variant="ghost" size="sm">View All</Button>
              </NuxtLink>
            </div>
          </template>
          <Table :columns="deploymentColumns" :data="recentDeployments">
            <template #cell-status="{ value }">
              <Badge :variant="getStatusVariant(value)">
                {{ value }}
              </Badge>
            </template>
            <template #cell-created_at="{ value }">
              <span class="text-sm text-slate-600 dark:text-slate-400">
                {{ formatDate(value, 'relative') }}
              </span>
            </template>
            <template #cell-actions="{ row }">
              <div class="flex items-center gap-2">
                <Tooltip text="View Details">
                  <Button
                    variant="ghost"
                    size="sm"
                    :iconLeft="Eye"
                    @click="viewDeployment(row)"
                  />
                </Tooltip>
              </div>
            </template>
          </Table>
        </Card>
      </div>

      <!-- Activity Feed -->
      <div>
        <ActivityFeed />
      </div>
    </div>

    <!-- Quick Actions -->
    <Card>
      <template #header>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white">Quick Actions</h2>
      </template>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NuxtLink to="/projects/new">
          <button
            class="w-full p-6 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group"
          >
            <Plus class="w-8 h-8 text-slate-400 group-hover:text-blue-500 mx-auto mb-3" />
            <h3 class="font-semibold text-slate-900 dark:text-white mb-1">New Project</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">Create a new project</p>
          </button>
        </NuxtLink>
        <NuxtLink to="/settings/tokens">
          <button
            class="w-full p-6 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all group"
          >
            <Key class="w-8 h-8 text-slate-400 group-hover:text-purple-500 mx-auto mb-3" />
            <h3 class="font-semibold text-slate-900 dark:text-white mb-1">API Tokens</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">Manage your tokens</p>
          </button>
        </NuxtLink>
        <NuxtLink to="/team">
          <button
            class="w-full p-6 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all group"
          >
            <Users class="w-8 h-8 text-slate-400 group-hover:text-green-500 mx-auto mb-3" />
            <h3 class="font-semibold text-slate-900 dark:text-white mb-1">Invite Team</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">Add team members</p>
          </button>
        </NuxtLink>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { FolderGit2, Rocket, TrendingUp, Activity, Plus, Key, Users, Eye } from 'lucide-vue-next'
import { formatDate } from '~/utils/formatting'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const stats = ref({
  totalProjects: 24,
  activeDeployments: 8,
  successRate: 98.5,
  totalDeploys: 342
})

const deploymentColumns = [
  { key: 'project', label: 'Project' },
  { key: 'status', label: 'Status' },
  { key: 'commit_message', label: 'Commit' },
  { key: 'created_at', label: 'Time' },
  { key: 'actions', label: '' }
]

const recentDeployments = ref([
  {
    id: '1',
    project: 'my-web-app',
    status: 'success',
    commit_message: 'Fix login bug',
    created_at: new Date(Date.now() - 300000).toISOString()
  },
  {
    id: '2',
    project: 'api-service',
    status: 'building',
    commit_message: 'Add new endpoints',
    created_at: new Date(Date.now() - 600000).toISOString()
  },
  {
    id: '3',
    project: 'landing-page',
    status: 'success',
    commit_message: 'Update hero section',
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '4',
    project: 'admin-dashboard',
    status: 'failed',
    commit_message: 'Add analytics',
    created_at: new Date(Date.now() - 7200000).toISOString()
  }
])

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
  navigateTo(`/projects/${deployment.project}/deployments/${deployment.id}`)
}
</script>
