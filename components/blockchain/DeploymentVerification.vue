<template>
  <Card>
    <template #header>
      <div class="flex items-center gap-3">
        <div class="p-2 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg">
          <ShieldCheck class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Deployment Verification</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            Record and verify your deployment on blockchain
          </p>
        </div>
      </div>
    </template>

    <div v-if="!isConnected" class="space-y-4">
      <div class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
        <div class="flex items-start gap-3">
          <AlertTriangle class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div class="text-sm text-amber-800 dark:text-amber-200">
            <p class="font-medium">Wallet Required</p>
            <p class="mt-1">Please connect your MetaMask wallet to record this deployment on-chain.</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="space-y-4">
      <div v-if="deployment" class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <h4 class="font-medium text-slate-900 dark:text-white mb-3">Deployment Details</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-slate-600 dark:text-slate-400">Status:</span>
            <Badge :variant="getStatusVariant(deployment.status)">
              {{ deployment.status }}
            </Badge>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-600 dark:text-slate-400">Commit:</span>
            <code class="text-xs font-mono text-slate-900 dark:text-white">
              {{ deployment.commit_hash || 'N/A' }}
            </code>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-600 dark:text-slate-400">Time:</span>
            <span class="text-slate-900 dark:text-white">
              {{ formatDate(deployment.created_at, 'short') }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="!isRecorded" class="space-y-3">
        <p class="text-sm text-slate-600 dark:text-slate-400">
          Recording this deployment on-chain will create an immutable record that can be verified by anyone.
        </p>
        
        <Button 
          :iconLeft="ShieldCheck"
          @click="handleRecordDeployment"
          :loading="loading"
          :disabled="!deployment || deployment.status !== 'success'"
          fullWidth
        >
          Record on Blockchain
        </Button>

        <p v-if="deployment && deployment.status !== 'success'" class="text-xs text-amber-600 dark:text-amber-400 text-center">
          Only successful deployments can be recorded on-chain
        </p>
      </div>

      <div v-else class="space-y-3">
        <div class="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <div class="flex items-center gap-3 mb-3">
            <CheckCircle class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span class="font-medium text-emerald-900 dark:text-emerald-100">
              Recorded on Blockchain
            </span>
          </div>
          
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-slate-600 dark:text-slate-400">Transaction:</span>
              <div class="flex items-center gap-2">
                <code class="text-xs font-mono text-slate-900 dark:text-white">
                  {{ formatHash(chainRecord!.txHash) }}
                </code>
                <button 
                  @click="copyToClipboard(chainRecord!.txHash)"
                  class="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                >
                  <Copy class="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-600 dark:text-slate-400">Network:</span>
              <span class="text-slate-900 dark:text-white">
                {{ chainRecord!.network }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-600 dark:text-slate-400">Verified:</span>
              <Badge :variant="chainRecord!.verified ? 'success' : 'warning'">
                {{ chainRecord!.verified ? 'Yes' : 'Pending' }}
              </Badge>
            </div>
          </div>
        </div>

        <Button 
          variant="ghost" 
          :iconLeft="ExternalLink"
          @click="viewOnExplorer"
          fullWidth
        >
          View on Block Explorer
        </Button>
      </div>

      <p v-if="error" class="text-sm text-red-600 dark:text-red-400">
        {{ error }}
      </p>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ShieldCheck, AlertTriangle, CheckCircle, Copy, ExternalLink } from 'lucide-vue-next'
import { formatDate } from '~/utils/formatting'
import { createHash } from 'crypto'
import type { Deployment } from '~/types'
import type { ChainRecord } from '~/composables/useBlockchain'

const props = defineProps<{
  projectId: string
  deploymentId: string
  deployment?: Deployment
}>()

const { 
  isConnected, 
  loading, 
  error, 
  recordDeployment 
} = useBlockchain()

const { success, error: showError } = useNotification()

const chainRecord = ref<ChainRecord | null>(null)
const isRecorded = computed(() => !!chainRecord.value)

const handleRecordDeployment = async () => {
  if (!props.deployment) return

  // Create data hash from deployment info
  const dataString = `${props.deployment.id}${props.deployment.commit_hash}${props.deployment.status}`
  const dataHash = `0x${Buffer.from(dataString).toString('hex')}`

  const record = await recordDeployment(
    props.projectId,
    props.deploymentId,
    dataHash
  )

  if (record) {
    chainRecord.value = record
    success('Recorded', 'Deployment has been recorded on blockchain')
  } else if (error.value) {
    showError('Recording Failed', error.value)
  }
}

const getStatusVariant = (status: string) => {
  const variants: Record<string, any> = {
    success: 'success',
    building: 'info',
    pending: 'warning',
    failed: 'error'
  }
  return variants[status] || 'default'
}

const formatHash = (hash: string) => {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    success('Copied', 'Transaction hash copied to clipboard')
  } catch {
    showError('Failed', 'Failed to copy to clipboard')
  }
}

const viewOnExplorer = () => {
  if (!chainRecord.value) return
  
  const explorers: Record<string, string> = {
    ethereum: 'https://etherscan.io/tx/',
    polygon: 'https://polygonscan.com/tx/'
  }
  
  const explorerUrl = explorers[chainRecord.value.network.toLowerCase()] || explorers.ethereum
  window.open(`${explorerUrl}${chainRecord.value.txHash}`, '_blank')
}

// Check if deployment is already recorded
onMounted(async () => {
  // In a real implementation, fetch existing chain records for this deployment
})
</script>
