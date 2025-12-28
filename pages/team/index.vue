<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Team Management</h1>
        <p class="text-slate-300">Manage your team members and their roles</p>
      </div>
      <Button :iconLeft="UserPlus" @click="showAddModal = true">
        Add Member
      </Button>
    </div>

    <!-- Team Members Table -->
    <Card v-if="!loading">
      <template #header>
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Team Members</h2>
      </template>
      <Table :columns="columns" :data="members">
        <template #cell-name="{ row }">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              {{ row.name.charAt(0).toUpperCase() }}
            </div>
            <div>
              <div class="font-medium text-slate-900 dark:text-white">{{ row.name }}</div>
              <div class="text-sm text-slate-600 dark:text-slate-400">{{ row.email }}</div>
            </div>
          </div>
        </template>
        <template #cell-role="{ value, row }">
          <Dropdown position="right">
            <template #trigger>
              <Button variant="ghost" size="sm" :iconRight="ChevronDown">
                <Badge :variant="getRoleVariant(value)">
                  {{ value }}
                </Badge>
              </Button>
            </template>
            <template #default="{ close }">
              <div class="py-1">
                <button
                  v-for="role in ['owner', 'admin', 'member', 'viewer']"
                  :key="role"
                  @click="updateRole(row.id, role, close)"
                  :disabled="row.role === 'owner'"
                  class="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ role }}
                </button>
              </div>
            </template>
          </Dropdown>
        </template>
        <template #cell-created_at="{ value }">
          <span class="text-sm text-slate-600 dark:text-slate-400">
            {{ formatDate(value, 'short') }}
          </span>
        </template>
        <template #cell-actions="{ row }">
          <Button
            v-if="row.role !== 'owner'"
            variant="ghost"
            size="sm"
            :iconLeft="Trash2"
            @click="confirmRemove(row)"
          >
            Remove
          </Button>
        </template>
      </Table>
    </Card>

    <!-- Loading State -->
    <div v-else class="flex items-center justify-center py-12">
      <LoadingSpinner />
    </div>

    <!-- Add Member Modal -->
    <Modal :isOpen="showAddModal" @close="showAddModal = false">
      <template #header>
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Add Team Member</h3>
      </template>
      <form @submit.prevent="handleAddMember" class="space-y-4">
        <Input
          v-model="newMember.email"
          type="email"
          label="Email"
          placeholder="member@example.com"
          required
          :iconLeft="Mail"
        />
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Role
          </label>
          <Dropdown position="left">
            <template #trigger>
              <Button variant="secondary" :iconRight="ChevronDown" class="w-full justify-between">
                {{ newMember.role }}
              </Button>
            </template>
            <template #default="{ close }">
              <div class="py-1 min-w-full">
                <button
                  v-for="role in ['admin', 'member', 'viewer']"
                  :key="role"
                  @click="selectRole(role, close)"
                  class="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  {{ role }}
                </button>
              </div>
            </template>
          </Dropdown>
        </div>
      </form>
      <template #footer>
        <div class="flex justify-end gap-3">
          <Button variant="ghost" @click="showAddModal = false">
            Cancel
          </Button>
          <Button :loading="addingMember" @click="handleAddMember">
            Add Member
          </Button>
        </div>
      </template>
    </Modal>

    <!-- Remove Confirmation Modal -->
    <Modal :isOpen="showRemoveModal" @close="showRemoveModal = false">
      <template #header>
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Remove Team Member</h3>
      </template>
      <p class="text-slate-600 dark:text-slate-400">
        Are you sure you want to remove <strong>{{ memberToRemove?.name }}</strong> from the team?
        This action cannot be undone.
      </p>
      <template #footer>
        <div class="flex justify-end gap-3">
          <Button variant="ghost" @click="showRemoveModal = false">
            Cancel
          </Button>
          <Button variant="danger" :loading="removingMember" @click="handleRemoveMember">
            Remove
          </Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { UserPlus, Mail, Trash2, ChevronDown } from 'lucide-vue-next'
import { formatDate } from '~/utils/formatting'
import type { TeamMember } from '~/composables/useTeams'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { members, loading, fetchMembers, addMember, updateMemberRole, removeMember } = useTeams()
const { success, error: errorNotif } = useNotification()

const showAddModal = ref(false)
const showRemoveModal = ref(false)
const addingMember = ref(false)
const removingMember = ref(false)
const memberToRemove = ref<TeamMember | null>(null)

const newMember = ref({
  email: '',
  role: 'member' as TeamMember['role']
})

const columns = [
  { key: 'name', label: 'Member' },
  { key: 'role', label: 'Role' },
  { key: 'created_at', label: 'Joined' },
  { key: 'actions', label: '' }
]

const getRoleVariant = (role: string) => {
  const variants: Record<string, any> = {
    owner: 'default',
    admin: 'info',
    member: 'success',
    viewer: 'warning'
  }
  return variants[role] || 'default'
}

const selectRole = (role: TeamMember['role'], close: () => void) => {
  newMember.value.role = role
  close()
}

const updateRole = async (id: string, role: TeamMember['role'], close: () => void) => {
  const member = await updateMemberRole(id, role)
  if (member) {
    success('Role updated', `Member role has been updated to ${role}`)
  } else {
    errorNotif('Failed to update role', 'An error occurred while updating the role')
  }
  close()
}

const handleAddMember = async () => {
  addingMember.value = true
  const member = await addMember(newMember.value)
  addingMember.value = false

  if (member) {
    success('Member added', `${member.email} has been added to the team`)
    showAddModal.value = false
    newMember.value = {
      email: '',
      role: 'member'
    }
  } else {
    errorNotif('Failed to add member', 'An error occurred while adding the team member')
  }
}

const confirmRemove = (member: TeamMember) => {
  memberToRemove.value = member
  showRemoveModal.value = true
}

const handleRemoveMember = async () => {
  if (!memberToRemove.value) return

  removingMember.value = true
  const result = await removeMember(memberToRemove.value.id)
  removingMember.value = false

  if (result) {
    success('Member removed', `${memberToRemove.value.name} has been removed from the team`)
    showRemoveModal.value = false
    memberToRemove.value = null
  } else {
    errorNotif('Failed to remove member', 'An error occurred while removing the team member')
  }
}

// Fetch members on mount
onMounted(() => {
  fetchMembers()
})
</script>
