<template>
  <div class="relative inline-block" @mouseenter="show" @mouseleave="hide">
    <slot />
    <Transition name="tooltip">
      <div
        v-if="isVisible"
        :class="tooltipClasses"
        role="tooltip"
      >
        {{ text }}
        <div :class="arrowClasses" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top',
  delay: 200
})

const isVisible = ref(false)
let timer: NodeJS.Timeout | null = null

const show = () => {
  timer = setTimeout(() => {
    isVisible.value = true
  }, props.delay)
}

const hide = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  isVisible.value = false
}

const tooltipClasses = computed(() => {
  const base = 'absolute z-50 px-3 py-2 text-sm text-white bg-slate-900 dark:bg-slate-700 rounded-lg shadow-lg whitespace-nowrap'
  
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }
  
  return `${base} ${positions[props.position]}`
})

const arrowClasses = computed(() => {
  const base = 'absolute w-2 h-2 bg-slate-900 dark:bg-slate-700 transform rotate-45'
  
  const positions = {
    top: 'top-full left-1/2 -translate-x-1/2 -mt-1',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 -mb-1',
    left: 'left-full top-1/2 -translate-y-1/2 -ml-1',
    right: 'right-full top-1/2 -translate-y-1/2 -mr-1'
  }
  
  return `${base} ${positions[props.position]}`
})

onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
  }
})
</script>

<style scoped>
.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.2s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
}
</style>
