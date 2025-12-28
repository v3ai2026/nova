<template>
  <Card>
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white">链上记录</h2>
        <Button
          variant="ghost"
          size="sm"
          :iconLeft="RefreshCw"
          @click="refresh"
          :disabled="loading"
        >
          刷新
        </Button>
      </div>
    </template>

    <div v-if="loading" class="text-center py-8">
      <LoadingSpinner />
    </div>

    <div v-else-if="records.length === 0" class="text-center py-8">
      <p class="text-slate-600 dark:text-slate-400">暂无链上记录</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="record in records"
        :key="record.id"
        class="p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-2">
            <Shield class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span class="font-medium text-slate-900 dark:text-white">
              {{ record.eventType }}
            </span>
            <Badge :variant="record.verified ? 'success' : 'warning'">
              {{ record.verified ? '已验证' : '待验证' }}
            </Badge>
          </div>
          <Button
            v-if="!record.verified"
            variant="ghost"
            size="sm"
            @click="verifyRecord(record.txHash)"
            :disabled="verifying"
          >
            验证
          </Button>
        </div>

        <div class="space-y-2 text-sm">
          <div class="flex items-center gap-2">
            <span class="text-slate-600 dark:text-slate-400">交易哈希:</span>
            <code class="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs">
              {{ record.txHash }}
            </code>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-slate-600 dark:text-slate-400">区块高度:</span>
            <span class="text-slate-900 dark:text-white">{{ record.blockNumber }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-slate-600 dark:text-slate-400">记录时间:</span>
            <span class="text-slate-900 dark:text-white">
              {{ formatDate(record.createdAt, 'short') }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Shield, RefreshCw } from 'lucide-vue-next'
import { formatDate } from '~/utils/formatting'

const props = defineProps<{
  projectId: string
}>()

const { getChainRecords, verifyOnChain } = useBlockchain()
const { success, error: notifyError } = useNotification()

const records = ref<any[]>([])
const loading = ref(false)
const verifying = ref(false)

const loadRecords = async () => {
  loading.value = true
  try {
    records.value = await getChainRecords(props.projectId)
  } catch (e: any) {
    notifyError('加载失败', e.message)
  } finally {
    loading.value = false
  }
}

const refresh = () => {
  loadRecords()
}

const verifyRecord = async (txHash: string) => {
  verifying.value = true
  try {
    await verifyOnChain(txHash)
    success('验证成功', '链上记录已验证')
    await loadRecords()
  } catch (e: any) {
    notifyError('验证失败', e.message)
  } finally {
    verifying.value = false
  }
}

onMounted(() => {
  loadRecords()
})
</script>
