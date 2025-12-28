export const useDeployments = () => {
  const deployments = ref<any[]>([])
  const currentDeployment = ref<any>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { success, error: notifyError } = useNotification()

  const fetchDeployments = async (projectId?: string) => {
    loading.value = true
    error.value = null
    try {
      const url = projectId 
        ? `/api/deployments?projectId=${projectId}`
        : '/api/deployments'
      deployments.value = await $fetch(url)
    } catch (e: any) {
      error.value = e.message
      notifyError('获取部署列表失败', e.message)
    } finally {
      loading.value = false
    }
  }

  const fetchDeployment = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      currentDeployment.value = await $fetch(`/api/deployments/${id}`)
      return currentDeployment.value
    } catch (e: any) {
      error.value = e.message
      notifyError('获取部署详情失败', e.message)
      throw e
    } finally {
      loading.value = false
    }
  }

  const createDeployment = async (data: any) => {
    loading.value = true
    error.value = null
    try {
      const deployment = await $fetch('/api/deployments', {
        method: 'POST',
        body: data
      })
      success('部署创建成功')
      return deployment
    } catch (e: any) {
      error.value = e.message
      notifyError('创建部署失败', e.message)
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateDeploymentStatus = async (id: string, status: string) => {
    loading.value = true
    error.value = null
    try {
      const deployment = await $fetch(`/api/deployments/${id}/status`, {
        method: 'PUT',
        body: { status }
      })
      success('部署状态更新成功')
      return deployment
    } catch (e: any) {
      error.value = e.message
      notifyError('更新部署状态失败', e.message)
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    deployments,
    currentDeployment,
    loading,
    error,
    fetchDeployments,
    fetchDeployment,
    createDeployment,
    updateDeploymentStatus
  }
}
