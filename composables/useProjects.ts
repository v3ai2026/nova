import type { Project } from '~/types'

export const useProjects = () => {
  const projects = ref<Project[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProjects = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<Project[]>('/api/projects')
      projects.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch projects'
      throw e
    } finally {
      loading.value = false
    }
  }

  const getProject = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<Project>(`/api/projects/${id}`)
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch project'
      throw e
    } finally {
      loading.value = false
    }
  }

  const createProject = async (projectData: Partial<Project>) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<Project>('/api/projects', {
        method: 'POST',
        body: projectData
      })
      projects.value.unshift(data)
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to create project'
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateProject = async (id: string, projectData: Partial<Project>) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<Project>(`/api/projects/${id}`, {
        method: 'PUT',
        body: projectData
      })
      const index = projects.value.findIndex(p => p.id === id)
      if (index !== -1) {
        projects.value[index] = data
      }
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to update project'
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
      projects.value = projects.value.filter(p => p.id !== id)
    } catch (e: any) {
      error.value = e.message || 'Failed to delete project'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    projects,
    loading,
    error,
    fetchProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
  }
}
