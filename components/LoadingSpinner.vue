<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div
      class="animate-spin rounded-full border-b-2"
      :class="[sizeClass, colorClass]"
    ></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'white' | 'slate'
  fullScreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary',
  fullScreen: false
})

const containerClass = computed(() =>
  props.fullScreen ? 'min-h-screen' : 'py-12'
)

const sizeClass = computed(() => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }
  return sizes[props.size]
})

const colorClass = computed(() => {
  const colors = {
    primary: 'border-slate-900 dark:border-white',
    white: 'border-white',
    slate: 'border-slate-600'
  }
  return colors[props.color]
})
</script>
