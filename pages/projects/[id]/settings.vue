<template>
  <div class="p-8">
    <LoadingSpinner v-if="loading" />

    <div v-else-if="project">
      <div class="flex items-center gap-3 mb-8">
        <NuxtLink :to="`/projects/${project.id}`" class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
          <ArrowLeft class="w-5 h-5" />
        </NuxtLink>
        <div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Project Settings</h1>
          <p class="text-slate-600 dark:text-slate-400">{{ project.name }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <nav class="space-y-1">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition"
            :class="activeTab === tab.id
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'"
          >
            <component :is="tab.icon" class="w-5 h-5" />
            {{ tab.name }}
          </button>
        </nav>

        <div class="lg:col-span-3 space-y-6">
          <div v-if="activeTab === 'general'" class="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-6">General Settings</h2>
            <form @submit.prevent="updateProject" class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Project Name
                </label>
                <input
                  v-model="projectForm.name"
                  type="text"
                  required
                  class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  v-model="projectForm.description"
                  rows="3"
                  class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition text-slate-900 dark:text-white"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Repository URL
                </label>
                <input
                  v-model="projectForm.repository_url"
                  type="url"
                  class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                :disabled="updating"
                class="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition disabled:opacity-50"
              >
                {{ updating ? 'Saving...' : 'Save Changes' }}
              </button>
            </form>
          </div>

          <div v-if="activeTab === 'environment'" class="space-y-6">
            <div class="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Environment Variables</h2>
                <button
                  @click="showEnvModal = true"
                  class="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition text-sm font-medium"
                >
                  <Plus class="w-4 h-4" />
                  Add Variable
                </button>
              </div>

              <div class="space-y-3">
                <div class="flex items-center gap-3 mb-4">
                  <button
                    v-for="env in environments"
                    :key="env"
                    @click="selectedEnv = env"
                    class="px-4 py-2 rounded-lg text-sm font-medium transition capitalize"
                    :class="selectedEnv === env
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'"
                  >
                    {{ env }}
                  </button>
                </div>

                <EmptyState
                  v-if="filteredEnvVars.length === 0"
                  :icon="Key"
                  title="No environment variables"
                  description="Add environment variables to configure your project"
                />

                <div
                  v-for="envVar in filteredEnvVars"
                  :key="envVar.id"
                  class="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                >
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-slate-900 dark:text-white font-mono">
                      {{ envVar.key }}
                    </p>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {{ showValues[envVar.id] ? envVar.value : '••••••••' }}
                    </p>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      @click="toggleValue(envVar.id)"
                      class="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                    >
                      <component :is="showValues[envVar.id] ? EyeOff : Eye" class="w-4 h-4" />
                    </button>
                    <button
                      @click="deleteEnvVar(envVar.id)"
                      class="p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'domains'" class="space-y-6">
            <div class="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Custom Domains</h2>
                <button
                  @click="showDomainModal = true"
                  class="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition text-sm font-medium"
                >
                  <Plus class="w-4 h-4" />
                  Add Domain
                </button>
              </div>

              <EmptyState
                v-if="domains.length === 0"
                :icon="Globe"
                title="No custom domains"
                description="Add a custom domain to make your project accessible"
              />

              <div v-else class="space-y-3">
                <div
                  v-for="domain in domains"
                  :key="domain.id"
                  class="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                >
                  <div class="flex-1">
                    <p class="text-sm font-medium text-slate-900 dark:text-white font-mono">
                      {{ domain.domain }}
                    </p>
                    <div class="flex items-center gap-3 mt-2">
                      <span
                        class="px-2 py-0.5 text-xs font-medium rounded-full"
                        :class="domain.verified
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'"
                      >
                        {{ domain.verified ? 'Verified' : 'Pending' }}
                      </span>
                      <span
                        v-if="domain.ssl_enabled"
                        class="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                      >
                        SSL Enabled
                      </span>
                    </div>
                  </div>
                  <button
                    @click="deleteDomain(domain.id)"
                    class="p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'danger'" class="bg-white dark:bg-slate-900 rounded-lg border border-red-200 dark:border-red-800 p-6">
            <h2 class="text-xl font-semibold text-red-600 dark:text-red-400 mb-6">Danger Zone</h2>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div>
                  <p class="text-sm font-medium text-slate-900 dark:text-white">Delete Project</p>
                  <p class="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Permanently delete this project and all associated data
                  </p>
                </div>
                <button
                  @click="confirmDelete = true"
                  class="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition text-sm font-medium"
                >
                  Delete Project
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showEnvModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showEnvModal = false"
    >
      <div class="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 max-w-lg w-full mx-4">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">Add Environment Variable</h2>
        <form @submit.prevent="addEnvVar" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Key</label>
            <input
              v-model="envForm.key"
              type="text"
              required
              class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 dark:text-white font-mono"
              placeholder="API_KEY"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Value</label>
            <input
              v-model="envForm.value"
              type="text"
              required
              class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 dark:text-white font-mono"
              placeholder="your_api_key_here"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Environment</label>
            <select
              v-model="envForm.environment"
              class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 dark:text-white"
            >
              <option value="production">Production</option>
              <option value="preview">Preview</option>
              <option value="development">Development</option>
            </select>
          </div>
          <div class="flex gap-3 pt-4">
            <button
              type="submit"
              class="flex-1 px-4 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition"
            >
              Add Variable
            </button>
            <button
              type="button"
              @click="showEnvModal = false"
              class="px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="showDomainModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showDomainModal = false"
    >
      <div class="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 max-w-lg w-full mx-4">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">Add Custom Domain</h2>
        <form @submit.prevent="addDomain" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Domain</label>
            <input
              v-model="domainForm.domain"
              type="text"
              required
              class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 dark:text-white font-mono"
              placeholder="example.com"
            />
          </div>
          <div class="flex gap-3 pt-4">
            <button
              type="submit"
              class="flex-1 px-4 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition"
            >
              Add Domain
            </button>
            <button
              type="button"
              @click="showDomainModal = false"
              class="px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Settings, Key, Globe, AlertTriangle, ArrowLeft, Plus, Eye, EyeOff, Trash2 } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const route = useRoute()
const { $supabase } = useNuxtApp()
const notification = useNotification()

const project = ref<any>(null)
const loading = ref(true)
const updating = ref(false)
const activeTab = ref('general')
const confirmDelete = ref(false)

const tabs = [
  { id: 'general', name: 'General', icon: Settings },
  { id: 'environment', name: 'Environment', icon: Key },
  { id: 'domains', name: 'Domains', icon: Globe },
  { id: 'danger', name: 'Danger Zone', icon: AlertTriangle }
]

const projectForm = ref({
  name: '',
  description: '',
  repository_url: ''
})

const envVars = ref<any[]>([])
const showEnvModal = ref(false)
const selectedEnv = ref('production')
const environments = ['production', 'preview', 'development']
const showValues = ref<Record<string, boolean>>({})
const envForm = ref({
  key: '',
  value: '',
  environment: 'production'
})

const domains = ref<any[]>([])
const showDomainModal = ref(false)
const domainForm = ref({
  domain: ''
})

const filteredEnvVars = computed(() => {
  return envVars.value.filter(v => v.environment === selectedEnv.value)
})

const loadProject = async () => {
  const { data } = await $supabase
    .from('projects')
    .select('*')
    .eq('id', route.params.id)
    .single()

  project.value = data
  projectForm.value = {
    name: data.name,
    description: data.description || '',
    repository_url: data.repository_url || ''
  }
}

const loadEnvVars = async () => {
  const { data } = await $supabase
    .from('environment_variables')
    .select('*')
    .eq('project_id', route.params.id)

  envVars.value = data || []
}

const loadDomains = async () => {
  const { data } = await $supabase
    .from('domains')
    .select('*')
    .eq('project_id', route.params.id)

  domains.value = data || []
}

const updateProject = async () => {
  try {
    updating.value = true
    await $supabase
      .from('projects')
      .update(projectForm.value)
      .eq('id', route.params.id)

    notification.success('Project updated successfully')
  } catch (e: any) {
    notification.error('Failed to update project', e.message)
  } finally {
    updating.value = false
  }
}

const addEnvVar = async () => {
  try {
    await $supabase
      .from('environment_variables')
      .insert({
        project_id: route.params.id,
        ...envForm.value
      })

    showEnvModal.value = false
    envForm.value = { key: '', value: '', environment: 'production' }
    await loadEnvVars()
    notification.success('Environment variable added')
  } catch (e: any) {
    notification.error('Failed to add variable', e.message)
  }
}

const deleteEnvVar = async (id: string) => {
  if (!confirm('Are you sure?')) return

  try {
    await $supabase.from('environment_variables').delete().eq('id', id)
    await loadEnvVars()
    notification.success('Variable deleted')
  } catch (e: any) {
    notification.error('Failed to delete variable', e.message)
  }
}

const toggleValue = (id: string) => {
  showValues.value[id] = !showValues.value[id]
}

const addDomain = async () => {
  try {
    await $supabase
      .from('domains')
      .insert({
        project_id: route.params.id,
        domain: domainForm.value.domain
      })

    showDomainModal.value = false
    domainForm.value = { domain: '' }
    await loadDomains()
    notification.success('Domain added')
  } catch (e: any) {
    notification.error('Failed to add domain', e.message)
  }
}

const deleteDomain = async (id: string) => {
  if (!confirm('Are you sure?')) return

  try {
    await $supabase.from('domains').delete().eq('id', id)
    await loadDomains()
    notification.success('Domain deleted')
  } catch (e: any) {
    notification.error('Failed to delete domain', e.message)
  }
}

onMounted(async () => {
  await Promise.all([
    loadProject(),
    loadEnvVars(),
    loadDomains()
  ])
  loading.value = false
})
</script>
