export const useApiTokens = () => {
  const tokens = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { success, error: notifyError } = useNotification()

  const fetchTokens = async () => {
    loading.value = true
    error.value = null
    try {
      tokens.value = await $fetch('/api/tokens')
    } catch (e: any) {
      error.value = e.message
      notifyError('获取令牌失败', e.message)
    } finally {
      loading.value = false
    }
  }

  const createToken = async (name: string) => {
    loading.value = true
    error.value = null
    try {
      const token = await $fetch('/api/tokens', {
        method: 'POST',
        body: { name }
      })
      success('令牌创建成功')
      await fetchTokens()
      return token
    } catch (e: any) {
      error.value = e.message
      notifyError('创建令牌失败', e.message)
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteToken = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await $fetch(`/api/tokens/${id}`, {
        method: 'DELETE'
      })
      success('令牌删除成功')
      await fetchTokens()
    } catch (e: any) {
      error.value = e.message
      notifyError('删除令牌失败', e.message)
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    tokens,
    loading,
    error,
    fetchTokens,
    createToken,
    deleteToken
  }
}
