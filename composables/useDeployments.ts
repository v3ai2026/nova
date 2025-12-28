import type { Deployment } from '~/types'

export const useDeployments = () => {
  const deployments = ref<Deployment[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchDeployments = async (projectId?: string) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const url = projectId ? `/api/deployments?projectId=${projectId}` : '/api/deployments'
      // const response = await $fetch(url)
      deployments.value = [
        {
          id: '1',
          project_id: projectId || '1',
          status: 'success',
          commit_hash: 'a1b2c3d',
          commit_message: 'Fix login bug',
          deployed_url: 'https://my-app.example.com',
          created_at: new Date(Date.now() - 300000).toISOString()
        },
        {
          id: '2',
          project_id: projectId || '1',
          status: 'building',
          commit_hash: 'e4f5g6h',
          commit_message: 'Add new endpoints',
          created_at: new Date(Date.now() - 600000).toISOString()
        },
        {
          id: '3',
          project_id: projectId || '2',
          status: 'failed',
          commit_hash: 'i7j8k9l',
          commit_message: 'Update dependencies',
          created_at: new Date(Date.now() - 3600000).toISOString()
        }
      ]
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch deployments'
      console.error('Error fetching deployments:', e)
    } finally {
      loading.value = false
    }
  }

  const fetchDeployment = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await $fetch(`/api/deployments/${id}`)
      return {
        id,
        project_id: '1',
        status: 'success',
        commit_hash: 'a1b2c3d',
        commit_message: 'Fix login bug',
        deployed_url: 'https://my-app.example.com',
        created_at: new Date(Date.now() - 300000).toISOString()
      } as Deployment
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch deployment'
      console.error('Error fetching deployment:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  const createDeployment = async (projectId: string, data?: Partial<Deployment>) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await $fetch('/api/deployments', { method: 'POST', body: { projectId, ...data } })
      const newDeployment: Deployment = {
        id: Date.now().toString(),
        project_id: projectId,
        status: 'pending',
        commit_hash: data?.commit_hash || 'abc123',
        commit_message: data?.commit_message || 'Manual deployment',
        created_at: new Date().toISOString()
      }
      deployments.value.unshift(newDeployment)
      return newDeployment
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create deployment'
      console.error('Error creating deployment:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  const getRecentDeployments = (limit: number = 10) => {
    return deployments.value
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit)
  }

  const getStats = () => {
    return {
      totalDeployments: deployments.value.length,
      activeDeployments: deployments.value.filter(d => d.status === 'building' || d.status === 'pending').length,
      successfulDeployments: deployments.value.filter(d => d.status === 'success').length,
      failedDeployments: deployments.value.filter(d => d.status === 'failed').length,
      successRate: deployments.value.length > 0 
        ? (deployments.value.filter(d => d.status === 'success').length / deployments.value.length) * 100 
        : 0
    }
  }

  return {
    deployments: readonly(deployments),
    loading: readonly(loading),
    error: readonly(error),
    fetchDeployments,
    fetchDeployment,
    createDeployment,
    getRecentDeployments,
    getStats
  }
}
