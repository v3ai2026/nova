<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" :class="headerClasses">
      <slot name="header" />
    </div>
    <div :class="bodyClasses">
      <slot />
    </div>
    <div v-if="$slots.footer" :class="footerClasses">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  hover?: boolean
  gradient?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  hover: false,
  gradient: false,
  padding: 'md'
})

const cardClasses = computed(() => {
  const base = 'rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden'
  const bg = props.gradient
    ? 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800'
    : 'bg-white dark:bg-slate-900'
  const hover = props.hover ? 'hover-lift cursor-pointer' : ''
  
  return `${base} ${bg} ${hover}`
})

const headerClasses = computed(() => {
  const base = 'border-b border-slate-200 dark:border-slate-800'
  const padding = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }
  
  return `${base} ${padding[props.padding]}`
})

const bodyClasses = computed(() => {
  const padding = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }
  
  return padding[props.padding]
})

const footerClasses = computed(() => {
  const base = 'border-t border-slate-200 dark:border-slate-800'
  const padding = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }
  
  return `${base} ${padding[props.padding]}`
})
</script>
