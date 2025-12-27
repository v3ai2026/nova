<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
    <Sidebar>
      <template #footer>
        <slot name="sidebar-footer" />
      </template>
    </Sidebar>
    <div class="flex-1 flex flex-col overflow-hidden">
      <Header>
        <template #left>
          <slot name="header-left" />
        </template>
        <template #right>
          <slot name="header-right" />
        </template>
      </Header>
      <main class="flex-1 p-6 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
