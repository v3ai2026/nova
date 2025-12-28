<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">Create New Project</h1>
      <p class="text-slate-300">Set up a new deployment project</p>
    </div>

    <Card class="max-w-2xl">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <Input
          v-model="form.name"
          label="Project Name"
          placeholder="my-awesome-project"
          required
          :error="errors.name"
          hint="This will be used as the project identifier"
        />

        <Input
          v-model="form.description"
          label="Description"
          placeholder="A brief description of your project"
          hint="Optional but recommended"
        />

        <Input
          v-model="form.repository_url"
          type="url"
          label="Repository URL"
          placeholder="https://github.com/username/repo"
          :error="errors.repository_url"
          hint="Git repository URL (GitHub, GitLab, etc.)"
        />

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">
            Framework
          </label>
          <select
            v-model="form.framework"
            class="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-white"
          >
            <option value="">Select a framework</option>
            <option value="nuxt">Nuxt.js</option>
            <option value="next">Next.js</option>
            <option value="vue">Vue.js</option>
            <option value="react">React</option>
            <option value="angular">Angular</option>
            <option value="svelte">Svelte</option>
            <option value="static">Static HTML</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <Button 
            variant="ghost" 
            type="button" 
            @click="navigateTo('/projects')"
          >
            Cancel
          </Button>
          <Button type="submit" :loading="loading">
            Create Project
          </Button>
        </div>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { createProject } = useProjects()
const { success, error: showError } = useNotification()
const router = useRouter()

const form = ref({
  name: '',
  description: '',
  repository_url: '',
  framework: ''
})

const errors = ref({
  name: '',
  repository_url: ''
})

const loading = ref(false)

const handleSubmit = async () => {
  // Reset errors
  errors.value = {
    name: '',
    repository_url: ''
  }

  // Validate
  if (!form.value.name) {
    errors.value.name = 'Project name is required'
    return
  }

  if (form.value.repository_url && !isValidUrl(form.value.repository_url)) {
    errors.value.repository_url = 'Please enter a valid URL'
    return
  }

  loading.value = true

  try {
    const project = await createProject(form.value)
    success('Project created', `${project.name} has been created successfully`)
    router.push(`/projects/${project.id}`)
  } catch (e: any) {
    showError('Creation failed', e.message || 'Failed to create project')
  } finally {
    loading.value = false
  }
}

const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
</script>
