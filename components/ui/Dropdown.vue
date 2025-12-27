<template>
  <div class="relative inline-block" ref="dropdownRef">
    <div @click="toggle">
      <slot name="trigger" :isOpen="isOpen" />
    </div>
    <Transition name="dropdown">
      <div
        v-if="isOpen"
        :class="dropdownClasses"
      >
        <slot :close="close" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

interface Props {
  position?: 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  position: 'right'
})

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggle = () => {
  isOpen.value = !isOpen.value
}

const close = () => {
  isOpen.value = false
}

onClickOutside(dropdownRef, close)

const dropdownClasses = computed(() => {
  const base = 'absolute top-full mt-2 w-56 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg py-1 z-50'
  const position = props.position === 'left' ? 'left-0' : 'right-0'
  
  return `${base} ${position}`
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
