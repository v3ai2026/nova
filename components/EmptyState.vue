<template>
  <div class="text-center py-12">
    <component :is="icon" class="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
    <h3 class="text-lg font-medium text-slate-900 dark:text-white mb-2">{{ title }}</h3>
    <p class="text-slate-600 dark:text-slate-400 mb-6">{{ description }}</p>
    <slot name="action">
      <NuxtLink
        v-if="actionText && actionLink"
        :to="actionLink"
        class="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition font-medium"
      >
        <component v-if="actionIcon" :is="actionIcon" class="w-4 h-4" />
        {{ actionText }}
      </NuxtLink>
    </slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: any
  title: string
  description: string
  actionText?: string
  actionLink?: string
  actionIcon?: any
}

defineProps<Props>()
</script>
