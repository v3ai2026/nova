<template>
  <div>
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">Team</h1>
          <p class="text-slate-300">Manage your team members and permissions</p>
        </div>
        <Button :iconLeft="Plus" @click="showInviteModal = true">
          Invite Member
        </Button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <Card v-if="loading" class="text-center py-8">
          <LoadingSpinner />
        </Card>

        <Card v-else>
          <template #header>
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Team Members</h2>
          </template>

          <div class="space-y-3">
            <div
              v-for="member in members"
              :key="member.id"
              class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {{ member.user?.name?.[0] || member.user?.email[0].toUpperCase() }}
                </div>
                <div>
                  <p class="font-medium text-slate-900 dark:text-white">
                    {{ member.user?.name || member.user?.email }}
                  </p>
                  <p class="text-sm text-slate-600 dark:text-slate-400">
                    {{ member.user?.email }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <Badge :variant="member.role === 'owner' ? 'success' : 'default'">
                  {{ member.role }}
                </Badge>
                <Dropdown v-if="member.role !== 'owner'" position="right">
                  <template #trigger>
                    <Button variant="ghost" size="sm" :iconLeft="MoreVertical" />
                  </template>
                  <template #default="{ close }">
                    <button
                      @click="removeMember(member, close)"
                      class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Remove
                    </button>
                  </template>
                </Dropdown>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div>
        <Card class="mb-6">
          <template #header>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Team Stats</h3>
          </template>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-600 dark:text-slate-400">Total Members</span>
              <span class="text-lg font-semibold text-slate-900 dark:text-white">{{ members.length }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-600 dark:text-slate-400">Active Projects</span>
              <span class="text-lg font-semibold text-slate-900 dark:text-white">8</span>
            </div>
          </div>
        </Card>
      </div>
    </div>

    <!-- Invite Modal -->
    <Modal :isOpen="showInviteModal" @close="showInviteModal = false">
      <template #header>
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Invite Team Member</h3>
      </template>

      <div class="space-y-4">
        <Input
          v-model="inviteForm.email"
          label="Email Address"
          type="email"
          placeholder="member@example.com"
          required
        />

        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
          <select
            v-model="inviteForm.role"
            class="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <Button variant="ghost" @click="showInviteModal = false">
            Cancel
          </Button>
          <Button @click="handleInvite">
            Send Invite
          </Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { Plus, MoreVertical, Users } from 'lucide-vue-next'
import type { TeamMember } from '~/composables/useTeams'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { members, loading, fetchTeamMembers, removeTeamMember } = useTeams()
const { success, error: showError } = useNotification()

const showInviteModal = ref(false)
const inviteForm = ref({
  email: '',
  role: 'member'
})

const removeMember = async (member: TeamMember, close: () => void) => {
  const confirmed = confirm(`Are you sure you want to remove ${member.user?.email}?`)
  if (!confirmed) return

  const result = await removeTeamMember(member.teamId, member.id)
  if (result) {
    success('Member Removed', 'Team member has been removed successfully')
  } else {
    showError('Error', 'Failed to remove team member')
  }
  close()
}

const handleInvite = () => {
  success('Invite Sent', `Invitation sent to ${inviteForm.value.email}`)
  showInviteModal.value = false
  inviteForm.value = { email: '', role: 'member' }
}

onMounted(() => {
  // In a real app, fetch team members for the user's team
  // fetchTeamMembers('team-id')
})
</script>
