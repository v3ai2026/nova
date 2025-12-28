<template>
  <Card>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <Wallet class="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Wallet Connection</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400">
              Connect your MetaMask wallet to record deployments on-chain
            </p>
          </div>
        </div>
      </div>
    </template>

    <div v-if="!isConnected" class="space-y-4">
      <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div class="flex items-start gap-3">
          <Info class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div class="text-sm text-blue-800 dark:text-blue-200">
            <p class="font-medium mb-1">Why connect your wallet?</p>
            <ul class="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300">
              <li>Record deployment hashes on-chain for immutable verification</li>
              <li>Prove authenticity of your deployments</li>
              <li>Enable transparent audit trails</li>
            </ul>
          </div>
        </div>
      </div>

      <Button 
        :iconLeft="Wallet" 
        @click="handleConnect"
        :loading="loading"
        fullWidth
      >
        Connect MetaMask Wallet
      </Button>

      <p v-if="error" class="text-sm text-red-600 dark:text-red-400">
        {{ error }}
      </p>
    </div>

    <div v-else class="space-y-4">
      <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <div class="flex items-center gap-3 mb-3">
          <CheckCircle class="w-5 h-5 text-green-600 dark:text-green-400" />
          <span class="font-medium text-green-900 dark:text-green-100">Wallet Connected</span>
        </div>
        
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-slate-600 dark:text-slate-400">Address:</span>
            <code class="text-slate-900 dark:text-white font-mono text-xs">
              {{ formatAddress(account) }}
            </code>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-600 dark:text-slate-400">Network:</span>
            <span class="text-slate-900 dark:text-white">
              {{ getNetworkName(chainId) }}
            </span>
          </div>
        </div>
      </div>

      <Button 
        variant="ghost" 
        :iconLeft="LogOut"
        @click="handleDisconnect"
        fullWidth
      >
        Disconnect Wallet
      </Button>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Wallet, Info, CheckCircle, LogOut } from 'lucide-vue-next'

const { 
  account, 
  chainId, 
  isConnected, 
  loading, 
  error, 
  connectWallet, 
  disconnectWallet,
  getNetworkName 
} = useBlockchain()

const { success, error: showError } = useNotification()

const handleConnect = async () => {
  const connected = await connectWallet()
  if (connected) {
    success('Wallet Connected', 'Your MetaMask wallet has been connected successfully')
  } else if (error.value) {
    showError('Connection Failed', error.value)
  }
}

const handleDisconnect = () => {
  disconnectWallet()
  success('Wallet Disconnected', 'Your wallet has been disconnected')
}

const formatAddress = (address: string | null) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
</script>
