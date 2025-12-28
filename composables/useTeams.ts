export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  avatar_url?: string
  created_at: string
}

export const useTeams = () => {
  const members = ref<TeamMember[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchMembers = async () => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await $fetch('/api/teams/members')
      members.value = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'owner',
          created_at: new Date(Date.now() - 86400000 * 90).toISOString()
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'admin',
          created_at: new Date(Date.now() - 86400000 * 60).toISOString()
        },
        {
          id: '3',
          name: 'Bob Johnson',
          email: 'bob@example.com',
          role: 'member',
          created_at: new Date(Date.now() - 86400000 * 30).toISOString()
        }
      ]
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch team members'
      console.error('Error fetching team members:', e)
    } finally {
      loading.value = false
    }
  }

  const addMember = async (data: { email: string; role: TeamMember['role'] }) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await $fetch('/api/teams/members', { method: 'POST', body: data })
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: data.email.split('@')[0],
        email: data.email,
        role: data.role,
        created_at: new Date().toISOString()
      }
      members.value.push(newMember)
      return newMember
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to add team member'
      console.error('Error adding team member:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  const updateMemberRole = async (id: string, role: TeamMember['role']) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await $fetch(`/api/teams/members/${id}`, { method: 'PUT', body: { role } })
      const member = members.value.find(m => m.id === id)
      if (member) {
        member.role = role
      }
      return member
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update member role'
      console.error('Error updating member role:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  const removeMember = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // await $fetch(`/api/teams/members/${id}`, { method: 'DELETE' })
      members.value = members.value.filter(m => m.id !== id)
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to remove team member'
      console.error('Error removing team member:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    members: readonly(members),
    loading: readonly(loading),
    error: readonly(error),
    fetchMembers,
    addMember,
    updateMemberRole,
    removeMember
  }
}
