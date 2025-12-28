export const useBlockchain = () => {
  const connected = ref(false)
  const walletAddress = ref<string | null>(null)
  const chainId = ref<number | null>(null)
  const balance = ref<string>('0')
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 连接钱包
  const connectWallet = async () => {
    loading.value = true
    error.value = null

    try {
      if (typeof window === 'undefined' || typeof window.ethereum === 'undefined') {
        throw new Error('请安装 MetaMask 或其他 Web3 钱包')
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      
      walletAddress.value = accounts[0]
      connected.value = true

      // 获取链 ID
      const chain = await window.ethereum.request({ method: 'eth_chainId' })
      chainId.value = parseInt(chain, 16)

      // 获取余额
      const bal = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest']
      })
      balance.value = (parseInt(bal, 16) / 1e18).toFixed(4)

      // 监听账户变化
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else {
          walletAddress.value = accounts[0]
        }
      })

      // 监听链变化
      window.ethereum.on('chainChanged', (newChainId: string) => {
        chainId.value = parseInt(newChainId, 16)
        error.value = '网络已变更，请刷新页面以继续使用'
      })

    } catch (e: any) {
      error.value = e.message || '连接钱包失败'
      connected.value = false
    } finally {
      loading.value = false
    }
  }

  // 断开钱包
  const disconnectWallet = () => {
    connected.value = false
    walletAddress.value = null
    chainId.value = null
    balance.value = '0'
  }

  // 记录部署到链上
  const recordDeployment = async (projectId: string, deploymentData: any) => {
    if (!connected.value) {
      throw new Error('请先连接钱包')
    }

    loading.value = true
    try {
      // 调用后端 API 记录到链上
      const result = await $fetch('/api/blockchain/record-deployment', {
        method: 'POST',
        body: {
          projectId,
          deploymentData,
          walletAddress: walletAddress.value
        }
      })

      return result
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  // 验证链上记录
  const verifyOnChain = async (txHash: string) => {
    loading.value = true
    try {
      const result = await $fetch(`/api/blockchain/verify/${txHash}`)
      return result
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  // 获取项目的链上记录
  const getChainRecords = async (projectId: string) => {
    loading.value = true
    try {
      const records = await $fetch(`/api/blockchain/records/${projectId}`)
      return records
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    connected,
    walletAddress,
    chainId,
    balance,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    recordDeployment,
    verifyOnChain,
    getChainRecords
  }
}
