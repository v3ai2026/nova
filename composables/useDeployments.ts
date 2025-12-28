import type { Deployment } from '~/types'

export const useDeployments = () => {
  const deployments = ref<Deployment[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchDeployments = async (projectId?: string) => {
    loading.value = true
    error.value = null
    try {
      const url = projectId 
        ? `/api/deployments?projectId=${projectId}`
        : '/api/deployments'
      const data = await $fetch<Deployment[]>(url)
      deployments.value = data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch deployments'
      console.error('Error fetching deployments:', e)
    } finally {
      loading.value = false
    }
  }

  const fetchDeployment = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<Deployment>(`/api/deployments/${id}`)
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch deployment'
      console.error('Error fetching deployment:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  const createDeployment = async (deploymentData: Partial<Deployment>) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<Deployment>('/api/deployments', {
        method: 'POST',
        body: deploymentData
      })
      deployments.value.unshift(data)
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to create deployment'
      console.error('Error creating deployment:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  const updateDeploymentStatus = async (id: string, status: string) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<Deployment>(`/api/deployments/${id}/status`, {
        method: 'PUT',
        body: { status }
      })
      const index = deployments.value.findIndex(d => d.id === id)
      if (index !== -1) {
        deployments.value[index] = data
      }
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to update deployment status'
      console.error('Error updating deployment status:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    deployments,
    loading,
    error,
    fetchDeployments,
    fetchDeployment,
    createDeployment,
    updateDeploymentStatus
  }
}
