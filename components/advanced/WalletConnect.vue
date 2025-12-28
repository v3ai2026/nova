<template>
  <Card>
    <template #header>
      <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Wallet Connection</h3>
    </template>

    <div v-if="!wallet.connected" class="text-center py-8">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
        <Wallet class="w-8 h-8 text-white" />
      </div>
      <h4 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        Connect Your Wallet
      </h4>
      <p class="text-sm text-slate-600 dark:text-slate-400 mb-6">
        Connect your MetaMask wallet to record deployments on the blockchain
      </p>
      <Button :loading="loading" @click="handleConnect">
        Connect Wallet
      </Button>
    </div>

    <div v-else class="space-y-4">
      <div class="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
            <Check class="w-6 h-6 text-white" />
          </div>
          <div>
            <div class="font-medium text-slate-900 dark:text-white">Wallet Connected</div>
            <div class="text-sm text-slate-600 dark:text-slate-400">
              {{ formatAddress(wallet.address) }}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" @click="handleDisconnect">
          Disconnect
        </Button>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div class="text-sm text-slate-600 dark:text-slate-400 mb-1">Network</div>
          <div class="font-medium text-slate-900 dark:text-white">
            {{ getNetworkName(wallet.chainId) }}
          </div>
        </div>
        <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <div class="text-sm text-slate-600 dark:text-slate-400 mb-1">Status</div>
          <Badge variant="success">Active</Badge>
        </div>
      </div>
    </div>

    <div v-if="error" class="mt-4 p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
      <div class="flex items-start gap-3">
        <AlertCircle class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div>
          <div class="font-medium text-red-900 dark:text-red-200">Connection Error</div>
          <div class="text-sm text-red-700 dark:text-red-300 mt-1">{{ error }}</div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Wallet, Check, AlertCircle } from 'lucide-vue-next'

const { wallet, loading, error, connectWallet, disconnectWallet } = useBlockchain()
const { success, error: errorNotif } = useNotification()

const formatAddress = (address: string | null) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const getNetworkName = (chainId: number | null) => {
  const networks: Record<number, string> = {
    1: 'Ethereum Mainnet',
    5: 'Goerli Testnet',
    137: 'Polygon Mainnet',
    80001: 'Mumbai Testnet'
  }
  return chainId ? networks[chainId] || `Chain ID: ${chainId}` : 'Unknown'
}

const handleConnect = async () => {
  const result = await connectWallet()
  if (result) {
    success('Wallet connected', 'Your wallet has been connected successfully')
  } else if (error.value) {
    errorNotif('Connection failed', error.value)
  }
}

const handleDisconnect = () => {
  disconnectWallet()
  success('Wallet disconnected', 'Your wallet has been disconnected')
}
</script>
