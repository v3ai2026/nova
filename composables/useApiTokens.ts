export interface ApiToken {
  id: string
  name: string
  token: string
  userId: string
  lastUsedAt?: string
  expiresAt?: string
  created_at: string
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
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch tokens'
      console.error('Error fetching tokens:', e)
    } finally {
      loading.value = false
    }
  }

  const createToken = async (name: string, expiresAt?: string) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<ApiToken>('/api/tokens', {
        method: 'POST',
        body: { name, expiresAt }
      })
      tokens.value.push(data)
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to create token'
      console.error('Error creating token:', e)
      return null
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
      return true
    } catch (e: any) {
      error.value = e.message || 'Failed to delete token'
      console.error('Error deleting token:', e)
      return false
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
