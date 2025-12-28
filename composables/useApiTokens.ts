export interface ApiToken {
  id: string
  name: string
  token: string
  created_at: string
  last_used?: string
  expires_at?: string
}

export const useApiTokens = () => {
  const tokens = ref<ApiToken[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchTokens = async () => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await $fetch('/api/tokens')
      tokens.value = [
        {
          id: '1',
          name: 'Production Deploy',
          token: 'dp_xxxxxxxxxxxxxxxx',
          created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
          last_used: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '2',
          name: 'CI/CD Pipeline',
          token: 'dp_yyyyyyyyyyyyyyyy',
          created_at: new Date(Date.now() - 86400000 * 60).toISOString(),
          last_used: new Date(Date.now() - 7200000).toISOString()
        }
      ]
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch API tokens'
      console.error('Error fetching API tokens:', e)
    } finally {
      loading.value = false
    }
  }

  const createToken = async (name: string) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // const response = await $fetch('/api/tokens', { method: 'POST', body: { name } })
      const newToken: ApiToken = {
        id: Date.now().toString(),
        name,
        token: `dp_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        created_at: new Date().toISOString()
      }
      tokens.value.push(newToken)
      return newToken
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create API token'
      console.error('Error creating API token:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteToken = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      // await $fetch(`/api/tokens/${id}`, { method: 'DELETE' })
      tokens.value = tokens.value.filter(t => t.id !== id)
      return true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete API token'
      console.error('Error deleting API token:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  const copyToClipboard = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token)
      return true
    } catch (e) {
      console.error('Error copying to clipboard:', e)
      return false
    }
  }

  return {
    tokens: readonly(tokens),
    loading: readonly(loading),
    error: readonly(error),
    fetchTokens,
    createToken,
    deleteToken,
    copyToClipboard
  }
}
