<template>
  <div>
    <Button
      v-if="!connected"
      @click="handleConnect"
      :disabled="loading"
      :iconLeft="Wallet"
    >
      {{ loading ? '连接中...' : '连接钱包' }}
    </Button>
    
    <div v-else class="flex items-center gap-3">
      <div class="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <Wallet class="w-4 h-4 text-green-600 dark:text-green-400" />
        <span class="text-sm font-mono text-slate-900 dark:text-white">
          {{ formatAddress(walletAddress) }}
        </span>
        <Badge variant="success" class="ml-2">
          {{ balance }} ETH
        </Badge>
      </div>
      <Button variant="ghost" size="sm" @click="handleDisconnect">
        断开
      </Button>
    </div>

    <p v-if="error" class="mt-2 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Wallet } from 'lucide-vue-next'

const { 
  connected, 
  walletAddress, 
  balance, 
  loading, 
  error, 
  connectWallet, 
  disconnectWallet 
} = useBlockchain()

const { success, error: notifyError } = useNotification()

const formatAddress = (address: string | null) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const handleConnect = async () => {
  try {
    await connectWallet()
    success('钱包连接成功', `地址: ${formatAddress(walletAddress.value)}`)
  } catch (e: any) {
    notifyError('连接失败', e.message)
  }
}

const handleDisconnect = () => {
  disconnectWallet()
  success('钱包已断开')
}
</script>
