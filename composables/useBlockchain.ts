import type { ChainRecord } from '~/types'

export const useBlockchain = () => {
  const walletAddress = useState<string | null>('walletAddress', () => null)
  const walletConnected = useState('walletConnected', () => false)
  const chainRecords = useState<ChainRecord[]>('chainRecords', () => [])
  const loading = useState('blockchainLoading', () => false)
  const error = useState<string | null>('blockchainError', () => null)

  const connectWallet = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed. Please install MetaMask to use blockchain features.')
      }
      
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      
      if (accounts && accounts.length > 0) {
        walletAddress.value = accounts[0]
        walletConnected.value = true
        return accounts[0]
      } else {
        throw new Error('No accounts found')
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to connect wallet'
      walletConnected.value = false
      throw e
    } finally {
      loading.value = false
    }
  }

  const disconnectWallet = () => {
    walletAddress.value = null
    walletConnected.value = false
  }

  const recordDeployment = async (
    projectId: string, 
    deploymentData: {
      txHash: string
      blockNumber?: number
      network?: string
      deploymentId?: string
      metadata?: any
    }
  ) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await $fetch<ChainRecord>('/api/blockchain/record-deployment', {
        method: 'POST',
        body: {
          projectId,
          ...deploymentData
        }
      })
      chainRecords.value = [data, ...chainRecords.value]
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to record deployment'
      throw e
    } finally {
      loading.value = false
    }
  }

  const verifyOnChain = async (txHash: string) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await $fetch<ChainRecord & { blockchainData: any }>(
        `/api/blockchain/verify/${txHash}`
      )
      
      // Update in list if exists
      const index = chainRecords.value.findIndex(r => r.tx_hash === txHash)
      if (index !== -1) {
        chainRecords.value[index] = data
      }
      
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to verify on chain'
      throw e
    } finally {
      loading.value = false
    }
  }

  const getChainRecords = async (projectId: string) => {
    loading.value = true
    error.value = null
    
    try {
      const data = await $fetch<ChainRecord[]>(
        `/api/blockchain/records/${projectId}`
      )
      chainRecords.value = data
      return data
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch chain records'
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    walletAddress: readonly(walletAddress),
    walletConnected: readonly(walletConnected),
    chainRecords: readonly(chainRecords),
    loading: readonly(loading),
    error: readonly(error),
    connectWallet,
    disconnectWallet,
    recordDeployment,
    verifyOnChain,
    getChainRecords
  }
}
