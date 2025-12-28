import type { Deployment } from '~/types'

export const useDeployments = () => {
  const deployments = useState<Deployment[]>('deployments', () => [])
  const currentDeployment = useState<Deployment | null>('currentDeployment', () => null)
  const loading = useState('deploymentsLoading', () => false)
  const error = useState<string | null>('deploymentsError', () => null)

  const fetchDeployments = async (projectId?: string) => {
    loading.value = true
    error.value = null
    
    try {
      const url = projectId 
        ? `/api/deployments?projectId=${projectId}` 
        : '/api/deployments'
      const data = await $fetch<Deployment[]>(url)
      deployments.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch deployments'
      throw e
    } finally {
      loading.value = false
    }
  }

  const fetchDeployment = async (id: string) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await $fetch<Deployment>(`/api/deployments/${id}`)
      currentDeployment.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch deployment'
      throw e
    } finally {
      loading.value = false
    }
  }

  const createDeployment = async (projectId: string, deploymentData?: {
    commit_hash?: string
    commit_message?: string
  }) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await $fetch<Deployment>('/api/deployments', {
        method: 'POST',
        body: {
          projectId,
          ...deploymentData
        }
      })
      deployments.value = [data, ...deployments.value]
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to create deployment'
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateDeploymentStatus = async (
    id: string, 
    status: 'pending' | 'building' | 'success' | 'failed',
    updates?: {
      deployed_url?: string
      build_logs?: string
    }
  ) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await $fetch<Deployment>(`/api/deployments/${id}/status`, {
        method: 'PUT',
        body: {
          status,
          ...updates
        }
      })
      
      // Update in list
      const index = deployments.value.findIndex(d => d.id === id)
      if (index !== -1) {
        deployments.value[index] = data
      }
      
      // Update current if it's the same deployment
      if (currentDeployment.value?.id === id) {
        currentDeployment.value = data
      }
      
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to update deployment status'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    deployments: readonly(deployments),
    currentDeployment: readonly(currentDeployment),
    loading: readonly(loading),
    error: readonly(error),
    fetchDeployments,
    fetchDeployment,
    createDeployment,
    updateDeploymentStatus
  }
}
