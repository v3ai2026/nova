<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">Blockchain Management</h1>
      <p class="text-slate-300">Connect your wallet and manage blockchain records</p>
    </div>

    <!-- Wallet Connection -->
    <Card class="mb-6">
      <template #header>
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Wallet Connection</h2>
      </template>
      <WalletConnect />
    </Card>

    <!-- Blockchain Stats -->
    <div v-if="connected" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatsCard
        title="Total Chain Records"
        :value="stats.totalChainRecords"
        :icon="Shield"
        iconColor="blue"
      />
      <StatsCard
        title="Verified Records"
        :value="stats.verifiedRecords"
        :icon="CheckCircle"
        iconColor="green"
      />
      <StatsCard
        title="Pending Verification"
        :value="stats.pendingRecords"
        :icon="Clock"
        iconColor="orange"
      />
    </div>

    <!-- All Chain Records -->
    <Card v-if="connected">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
            All Blockchain Records
          </h2>
          <Button
            variant="ghost"
            size="sm"
            :iconLeft="RefreshCw"
            @click="loadAllRecords"
            :disabled="loading"
          >
            Refresh
          </Button>
        </div>
      </template>

      <div v-if="loading" class="text-center py-12">
        <LoadingSpinner />
      </div>

      <div v-else-if="allRecords.length === 0" class="text-center py-12">
        <p class="text-slate-600 dark:text-slate-400">No blockchain records found</p>
      </div>

      <Table v-else :columns="columns" :data="allRecords">
        <template #cell-project="{ row }">
          <NuxtLink
            :to="`/projects/${row.projectId}`"
            class="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {{ row.project?.name || 'Unknown' }}
          </NuxtLink>
        </template>

        <template #cell-txHash="{ value }">
          <code class="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">
            {{ value.substring(0, 10) }}...{{ value.substring(value.length - 8) }}
          </code>
        </template>

        <template #cell-verified="{ value }">
          <Badge :variant="value ? 'success' : 'warning'">
            {{ value ? 'Verified' : 'Pending' }}
          </Badge>
        </template>

        <template #cell-createdAt="{ value }">
          <span class="text-sm text-slate-600 dark:text-slate-400">
            {{ formatDate(value, 'short') }}
          </span>
        </template>

        <template #cell-actions="{ row }">
          <Button
            v-if="!row.verified"
            variant="ghost"
            size="sm"
            @click="verifyRecord(row.txHash)"
            :disabled="verifying"
          >
            Verify
          </Button>
        </template>
      </Table>
    </Card>

    <!-- Info Card for non-connected state -->
    <Card v-else>
      <div class="text-center py-12">
        <Wallet class="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          Connect Your Wallet
        </h3>
        <p class="text-slate-600 dark:text-slate-400 mb-6">
          Connect your Web3 wallet to view and manage blockchain records
        </p>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Shield, CheckCircle, Clock, RefreshCw, Wallet } from 'lucide-vue-next'
import { formatDate } from '~/utils/formatting'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { connected, verifyOnChain } = useBlockchain()
const { success, error: notifyError } = useNotification()

const loading = ref(false)
const verifying = ref(false)
const allRecords = ref<any[]>([])

const stats = ref({
  totalChainRecords: 0,
  verifiedRecords: 0,
  pendingRecords: 0
})

const columns = [
  { key: 'project', label: 'Project' },
  { key: 'eventType', label: 'Event Type' },
  { key: 'txHash', label: 'Transaction Hash' },
  { key: 'blockNumber', label: 'Block' },
  { key: 'verified', label: 'Status' },
  { key: 'createdAt', label: 'Time' },
  { key: 'actions', label: '' }
]

const loadAllRecords = async () => {
  loading.value = true
  try {
    // In a real app, you'd have an API to fetch all chain records
    // For now, we'll simulate it
    allRecords.value = []
    
    stats.value.totalChainRecords = allRecords.value.length
    stats.value.verifiedRecords = allRecords.value.filter(r => r.verified).length
    stats.value.pendingRecords = allRecords.value.filter(r => !r.verified).length
  } catch (e: any) {
    notifyError('加载失败', e.message)
  } finally {
    loading.value = false
  }
}

const verifyRecord = async (txHash: string) => {
  verifying.value = true
  try {
    await verifyOnChain(txHash)
    success('验证成功', '链上记录已验证')
    await loadAllRecords()
  } catch (e: any) {
    notifyError('验证失败', e.message)
  } finally {
    verifying.value = false
  }
}

watch(connected, (newValue) => {
  if (newValue) {
    loadAllRecords()
  }
})

onMounted(() => {
  if (connected.value) {
    loadAllRecords()
  }
})
</script>
