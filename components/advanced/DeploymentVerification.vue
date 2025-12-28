<template>
  <Card>
    <template #header>
      <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Deployment Verification</h3>
    </template>

    <div class="space-y-6">
      <div v-if="!wallet.connected" class="text-center py-8">
        <Shield class="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p class="text-slate-600 dark:text-slate-400 mb-4">
          Connect your wallet to verify deployments on the blockchain
        </p>
        <Button variant="secondary" @click="emit('connectWallet')">
          Connect Wallet
        </Button>
      </div>

      <div v-else>
        <div class="space-y-4">
          <Input
            v-model="deploymentId"
            label="Deployment ID"
            placeholder="Enter deployment ID to verify"
            :iconLeft="Search"
          />

          <Button
            :loading="verifying"
            :disabled="!deploymentId"
            :iconLeft="Shield"
            @click="handleVerify"
            class="w-full"
          >
            Verify Deployment
          </Button>
        </div>

        <!-- Verification Result -->
        <div v-if="verificationResult !== null" class="mt-6">
          <div
            v-if="verificationResult"
            class="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800"
          >
            <div class="flex items-start gap-3">
              <CheckCircle class="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div>
                <div class="font-medium text-green-900 dark:text-green-200">
                  Deployment Verified
                </div>
                <div class="text-sm text-green-700 dark:text-green-300 mt-1">
                  This deployment has been verified on the blockchain
                </div>
              </div>
            </div>
          </div>

          <div
            v-else
            class="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200 dark:border-yellow-800"
          >
            <div class="flex items-start gap-3">
              <AlertCircle class="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
              <div>
                <div class="font-medium text-yellow-900 dark:text-yellow-200">
                  Not Verified
                </div>
                <div class="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  This deployment has not been recorded on the blockchain
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Record Deployment -->
        <div class="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h4 class="font-medium text-slate-900 dark:text-white mb-4">
            Record New Deployment
          </h4>
          <Input
            v-model="newDeploymentId"
            label="Deployment ID"
            placeholder="Enter deployment ID to record"
            :iconLeft="FileText"
            class="mb-4"
          />
          <Button
            :loading="recording"
            :disabled="!newDeploymentId"
            :iconLeft="Shield"
            @click="handleRecord"
            class="w-full"
          >
            Record on Blockchain
          </Button>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Shield, CheckCircle, AlertCircle, Search, FileText } from 'lucide-vue-next'

interface Emits {
  (e: 'connectWallet'): void
}

const emit = defineEmits<Emits>()

const { wallet, verifyDeployment, recordDeployment } = useBlockchain()
const { success, error: errorNotif } = useNotification()

const deploymentId = ref('')
const newDeploymentId = ref('')
const verifying = ref(false)
const recording = ref(false)
const verificationResult = ref<boolean | null>(null)

const handleVerify = async () => {
  verifying.value = true
  verificationResult.value = null

  try {
    const result = await verifyDeployment(deploymentId.value)
    verificationResult.value = result
  } catch (error) {
    errorNotif('Verification failed', 'An error occurred during verification')
  } finally {
    verifying.value = false
  }
}

const handleRecord = async () => {
  recording.value = true

  try {
    const record = await recordDeployment(newDeploymentId.value, {
      timestamp: new Date().toISOString()
    })

    if (record) {
      success('Deployment recorded', 'Your deployment has been recorded on the blockchain')
      newDeploymentId.value = ''
    } else {
      errorNotif('Recording failed', 'Failed to record deployment on blockchain')
    }
  } catch (error) {
    errorNotif('Recording failed', 'An error occurred during recording')
  } finally {
    recording.value = false
  }
}
</script>
