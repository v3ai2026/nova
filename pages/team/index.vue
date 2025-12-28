<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Team Management</h1>
        <p class="text-slate-300">Manage team members and permissions</p>
      </div>
      <Button :iconLeft="Plus" @click="showInviteModal = true">
        Invite Member
      </Button>
    </div>

    <div v-if="loading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>

    <div v-else-if="teams.length > 0" class="space-y-6">
      <Card v-for="team in teams" :key="team.id">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-white">{{ team.name }}</h2>
            <Badge>{{ team.userRole || 'member' }}</Badge>
          </div>
        </template>
        <p v-if="team.description" class="text-slate-400 mb-4">{{ team.description }}</p>
        <div class="text-sm text-slate-500">
          {{ team._count?.members || 0 }} members
        </div>
      </Card>
    </div>

    <EmptyState
      v-else
      :icon="Users"
      title="No teams yet"
      description="Create a team to collaborate with others"
      actionText="Create Team"
      @action="showCreateModal = true"
    />

    <Modal :isOpen="showInviteModal" @close="showInviteModal = false">
      <template #header>
        <h3 class="text-lg font-semibold text-white">Invite Team Member</h3>
      </template>
      <div class="space-y-4">
        <Input v-model="inviteEmail" label="Email" placeholder="user@example.com" />
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Role</label>
          <select v-model="inviteRole" class="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <Button variant="ghost" @click="showInviteModal = false">Cancel</Button>
          <Button @click="handleInvite">Send Invite</Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { Users, Plus } from 'lucide-vue-next'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { fetchTeams, teams, loading } = useTeams()
const { success } = useNotification()

const showInviteModal = ref(false)
const showCreateModal = ref(false)
const inviteEmail = ref('')
const inviteRole = ref('member')

const handleInvite = () => {
  success('Invite sent', `Invitation sent to ${inviteEmail.value}`)
  showInviteModal.value = false
  inviteEmail.value = ''
}

onMounted(() => {
  fetchTeams()
})
</script>
