import type { Project } from '~/types'

export const useProjects = () => {
  const projects = ref<Project[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchProjects = async () => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await $fetch('/api/projects')
      // Temporary mock data
      projects.value = [
        {
          id: '1',
          name: 'my-web-app',
          slug: 'my-web-app',
          description: 'A modern web application built with Nuxt 3',
          repository_url: 'https://github.com/user/my-web-app',
          status: 'active',
          created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
          updated_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '2',
          name: 'api-service',
          slug: 'api-service',
          description: 'RESTful API service for mobile apps',
          repository_url: 'https://github.com/user/api-service',
          status: 'active',
          created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
          updated_at: new Date(Date.now() - 7200000).toISOString()
        }
      ]
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch projects'
      console.error('Error fetching projects:', e)
    } finally {
      loading.value = false
    }
  }

  const fetchProject = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await $fetch(`/api/projects/${id}`)
      return {
        id,
        name: 'my-web-app',
        slug: 'my-web-app',
        description: 'A modern web application built with Nuxt 3',
        repository_url: 'https://github.com/user/my-web-app',
        status: 'active',
        created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
        updated_at: new Date(Date.now() - 3600000).toISOString()
      } as Project
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch project'
      console.error('Error fetching project:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  const createProject = async (data: Partial<Project>) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await $fetch('/api/projects', { method: 'POST', body: data })
      const newProject: Project = {
        id: Date.now().toString(),
        name: data.name || '',
        slug: data.name?.toLowerCase().replace(/\s+/g, '-') || '',
        description: data.description,
        repository_url: data.repository_url,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      projects.value.push(newProject)
      return newProject
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create project'
      console.error('Error creating project:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  const updateProject = async (id: string, data: Partial<Project>) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await $fetch(`/api/projects/${id}`, { method: 'PUT', body: data })
      const index = projects.value.findIndex(p => p.id === id)
      if (index !== -1) {
        projects.value[index] = { ...projects.value[index], ...data, updated_at: new Date().toISOString() }
      }
      return projects.value[index]
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update project'
      console.error('Error updating project:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteProject = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // await $fetch(`/api/projects/${id}`, { method: 'DELETE' })
      projects.value = projects.value.filter(p => p.id !== id)
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete project'
      console.error('Error deleting project:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  const getStats = () => {
    return {
      totalProjects: projects.value.length,
      activeProjects: projects.value.filter(p => p.status === 'active').length,
      pausedProjects: projects.value.filter(p => p.status === 'paused').length,
      errorProjects: projects.value.filter(p => p.status === 'error').length
    }
  }

  return {
    projects: readonly(projects),
    loading: readonly(loading),
    error: readonly(error),
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    getStats
  }
}
