export const useTeams = () => {
  const teams = ref<any[]>([])
  const currentTeam = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { success, error: notifyError } = useNotification()

  const fetchTeams = async () => {
    loading.value = true
    error.value = null
    try {
      teams.value = await $fetch('/api/teams')
    } catch (e: any) {
      error.value = e.message
      notifyError('获取团队失败', e.message)
    } finally {
      loading.value = false
    }
  }

  const fetchTeam = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      currentTeam.value = await $fetch(`/api/teams/${id}`)
      return currentTeam.value
    } catch (e: any) {
      error.value = e.message
      notifyError('获取团队详情失败', e.message)
      throw e
    } finally {
      loading.value = false
    }
  }

  const createTeam = async (data: any) => {
    loading.value = true
    error.value = null
    try {
      const team = await $fetch('/api/teams', {
        method: 'POST',
        body: data
      })
      success('团队创建成功')
      await fetchTeams()
      return team
    } catch (e: any) {
      error.value = e.message
      notifyError('创建团队失败', e.message)
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateTeam = async (id: string, data: any) => {
    loading.value = true
    error.value = null
    try {
      const team = await $fetch(`/api/teams/${id}`, {
        method: 'PUT',
        body: data
      })
      success('团队更新成功')
      await fetchTeams()
      return team
    } catch (e: any) {
      error.value = e.message
      notifyError('更新团队失败', e.message)
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteTeam = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await $fetch(`/api/teams/${id}`, {
        method: 'DELETE'
      })
      success('团队删除成功')
      await fetchTeams()
    } catch (e: any) {
      error.value = e.message
      notifyError('删除团队失败', e.message)
      throw e
    } finally {
      loading.value = false
    }
  }

  const addMember = async (teamId: string, userId: string, role: string = 'member') => {
    loading.value = true
    error.value = null
    try {
      const member = await $fetch(`/api/teams/${teamId}/members`, {
        method: 'POST',
        body: { userId, role }
      })
      success('成员添加成功')
      await fetchTeam(teamId)
      return member
    } catch (e: any) {
      error.value = e.message
      notifyError('添加成员失败', e.message)
      throw e
    } finally {
      loading.value = false
    }
  }

  const removeMember = async (teamId: string, memberId: string) => {
    loading.value = true
    error.value = null
    try {
      await $fetch(`/api/teams/${teamId}/members/${memberId}`, {
        method: 'DELETE'
      })
      success('成员移除成功')
      await fetchTeam(teamId)
    } catch (e: any) {
      error.value = e.message
      notifyError('移除成员失败', e.message)
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    teams,
    currentTeam,
    loading,
    error,
    fetchTeams,
    fetchTeam,
    createTeam,
    updateTeam,
    deleteTeam,
    addMember,
    removeMember
  }
}
