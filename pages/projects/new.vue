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

    <Card>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <Input
          v-model="form.name"
          label="Project Name"
          placeholder="my-awesome-project"
          required
          :error="errors.name"
          :iconLeft="FolderGit2"
        />

        <Input
          v-model="form.repository_url"
          label="Repository URL"
          placeholder="https://github.com/username/repo"
          type="url"
          required
          :error="errors.repository_url"
          :iconLeft="Github"
        />

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Description
          </label>
          <textarea
            v-model="form.description"
            class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            rows="4"
            placeholder="A brief description of your project..."
          />
          <p v-if="errors.description" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.description }}
          </p>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            type="button"
            variant="ghost"
            @click="navigateTo('/projects')"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            :loading="loading"
            :iconLeft="Plus"
          >
            Create Project
          </Button>
        </div>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, FolderGit2, Github, Plus } from 'lucide-vue-next'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { createProject, loading, error } = useProjects()
const { success, error: errorNotif } = useNotification()

const form = ref({
  name: '',
  repository_url: '',
  description: ''
})

const errors = ref({
  name: '',
  repository_url: '',
  description: ''
})

const validateForm = () => {
  errors.value = {
    name: '',
    repository_url: '',
    description: ''
  }

  let isValid = true

  if (!form.value.name || form.value.name.trim().length === 0) {
    errors.value.name = 'Project name is required'
    isValid = false
  } else if (form.value.name.length < 3) {
    errors.value.name = 'Project name must be at least 3 characters'
    isValid = false
  }

  if (!form.value.repository_url || form.value.repository_url.trim().length === 0) {
    errors.value.repository_url = 'Repository URL is required'
    isValid = false
  } else if (!form.value.repository_url.match(/^https?:\/\/.+/)) {
    errors.value.repository_url = 'Please enter a valid URL'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  const project = await createProject({
    name: form.value.name.trim(),
    repository_url: form.value.repository_url.trim(),
    description: form.value.description.trim() || undefined
  })

  if (project) {
    success('Project created', `${project.name} has been created successfully`)
    navigateTo(`/projects/${project.id}`)
  } else {
    errorNotif('Failed to create project', error.value || 'An error occurred')
  }
}
</script>
