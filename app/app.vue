<template>
  <div>
    <NuxtPage />
    <NotificationContainer />
  </div>
</template>

<script setup lang="ts">
const { initAuth } = useAuth()

onMounted(() => {
  initAuth()
})
</script>
