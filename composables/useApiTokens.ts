import type { ApiToken } from '~/types'

export const useApiTokens = () => {
  const tokens = useState<ApiToken[]>('apiTokens', () => [])
  const loading = useState('tokensLoading', () => false)
  const error = useState<string | null>('tokensError', () => null)

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

  const createToken = async (name: string, expiresIn: string = '30') => {
    loading.value = true
    error.value = null
    
    try {
      const data = await $fetch<ApiToken & { token: string }>('/api/tokens', {
        method: 'POST',
        body: {
          name,
          expiresIn
        }
      })
      
      // Don't store the token value in the list
      const { token: _, ...tokenData } = data
      tokens.value = [tokenData as ApiToken, ...tokens.value]
      
      // Return the full data including the token value (only shown once)
      return data
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

  const copyToClipboard = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token)
      return true
    } catch (e) {
      console.error('Failed to copy to clipboard:', e)
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
