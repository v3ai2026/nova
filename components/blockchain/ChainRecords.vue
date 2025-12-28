<template>
  <Card>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
            <Link2 class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Blockchain Records</h3>
        </div>
        <Badge :variant="records.length > 0 ? 'success' : 'default'">
          {{ records.length }} Record{{ records.length !== 1 ? 's' : '' }}
        </Badge>
      </div>
    </template>

    <div v-if="loading" class="flex items-center justify-center py-8">
      <LoadingSpinner />
    </div>

    <div v-else-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
      <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
    </div>

    <div v-else-if="records.length === 0">
      <EmptyState
        :icon="Link2"
        title="No blockchain records"
        description="No deployments have been recorded on-chain for this project yet"
      />
    </div>

    <div v-else class="space-y-3">
      <div 
        v-for="record in records" 
        :key="record.id"
        class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-2">
            <Badge :variant="record.verified ? 'success' : 'warning'">
              {{ record.verified ? 'Verified' : 'Pending' }}
            </Badge>
            <Badge variant="info">
              {{ record.network }}
            </Badge>
          </div>
          <span class="text-xs text-slate-500 dark:text-slate-400">
            {{ formatDate(record.created_at, 'relative') }}
          </span>
        </div>

        <div class="space-y-2 text-sm">
          <div class="flex items-center justify-between">
            <span class="text-slate-600 dark:text-slate-400">Transaction Hash:</span>
            <div class="flex items-center gap-2">
              <code class="text-xs font-mono text-slate-900 dark:text-white">
                {{ formatHash(record.txHash) }}
              </code>
              <Tooltip text="Copy transaction hash">
                <button 
                  @click="copyToClipboard(record.txHash)"
                  class="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                >
                  <Copy class="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                </button>
              </Tooltip>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-slate-600 dark:text-slate-400">Block Number:</span>
            <code class="text-xs font-mono text-slate-900 dark:text-white">
              {{ record.blockNumber ? record.blockNumber.toString() : 'N/A' }}
            </code>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-slate-600 dark:text-slate-400">Data Hash:</span>
            <code class="text-xs font-mono text-slate-900 dark:text-white">
              {{ formatHash(record.dataHash) }}
            </code>
          </div>

          <div v-if="record.deployment" class="pt-2 border-t border-slate-200 dark:border-slate-700">
            <div class="flex items-center justify-between">
              <span class="text-slate-600 dark:text-slate-400">Deployment:</span>
              <span class="text-xs font-medium text-slate-900 dark:text-white">
                {{ record.deployment.commitHash || 'N/A' }}
              </span>
            </div>
          </div>
        </div>

        <div class="mt-3 flex items-center gap-2">
          <Button 
            v-if="!record.verified"
            variant="ghost" 
            size="sm" 
            :iconLeft="Shield"
            @click="verifyRecord(record.txHash)"
          >
            Verify
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            :iconLeft="ExternalLink"
            @click="viewOnExplorer(record.txHash, record.network)"
          >
            View on Explorer
          </Button>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Link2, Copy, Shield, ExternalLink } from 'lucide-vue-next'
import { formatDate } from '~/utils/formatting'
import type { ChainRecord } from '~/composables/useBlockchain'

const props = defineProps<{
  projectId: string
}>()

const { getProjectRecords, verifyDeployment } = useBlockchain()
const { success, error: showError } = useNotification()

const records = ref<ChainRecord[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const loadRecords = async () => {
  loading.value = true
  error.value = null
  try {
    const data = await getProjectRecords(props.projectId)
    records.value = data
  } catch (e: any) {
    error.value = e.message || 'Failed to load blockchain records'
  } finally {
    loading.value = false
  }
}

const verifyRecord = async (txHash: string) => {
  const result = await verifyDeployment(txHash)
  if (result && result.verified) {
    success('Verified', 'Deployment has been verified on-chain')
    await loadRecords()
  } else {
    showError('Verification Failed', 'Failed to verify deployment')
  }
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

const viewOnExplorer = (txHash: string, network: string) => {
  const explorers: Record<string, string> = {
    ethereum: 'https://etherscan.io/tx/',
    polygon: 'https://polygonscan.com/tx/',
    goerli: 'https://goerli.etherscan.io/tx/',
    sepolia: 'https://sepolia.etherscan.io/tx/'
  }
  
  const explorerUrl = explorers[network.toLowerCase()] || explorers.ethereum
  window.open(`${explorerUrl}${txHash}`, '_blank')
}

onMounted(() => {
  loadRecords()
})
</script>
