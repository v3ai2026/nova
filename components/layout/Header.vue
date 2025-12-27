<template>
  <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <slot name="left" />
      </div>
      <div class="flex items-center gap-4">
        <slot name="right" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
</script>
