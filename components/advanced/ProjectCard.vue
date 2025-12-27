<template>
  <Card :hover="true" class="group">
    <template #header>
      <div class="flex items-start justify-between">
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white truncate">
            {{ project.name }}
          </h3>
          <p v-if="project.description" class="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
            {{ project.description }}
          </p>
        </div>
        <Badge :variant="statusVariant">
          <component :is="statusIcon" class="w-3 h-3" />
          {{ project.status }}
        </Badge>
      </div>
    </template>

    <div class="space-y-3">
      <div v-if="project.repository_url" class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <Github class="w-4 h-4" />
        <a
          :href="project.repository_url"
          target="_blank"
          class="hover:text-blue-600 dark:hover:text-blue-400 truncate"
        >
          {{ project.repository_url }}
        </a>
      </div>
      <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Created {{ formatDate(project.created_at, 'relative') }}</span>
        <span>Updated {{ formatDate(project.updated_at, 'relative') }}</span>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center gap-2">
        <Button
          variant="primary"
          size="sm"
          :iconLeft="Rocket"
          @click="handleDeploy"
        >
          Deploy
        </Button>
        <Button
          variant="ghost"
          size="sm"
          :iconLeft="Settings"
          @click="handleSettings"
        >
          Settings
        </Button>
        <Dropdown position="right" class="ml-auto">
          <template #trigger>
            <button class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <MoreVertical class="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </button>
          </template>
          <template #default="{ close }">
            <div class="py-1">
              <button
                @click="handleEdit(close)"
                class="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Edit class="w-4 h-4" />
                Edit
              </button>
              <button
                @click="handleDelete(close)"
                class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Trash2 class="w-4 h-4" />
                Delete
              </button>
            </div>
          </template>
        </Dropdown>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { Github, Rocket, Settings, MoreVertical, Edit, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-vue-next'
import { formatDate } from '~/utils/formatting'
import type { Project } from '~/types'

interface Props {
  project: Project
}

const props = defineProps<Props>()

const emit = defineEmits<{
  deploy: [project: Project]
  settings: [project: Project]
  edit: [project: Project]
  delete: [project: Project]
}>()

const statusVariant = computed(() => {
  const variants: Record<string, any> = {
    active: 'success',
    paused: 'warning',
    error: 'error'
  }
  return variants[props.project.status] || 'default'
})

const statusIcon = computed(() => {
  const icons: Record<string, any> = {
    active: CheckCircle,
    paused: AlertCircle,
    error: XCircle
  }
  return icons[props.project.status] || CheckCircle
})

const handleDeploy = () => {
  emit('deploy', props.project)
}

const handleSettings = () => {
  emit('settings', props.project)
}

const handleEdit = (close: () => void) => {
  emit('edit', props.project)
  close()
}

const handleDelete = (close: () => void) => {
  emit('delete', props.project)
  close()
}
</script>
