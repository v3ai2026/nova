<template>
  <Card>
    <template #header>
      <h2 class="text-lg font-semibold text-slate-900 dark:text-white">部署验证</h2>
    </template>

    <div class="space-y-4">
      <div v-if="deployment.chainTxHash" class="space-y-3">
        <div class="flex items-center gap-2">
          <CheckCircle class="w-5 h-5 text-green-600 dark:text-green-400" />
          <span class="font-medium text-slate-900 dark:text-white">
            已记录到区块链
          </span>
        </div>

        <div class="space-y-2 text-sm">
          <div class="flex items-center gap-2">
            <span class="text-slate-600 dark:text-slate-400">交易哈希:</span>
            <code class="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs">
              {{ deployment.chainTxHash }}
            </code>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          :iconLeft="ExternalLink"
          @click="viewOnExplorer"
        >
          在区块浏览器查看
        </Button>
      </div>

      <div v-else class="space-y-3">
        <div class="flex items-center gap-2">
          <AlertCircle class="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <span class="font-medium text-slate-900 dark:text-white">
            未记录到区块链
          </span>
        </div>

        <p class="text-sm text-slate-600 dark:text-slate-400">
          将此部署记录到区块链以获得不可篡改的部署证明。
        </p>

        <Button
          :iconLeft="Shield"
          @click="recordToChain"
          :disabled="loading || !connected"
        >
          {{ loading ? '记录中...' : '记录到链上' }}
        </Button>

        <p v-if="!connected" class="text-xs text-slate-600 dark:text-slate-400">
          请先连接钱包
        </p>
      </div>

      <p v-if="error" class="text-sm text-red-600 dark:text-red-400">
        {{ error }}
      </p>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { CheckCircle, AlertCircle, Shield, ExternalLink } from 'lucide-vue-next'

const props = defineProps<{
  deployment: any
  projectId: string
}>()

const { connected, recordDeployment, loading, error } = useBlockchain()
const { success, error: notifyError } = useNotification()

const recordToChain = async () => {
  try {
    const deploymentData = {
      deploymentId: props.deployment.id,
      commitSha: props.deployment.commitSha,
      commitMessage: props.deployment.commitMessage,
      status: props.deployment.status,
      timestamp: props.deployment.createdAt
    }

    const result = await recordDeployment(props.projectId, deploymentData)
    
    success('记录成功', `交易哈希: ${result.txHash}`)
    
    // Reload page to show updated data
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  } catch (e: any) {
    notifyError('记录失败', e.message)
  }
}

const viewOnExplorer = () => {
  // In a real app, this would open the blockchain explorer
  const explorerUrl = `https://etherscan.io/tx/${props.deployment.chainTxHash}`
  window.open(explorerUrl, '_blank')
}
</script>
