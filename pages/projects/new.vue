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
      <p class="text-slate-300">Set up a new deployment project</p>
    </div>

    <div class="max-w-2xl">
      <Card>
        <template #header>
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Project Details</h2>
        </template>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <Input
            v-model="form.name"
            label="Project Name"
            placeholder="my-awesome-project"
            required
            :error="errors.name"
            :iconLeft="FolderGit2"
          />

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
            <textarea
              v-model="form.description"
              rows="4"
              placeholder="Describe your project..."
              class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Input
            v-model="form.repositoryUrl"
            label="Repository URL"
            type="url"
            placeholder="https://github.com/username/repo"
            :iconLeft="Github"
          />

          <Input
            v-model="form.slug"
            label="Project Slug"
            placeholder="my-awesome-project"
            hint="Used in URLs. If empty, will be generated from project name."
            :iconLeft="Link"
          />

          <div class="pt-4 border-t border-slate-200 dark:border-slate-800">
            <h3 class="font-medium text-slate-900 dark:text-white mb-4">Initial Configuration</h3>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div>
                  <p class="font-medium text-slate-900 dark:text-white">Enable Blockchain Verification</p>
                  <p class="text-sm text-slate-600 dark:text-slate-400">
                    Record deployments on-chain for verification
                  </p>
                </div>
                <input
                  v-model="form.enableBlockchain"
                  type="checkbox"
                  class="w-5 h-5 text-blue-600 rounded"
                />
              </div>

              <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <div>
                  <p class="font-medium text-slate-900 dark:text-white">Auto Deploy on Push</p>
                  <p class="text-sm text-slate-600 dark:text-slate-400">
                    Automatically deploy when code is pushed
                  </p>
                </div>
                <input
                  v-model="form.autoDeploy"
                  type="checkbox"
                  class="w-5 h-5 text-blue-600 rounded"
                />
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <Button variant="ghost" @click="$router.back()">
              Cancel
            </Button>
            <Button type="submit" :loading="loading" :iconLeft="Plus">
              Create Project
            </Button>
          </div>
        </form>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, FolderGit2, Github, Link, Plus } from 'lucide-vue-next'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { user } = useAuth()
const { createProject, loading, error } = useProjects()
const { success, error: showError } = useNotification()
const router = useRouter()

const form = ref({
  name: '',
  description: '',
  repositoryUrl: '',
  slug: '',
  enableBlockchain: false,
  autoDeploy: true
})

const errors = ref({
  name: ''
})

const handleSubmit = async () => {
  // Validate
  if (!form.value.name) {
    errors.value.name = 'Project name is required'
    return
  }

  if (!user.value) {
    showError('Error', 'You must be logged in to create a project')
    return
  }

  const project = await createProject({
    name: form.value.name,
    description: form.value.description,
    repositoryUrl: form.value.repositoryUrl,
    slug: form.value.slug,
    userId: user.value.id
  })

  if (project) {
    success('Project Created', `${project.name} has been created successfully`)
    router.push(`/projects/${project.id}`)
  } else if (error.value) {
    showError('Creation Failed', error.value)
  }
}
</script>
