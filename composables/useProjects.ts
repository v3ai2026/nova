export const useProjects = () => {
  const projects = ref<any[]>([])
  const currentProject = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { success, error: notifyError } = useNotification()

  const fetchProjects = async () => {
    loading.value = true
    error.value = null
    try {
      projects.value = await $fetch('/api/projects')
    } catch (e: any) {
      error.value = e.message
      notifyError('获取项目失败', e.message)
    } finally {
      loading.value = false
    }
  }

  const fetchProject = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      currentProject.value = await $fetch(`/api/projects/${id}`)
      return currentProject.value
    } catch (e: any) {
      error.value = e.message
      notifyError('获取项目详情失败', e.message)
      throw e
    } finally {
      loading.value = false
    }
  }

  const createProject = async (data: any) => {
    loading.value = true
    error.value = null
    try {
      const project = await $fetch('/api/projects', {
        method: 'POST',
        body: data
      })
      success('项目创建成功')
      await fetchProjects()
      return project
    } catch (e: any) {
      error.value = e.message
      notifyError('创建项目失败', e.message)
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateProject = async (id: string, data: any) => {
    loading.value = true
    error.value = null
    try {
      const project = await $fetch(`/api/projects/${id}`, {
        method: 'PUT',
        body: data
      })
      success('项目更新成功')
      await fetchProjects()
      return project
    } catch (e: any) {
      error.value = e.message
      notifyError('更新项目失败', e.message)
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteProject = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await $fetch(`/api/projects/${id}`, {
        method: 'DELETE'
      })
      success('项目删除成功')
      await fetchProjects()
    } catch (e: any) {
      error.value = e.message
      notifyError('删除项目失败', e.message)
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    projects,
    currentProject,
    loading,
    error,
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject
  }
}
