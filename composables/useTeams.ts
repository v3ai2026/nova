export interface Team {
  id: string
  name: string
  slug: string
  ownerId: string
  createdAt: string
  updatedAt: string
  owner?: {
    id: string
    name: string
    email: string
  }
  _count?: {
    members: number
  }
}

export interface TeamMember {
  id: string
  teamId: string
  userId: string
  role: string
  createdAt: string
  user?: {
    id: string
    name: string
    email: string
  }
}

export const useTeams = () => {
  const teams = ref<Team[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchTeams = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<Team[]>('/api/teams')
      teams.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch teams'
      throw e
    } finally {
      loading.value = false
    }
  }

  const createTeam = async (teamData: { name: string; slug: string }) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<Team>('/api/teams', {
        method: 'POST',
        body: teamData
      })
      teams.value.unshift(data)
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to create team'
      throw e
    } finally {
      loading.value = false
    }
  }

  const fetchTeamMembers = async (teamId: string) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<TeamMember[]>(`/api/teams/${teamId}/members`)
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch team members'
      throw e
    } finally {
      loading.value = false
    }
  }

  const addTeamMember = async (teamId: string, userId: string, role: string = 'member') => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<TeamMember>(`/api/teams/${teamId}/members`, {
        method: 'POST',
        body: { userId, role }
      })
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to add team member'
      throw e
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
    } catch (e: any) {
      error.value = e.message || 'Failed to remove team member'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    teams,
    loading,
    error,
    fetchTeams,
    createTeam,
    fetchTeamMembers,
    addTeamMember,
    removeTeamMember
  }
}
