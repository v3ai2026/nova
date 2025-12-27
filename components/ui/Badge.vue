<template>
  <span :class="badgeClasses">
    <component v-if="icon" :is="icon" class="w-3 h-3" />
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'success' | 'error' | 'warning' | 'info' | 'default'
  icon?: any
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
})

const badgeClasses = computed(() => {
  const base = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium'
  
  const variants = {
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    default: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
  }
  
  return `${base} ${variants[props.variant]}`
})
</script>
