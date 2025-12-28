<template>
  <Card>
    <template #header>
      <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Blockchain Records</h3>
    </template>

    <div v-if="loading" class="flex items-center justify-center py-8">
      <LoadingSpinner />
    </div>

    <div v-else-if="records.length > 0" class="space-y-4">
      <div
        v-for="record in records"
        :key="record.id"
        class="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
              <Link2 class="w-4 h-4 text-white" />
            </div>
            <div>
              <div class="font-medium text-slate-900 dark:text-white">
                Deployment #{{ record.deployment_id }}
              </div>
              <div class="text-xs text-slate-500 dark:text-slate-400">
                Block {{ record.block_number }}
              </div>
            </div>
          </div>
          <Badge :variant="record.verified ? 'success' : 'warning'">
            {{ record.verified ? 'Verified' : 'Pending' }}
          </Badge>
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-600 dark:text-slate-400">Transaction Hash:</span>
            <a
              :href="`https://etherscan.io/tx/${record.transaction_hash}`"
              target="_blank"
              class="font-mono text-blue-600 dark:text-blue-400 hover:underline"
            >
              {{ formatHash(record.transaction_hash) }}
            </a>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-600 dark:text-slate-400">Timestamp:</span>
            <span class="text-slate-900 dark:text-white">
              {{ formatDate(record.timestamp, 'short') }}
            </span>
          </div>
        </div>

        <div class="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
          <Button
            variant="ghost"
            size="sm"
            :iconLeft="ExternalLink"
            @click="viewOnExplorer(record.transaction_hash)"
          >
            View on Explorer
          </Button>
        </div>
      </div>
    </div>

    <EmptyState
      v-else
      :icon="Link2"
      title="No blockchain records"
      description="Deploy with blockchain verification to see records here"
    />
  </Card>
</template>

<script setup lang="ts">
import { Link2, ExternalLink } from 'lucide-vue-next'
import { formatDate } from '~/utils/formatting'

interface Props {
  deploymentId?: string
}

const props = defineProps<Props>()

const { records, loading, fetchRecords } = useBlockchain()

const formatHash = (hash: string) => {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`
}

const viewOnExplorer = (hash: string) => {
  window.open(`https://etherscan.io/tx/${hash}`, '_blank')
}

onMounted(() => {
  fetchRecords(props.deploymentId)
})
</script>
