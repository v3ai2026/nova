<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 relative overflow-hidden p-6">
    <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNGgtMnYyaDJ2LTJ6bTAgNmgtMnYyaDJ2LTJ6bTAtMTRoLTJ2Mmgydi0yem0wIDRoLTJ2Mmgydi0yeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>

    <div class="w-full max-w-2xl relative z-10 animate-slide-up">
      <div class="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 hover-lift">
        <div class="text-center mb-8">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-sm text-green-300 mb-4">
            <Building class="w-4 h-4" />
            <span>Setup your workspace</span>
          </div>
          <h1 class="text-3xl font-bold text-white mb-2">Create your organization</h1>
          <p class="text-green-200">Let's get you started with your first workspace</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div v-if="error" class="bg-red-500/20 backdrop-blur-lg border border-red-500/30 text-red-200 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle class="w-4 h-4" />
            {{ error }}
          </div>

          <div>
            <label for="orgName" class="block text-sm font-medium text-green-100 mb-2">
              Organization Name
            </label>
            <div class="relative">
              <Building class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-300" />
              <input
                id="orgName"
                v-model="orgName"
                type="text"
                required
                class="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-white placeholder-green-300/50"
                placeholder="Acme Inc"
              />
            </div>
          </div>

          <div>
            <label for="orgSlug" class="block text-sm font-medium text-green-100 mb-2">
              Organization Slug
            </label>
            <div class="relative">
              <Hash class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-300" />
              <input
                id="orgSlug"
                v-model="orgSlug"
                type="text"
                required
                pattern="[a-z0-9-]+"
                class="w-full pl-12 pr-4 py-3.5 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-white placeholder-green-300/50 font-mono"
                placeholder="acme-inc"
              />
            </div>
            <p class="text-xs text-green-300 mt-2">Lowercase letters, numbers, and hyphens only</p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full relative py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-green-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] flex items-center justify-center gap-2 group"
          >
            <span>{{ loading ? 'Creating...' : 'Create organization' }}</span>
            <ArrowRight v-if="!loading" class="w-5 h-5 group-hover:translate-x-1 transition" />
            <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Building, Hash, ArrowRight, AlertCircle } from 'lucide-vue-next'

const { $supabase } = useNuxtApp()
const { user } = useAuth()

definePageMeta({
  layout: false,
  middleware: 'auth'
})

const orgName = ref('')
const orgSlug = ref('')
const loading = ref(false)
const error = ref('')

watch(orgName, (value) => {
  if (value && !orgSlug.value) {
    orgSlug.value = value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-')
  }
})

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''

    const { data: org, error: orgError } = await $supabase
      .from('organizations')
      .insert({
        name: orgName.value,
        slug: orgSlug.value,
        owner_id: user.value?.id
      })
      .select()
      .single()

    if (orgError) throw orgError

    await $supabase
      .from('organization_members')
      .insert({
        organization_id: org.id,
        user_id: user.value?.id,
        role: 'owner'
      })

    navigateTo('/dashboard')
  } catch (e: any) {
    error.value = e.message || 'Failed to create organization'
  } finally {
    loading.value = false
  }
}
</script>
