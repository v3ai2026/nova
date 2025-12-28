<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Blockchain Integration</h1>
        <p class="text-slate-300">Verify deployments on the blockchain</p>
      </div>
      <div>
        <Button v-if="!walletConnected" @click="handleConnect" :loading="loading">
          Connect Wallet
        </Button>
        <div v-else class="flex items-center gap-3">
          <Badge variant="success">Connected</Badge>
          <span class="text-sm text-slate-400 font-mono">
            {{ walletAddress?.substring(0, 6) }}...{{ walletAddress?.substring(38) }}
          </span>
          <Button variant="ghost" size="sm" @click="handleDisconnect">
            Disconnect
          </Button>
        </div>
      </div>
    </div>

    <div v-if="!walletConnected" class="max-w-2xl mx-auto mt-12">
      <Card>
        <div class="text-center py-8">
          <div class="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet class="w-8 h-8 text-blue-500" />
          </div>
          <h3 class="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
          <p class="text-slate-400 mb-6">
            Connect your Web3 wallet to record and verify deployments on the blockchain
          </p>
          <Button @click="handleConnect" :loading="loading">
            Connect MetaMask
          </Button>
        </div>
      </Card>
    </div>

    <div v-else class="space-y-6">
      <Card>
        <template #header>
          <h2 class="text-lg font-semibold text-white">Verify Deployment</h2>
        </template>
        <form @submit.prevent="handleVerify" class="space-y-4">
          <Input
            v-model="txHash"
            label="Transaction Hash"
            placeholder="0x..."
            hint="Enter the transaction hash to verify"
          />
          <Button type="submit" :loading="verifying">
            Verify
          </Button>
        </form>
      </Card>

      <Card>
        <template #header>
          <h2 class="text-lg font-semibold text-white">Chain Records</h2>
        </template>
        <div v-if="chainRecords.length > 0" class="space-y-3">
          <div
            v-for="record in chainRecords"
            :key="record.id"
            class="p-4 bg-slate-800 rounded-lg"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="font-mono text-sm text-slate-300 mb-1">
                  {{ record.tx_hash }}
                </div>
                <div class="text-xs text-slate-500">
                  Block: {{ record.block_number || 'Pending' }} • {{ record.network }}
                </div>
              </div>
              <Badge :variant="record.verified ? 'success' : 'default'">
                {{ record.verified ? 'Verified' : 'Unverified' }}
              </Badge>
            </div>
          </div>
        </div>
        <EmptyState
          v-else
          :icon="Link"
          title="No records yet"
          description="Record your first deployment on the blockchain"
        />
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Wallet, Link } from 'lucide-vue-next'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { connectWallet, disconnectWallet, verifyOnChain, chainRecords, walletConnected, walletAddress, loading } = useBlockchain()
const { success, error: showError } = useNotification()

const txHash = ref('')
const verifying = ref(false)

const handleConnect = async () => {
  try {
    await connectWallet()
    success('Wallet connected', 'Your wallet has been connected successfully')
  } catch (e: any) {
    showError('Connection failed', e.message)
  }
}

const handleDisconnect = () => {
  disconnectWallet()
  success('Wallet disconnected', 'Your wallet has been disconnected')
}

const handleVerify = async () => {
  if (!txHash.value) return
  
  verifying.value = true
  try {
    await verifyOnChain(txHash.value)
    success('Verified', 'Transaction verified on blockchain')
    txHash.value = ''
  } catch (e: any) {
    showError('Verification failed', e.message)
  } finally {
    verifying.value = false
  }
}
</script>
