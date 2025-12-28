export interface Team {
  id: string
  name: string
  slug: string
  ownerId: string
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  teamId: string
  userId: string
  role: 'owner' | 'admin' | 'member'
  user?: {
    id: string
    email: string
    name?: string
    avatarUrl?: string
  }
  created_at: string
}

export const useTeams = () => {
  const teams = ref<Team[]>([])
  const members = ref<TeamMember[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchTeams = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<Team[]>('/api/teams')
      teams.value = data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch teams'
      console.error('Error fetching teams:', e)
    } finally {
      loading.value = false
    }
  }

  const fetchTeam = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<Team>(`/api/teams/${id}`)
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch team'
      console.error('Error fetching team:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  const createTeam = async (teamData: Partial<Team>) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<Team>('/api/teams', {
        method: 'POST',
        body: teamData
      })
      teams.value.push(data)
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to create team'
      console.error('Error creating team:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  const fetchTeamMembers = async (teamId: string) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<TeamMember[]>(`/api/teams/${teamId}/members`)
      members.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch team members'
      console.error('Error fetching team members:', e)
      return []
    } finally {
      loading.value = false
    }
  }

  const addTeamMember = async (teamId: string, memberData: { userId: string, role: string }) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<TeamMember>(`/api/teams/${teamId}/members`, {
        method: 'POST',
        body: memberData
      })
      members.value.push(data)
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to add team member'
      console.error('Error adding team member:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  const removeTeamMember = async (teamId: string, memberId: string) => {
    loading.value = true
    error.value = null
    try {
      await $fetch(`/api/teams/${teamId}/members/${memberId}`, {
        method: 'DELETE'
      })
      members.value = members.value.filter(m => m.id !== memberId)
      return true
    } catch (e: any) {
      error.value = e.message || 'Failed to remove team member'
      console.error('Error removing team member:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    teams,
    members,
    loading,
    error,
    fetchTeams,
    fetchTeam,
    createTeam,
    fetchTeamMembers,
    addTeamMember,
    removeTeamMember
  }
}
