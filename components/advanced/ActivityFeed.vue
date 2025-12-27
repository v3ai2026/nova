<template>
  <Card>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
        <Button variant="ghost" size="sm">View All</Button>
      </div>
    </template>

    <div class="space-y-0">
      <div
        v-for="(activity, index) in activities"
        :key="activity.id"
        class="flex gap-4 pb-4"
        :class="{ 'border-b border-slate-200 dark:border-slate-800 mb-4': index < activities.length - 1 }"
      >
        <div class="relative flex flex-col items-center">
          <div :class="activityIconClasses(activity.type)">
            <component :is="activityIcon(activity.type)" class="w-4 h-4 text-white" />
          </div>
          <div
            v-if="index < activities.length - 1"
            class="flex-1 w-px bg-slate-200 dark:bg-slate-800 mt-2"
          />
        </div>

        <div class="flex-1 min-w-0 pt-1">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-900 dark:text-white">
                {{ activity.title }}
              </p>
              <p class="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                {{ activity.description }}
              </p>
              <div class="flex items-center gap-2 mt-2">
                <span class="text-xs text-slate-500 dark:text-slate-400">
                  {{ formatDate(activity.created_at, 'relative') }}
                </span>
                <span v-if="activity.user" class="text-xs text-slate-500 dark:text-slate-400">
                  • by {{ activity.user }}
                </span>
              </div>
            </div>
            <Badge v-if="activity.badge" :variant="activity.badgeVariant">
              {{ activity.badge }}
            </Badge>
          </div>
        </div>
      </div>

      <div v-if="activities.length === 0" class="py-12 text-center">
        <Activity class="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
        <p class="text-slate-600 dark:text-slate-400">No recent activity</p>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Activity, Rocket, GitCommit, User as UserIcon, Settings, AlertCircle } from 'lucide-vue-next'
import { formatDate } from '~/utils/formatting'

interface ActivityItem {
  id: string
  type: 'deployment' | 'commit' | 'user' | 'settings' | 'alert'
  title: string
  description: string
  created_at: string
  user?: string
  badge?: string
  badgeVariant?: 'success' | 'error' | 'warning' | 'info' | 'default'
}

interface Props {
  activities?: ActivityItem[]
}

const props = withDefaults(defineProps<Props>(), {
  activities: () => [
    {
      id: '1',
      type: 'deployment',
      title: 'Deployment completed',
      description: 'my-app deployed to production successfully',
      created_at: new Date(Date.now() - 300000).toISOString(),
      user: 'John Doe',
      badge: 'Success',
      badgeVariant: 'success'
    },
    {
      id: '2',
      type: 'commit',
      title: 'New commit pushed',
      description: 'Fix authentication bug in login flow',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      user: 'Jane Smith'
    },
    {
      id: '3',
      type: 'user',
      title: 'Team member added',
      description: 'Bob Johnson joined the team',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      user: 'Admin'
    },
    {
      id: '4',
      type: 'settings',
      title: 'Environment updated',
      description: 'Production environment variables updated',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      user: 'John Doe'
    }
  ]
})

const activityIcon = (type: string) => {
  const icons: Record<string, any> = {
    deployment: Rocket,
    commit: GitCommit,
    user: UserIcon,
    settings: Settings,
    alert: AlertCircle
  }
  return icons[type] || Activity
}

const activityIconClasses = (type: string) => {
  const base = 'w-8 h-8 rounded-full flex items-center justify-center'
  const colors: Record<string, string> = {
    deployment: 'bg-blue-500',
    commit: 'bg-purple-500',
    user: 'bg-green-500',
    settings: 'bg-orange-500',
    alert: 'bg-red-500'
  }
  return `${base} ${colors[type] || 'bg-slate-500'}`
}
</script>
