<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">Blockchain Management</h1>
      <p class="text-slate-300">Record and verify your deployments on the blockchain</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Wallet Connection -->
      <WalletConnect />

      <!-- Deployment Verification -->
      <DeploymentVerification @connectWallet="scrollToWallet" />
    </div>

    <!-- Blockchain Records -->
    <ChainRecords />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const scrollToWallet = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
