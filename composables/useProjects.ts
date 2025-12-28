import type { Project } from '~/types'

export const useProjects = () => {
  const projects = useState<Project[]>('projects', () => [])
  const currentProject = useState<Project | null>('currentProject', () => null)
  const loading = useState('projectsLoading', () => false)
  const error = useState<string | null>('projectsError', () => null)

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

  const fetchProject = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await $fetch<Project>(`/api/projects/${id}`)
      currentProject.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch project'
      throw e
    } finally {
      loading.value = false
    }
  }

  const createProject = async (projectData: {
    name: string
    description?: string
    repository_url?: string
    framework?: string
  }) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await $fetch<Project>('/api/projects', {
        method: 'POST',
        body: projectData
      })
      projects.value = [data, ...projects.value]
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
      
      // Update in list
      const index = projects.value.findIndex(p => p.id === id)
      if (index !== -1) {
        projects.value[index] = data
      }
      
      // Update current if it's the same project
      if (currentProject.value?.id === id) {
        currentProject.value = data
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
      
      // Remove from list
      projects.value = projects.value.filter(p => p.id !== id)
      
      // Clear current if it's the deleted project
      if (currentProject.value?.id === id) {
        currentProject.value = null
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to delete project'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    projects: readonly(projects),
    currentProject: readonly(currentProject),
    loading: readonly(loading),
    error: readonly(error),
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject
  }
}
