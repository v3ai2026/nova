<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex">
    <Sidebar />
    <div class="flex-1 flex flex-col">
      <Header>
        <template #right>
          <ThemeToggle />
          <NotificationBell />
          <UserMenu />
        </template>
      </Header>
      <main class="flex-1 p-6 overflow-y-auto">
        <slot />
      </main>
    </div>
    <NotificationContainer />
    <Analytics />
  </div>
</template>

<script setup lang="ts">
import { Analytics } from '@vercel/analytics/vue';
</script>
