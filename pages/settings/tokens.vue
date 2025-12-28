<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">API Tokens</h1>
      <p class="text-slate-600 dark:text-slate-400">Manage your API tokens for programmatic access</p>
    </div>

    <div class="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Your Tokens</h2>
        <button
          @click="showCreateModal = true"
          class="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition font-medium"
        >
          <Plus class="w-4 h-4" />
          Create Token
        </button>
      </div>

      <LoadingSpinner v-if="loading" size="md" />

      <EmptyState
        v-else-if="tokens.length === 0"
        :icon="Key"
        title="No API tokens"
        description="Create an API token to access the API programmatically"
      />

      <div v-else class="space-y-3">
        <div
          v-for="token in tokens"
          :key="token.id"
          class="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
        >
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-slate-900 dark:text-white">
              {{ token.name }}
            </p>
            <div class="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Created {{ formatDate(token.createdAt) }}</span>
              <span v-if="token.lastUsedAt">Last used {{ formatDate(token.lastUsedAt) }}</span>
              <span v-else>Never used</span>
            </div>
          </div>
          <button
            @click="deleteToken(token.id)"
            class="p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showCreateModal = false"
    >
      <div class="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 max-w-lg w-full mx-4">
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">Create API Token</h2>

        <div v-if="newTokenValue" class="mb-4">
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
            <p class="text-sm text-blue-800 dark:text-blue-200 mb-2 font-medium">
              Save this token now. You won't be able to see it again!
            </p>
            <div class="flex items-center gap-2">
              <code class="flex-1 text-sm bg-white dark:bg-slate-800 px-3 py-2 rounded border border-blue-200 dark:border-blue-800 text-slate-900 dark:text-white font-mono">
                {{ newTokenValue }}
              </code>
              <button
                @click="copyToken"
                class="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition"
              >
                <Copy class="w-4 h-4" />
              </button>
            </div>
          </div>
          <button
            @click="closeModal"
            class="w-full px-4 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition"
          >
            Done
          </button>
        </div>

        <form v-else @submit.prevent="createToken" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Token Name
            </label>
            <input
              v-model="tokenForm.name"
              type="text"
              required
              class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 dark:text-white"
              placeholder="My API Token"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Expires In
            </label>
            <select
              v-model="tokenForm.expiresIn"
              class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none text-slate-900 dark:text-white"
            >
              <option value="30">30 days</option>
              <option value="60">60 days</option>
              <option value="90">90 days</option>
              <option value="never">Never</option>
            </select>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="submit"
              :disabled="creating"
              class="flex-1 px-4 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition disabled:opacity-50"
            >
              {{ creating ? 'Creating...' : 'Create Token' }}
            </button>
            <button
              type="button"
              @click="showCreateModal = false"
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
import { Key, Plus, Trash2, Copy } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

const notification = useNotification()
const { tokens, loading, fetchTokens, createToken: createApiToken, deleteToken: deleteApiToken } = useApiTokens()

const creating = ref(false)
const showCreateModal = ref(false)
const newTokenValue = ref('')

const tokenForm = ref({
  name: '',
  userId: 'temp-user-id' // In a real app, get from auth
})

const createToken = async () => {
  try {
    creating.value = true
    const token = await createApiToken(tokenForm.value.name)
    newTokenValue.value = token.token
    notification.success('Token created successfully')
  } catch (e: any) {
    // Error already handled in composable
  } finally {
    creating.value = false
  }
}

const deleteToken = async (id: string) => {
  if (!confirm('Are you sure you want to delete this token?')) return

  try {
    await deleteApiToken(id)
  } catch (e: any) {
    // Error already handled in composable
  }
}

const copyToken = () => {
  navigator.clipboard.writeText(newTokenValue.value)
  notification.success('Token copied to clipboard')
}

const closeModal = () => {
  showCreateModal.value = false
  newTokenValue.value = ''
  tokenForm.value = { name: '', userId: 'temp-user-id' }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

onMounted(() => {
  fetchTokens()
})
</script>
