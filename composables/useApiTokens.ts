export interface ApiToken {
  id: string
  name: string
  token?: string // Only present during creation
  lastUsedAt: string | null
  createdAt: string
}

export const useApiTokens = () => {
  const tokens = ref<ApiToken[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchTokens = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<ApiToken[]>('/api/tokens')
      tokens.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch tokens'
      throw e
    } finally {
      loading.value = false
    }
  }

  const createToken = async (name: string) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<ApiToken>('/api/tokens', {
        method: 'POST',
        body: { name }
      })
      // Add to list (without the token value for security)
      tokens.value.unshift({
        id: data.id,
        name: data.name,
        lastUsedAt: null,
        createdAt: data.createdAt
      })
      return data // Return with token value for display
    } catch (e: any) {
      error.value = e.message || 'Failed to create token'
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
      tokens.value = tokens.value.filter(t => t.id !== id)
    } catch (e: any) {
      error.value = e.message || 'Failed to delete token'
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
