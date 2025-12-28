import type { Team, TeamMember } from '~/types'

export const useTeams = () => {
  const teams = useState<Team[]>('teams', () => [])
  const currentTeam = useState<Team | null>('currentTeam', () => null)
  const teamMembers = useState<TeamMember[]>('teamMembers', () => [])
  const loading = useState('teamsLoading', () => false)
  const error = useState<string | null>('teamsError', () => null)

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

  const fetchTeamMembers = async (teamId: string) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await $fetch<TeamMember[]>(`/api/teams/${teamId}/members`)
      teamMembers.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch team members'
      throw e
    } finally {
      loading.value = false
    }
  }

  const createTeam = async (teamData: {
    name: string
    description?: string
  }) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await $fetch<Team>('/api/teams', {
        method: 'POST',
        body: teamData
      })
      teams.value = [data, ...teams.value]
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to create team'
      throw e
    } finally {
      loading.value = false
    }
  }

  const addTeamMember = async (
    teamId: string, 
    userId: string, 
    role: 'owner' | 'admin' | 'member' = 'member'
  ) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await $fetch<TeamMember>(`/api/teams/${teamId}/members`, {
        method: 'POST',
        body: {
          userId,
          role
        }
      })
      teamMembers.value = [...teamMembers.value, data]
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
      teamMembers.value = teamMembers.value.filter(m => m.id !== memberId)
    } catch (e: any) {
      error.value = e.message || 'Failed to remove team member'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    teams: readonly(teams),
    currentTeam: readonly(currentTeam),
    teamMembers: readonly(teamMembers),
    loading: readonly(loading),
    error: readonly(error),
    fetchTeams,
    fetchTeamMembers,
    createTeam,
    addTeamMember,
    removeTeamMember
  }
}
