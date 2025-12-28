<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">Blockchain Verification</h1>
      <p class="text-slate-300">Connect your wallet and verify deployments on-chain</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div>
        <WalletConnect />

        <Card class="mt-6">
          <template #header>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Benefits</h3>
          </template>
          <ul class="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <li class="flex items-start gap-2">
              <CheckCircle class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Immutable deployment records</span>
            </li>
            <li class="flex items-start gap-2">
              <CheckCircle class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Transparent audit trails</span>
            </li>
            <li class="flex items-start gap-2">
              <CheckCircle class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Cryptographic proof of authenticity</span>
            </li>
            <li class="flex items-start gap-2">
              <CheckCircle class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Decentralized verification</span>
            </li>
          </ul>
        </Card>
      </div>

      <div class="lg:col-span-2">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatsCard
            title="Total Records"
            :value="24"
            :icon="Link2"
            iconColor="purple"
          />
          <StatsCard
            title="Verified"
            :value="22"
            :icon="ShieldCheck"
            iconColor="green"
          />
          <StatsCard
            title="Pending"
            :value="2"
            :icon="Clock"
            iconColor="orange"
          />
        </div>

        <Card>
          <template #header>
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Recent Blockchain Records</h2>
          </template>

          <EmptyState
            :icon="Link2"
            title="No blockchain records yet"
            description="Start recording your deployments on-chain to see them here"
          />
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Link2, ShieldCheck, Clock, CheckCircle } from 'lucide-vue-next'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})
</script>
