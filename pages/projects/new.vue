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
      <h1 class="text-3xl font-bold text-white mb-2">Create New Project</h1>
      <p class="text-slate-300">Set up a new project for deployment</p>
    </div>

    <Card class="max-w-2xl">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Project Name *
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="my-awesome-project"
            class="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Project Slug *
          </label>
          <input
            v-model="form.slug"
            type="text"
            required
            placeholder="my-awesome-project"
            class="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p class="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Unique identifier for your project (lowercase, no spaces)
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Description
          </label>
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="A brief description of your project..."
            class="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Repository URL
          </label>
          <input
            v-model="form.repositoryUrl"
            type="url"
            placeholder="https://github.com/username/repo"
            class="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="flex items-center gap-3 pt-4">
          <Button type="submit" :disabled="loading" :iconLeft="Plus">
            {{ loading ? 'Creating...' : 'Create Project' }}
          </Button>
          <Button variant="ghost" @click="navigateTo('/projects')">
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Plus } from 'lucide-vue-next'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { createProject, loading } = useProjects()
const { success, error: notifyError } = useNotification()

const form = ref({
  name: '',
  slug: '',
  description: '',
  repositoryUrl: '',
  userId: 'temp-user-id' // In a real app, get from auth
})

// Auto-generate slug from name
watch(() => form.value.name, (newName) => {
  if (!form.value.slug || form.value.slug === '') {
    form.value.slug = newName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }
})

const handleSubmit = async () => {
  try {
    const project = await createProject(form.value)
    success('Project created successfully!')
    navigateTo(`/projects/${project.id}`)
  } catch (e: any) {
    // Error already handled in composable
  }
}
</script>
