import { ref, computed } from 'vue'
import { BrowserProvider } from 'ethers'

export interface ChainRecord {
  id: string
  projectId: string
  deploymentId?: string
  txHash: string
  blockNumber?: string
  network: string
  dataHash: string
  verified: boolean
  created_at: string
}

export const useBlockchain = () => {
  const provider = ref<BrowserProvider | null>(null)
  const account = ref<string | null>(null)
  const chainId = ref<number | null>(null)
  const isConnected = computed(() => !!account.value)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const connectWallet = async () => {
    loading.value = true
    error.value = null
    
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to use blockchain features.')
      }

      const browserProvider = new BrowserProvider(window.ethereum)
      const accounts = await browserProvider.send('eth_requestAccounts', [])
      
      if (accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.')
      }

      const network = await browserProvider.getNetwork()
      
      provider.value = browserProvider
      account.value = accounts[0]
      chainId.value = Number(network.chainId)

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          account.value = accounts[0]
        }
      })

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload()
      })

      return true
    } catch (e: any) {
      error.value = e.message || 'Failed to connect wallet'
      console.error('Error connecting wallet:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  const disconnectWallet = () => {
    provider.value = null
    account.value = null
    chainId.value = null
  }

  const recordDeployment = async (projectId: string, deploymentId: string, dataHash: string) => {
    loading.value = true
    error.value = null

    try {
      if (!isConnected.value) {
        throw new Error('Wallet not connected')
      }

      const result = await $fetch<ChainRecord>('/api/blockchain/record-deployment', {
        method: 'POST',
        body: {
          projectId,
          deploymentId,
          dataHash,
          walletAddress: account.value
        }
      })

      return result
    } catch (e: any) {
      error.value = e.message || 'Failed to record deployment'
      console.error('Error recording deployment:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  const verifyDeployment = async (txHash: string) => {
    loading.value = true
    error.value = null

    try {
      const result = await $fetch<{ verified: boolean; record: ChainRecord }>(
        `/api/blockchain/verify/${txHash}`
      )
      return result
    } catch (e: any) {
      error.value = e.message || 'Failed to verify deployment'
      console.error('Error verifying deployment:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  const getProjectRecords = async (projectId: string) => {
    loading.value = true
    error.value = null

    try {
      const records = await $fetch<ChainRecord[]>(`/api/blockchain/records/${projectId}`)
      return records
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch blockchain records'
      console.error('Error fetching blockchain records:', e)
      return []
    } finally {
      loading.value = false
    }
  }

  const getNetworkName = (chainId: number) => {
    const networks: Record<number, string> = {
      1: 'Ethereum Mainnet',
      5: 'Goerli Testnet',
      11155111: 'Sepolia Testnet',
      137: 'Polygon Mainnet',
      80001: 'Mumbai Testnet'
    }
    return networks[chainId] || `Chain ID: ${chainId}`
  }

  return {
    provider,
    account,
    chainId,
    isConnected,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    recordDeployment,
    verifyDeployment,
    getProjectRecords,
    getNetworkName
  }
}
