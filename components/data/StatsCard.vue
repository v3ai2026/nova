<template>
  <Card :hover="true">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-slate-600 dark:text-slate-400">{{ title }}</p>
        <p class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{{ formattedValue }}</p>
        <div v-if="trend" class="mt-2 flex items-center gap-1 text-sm">
          <component :is="trendIcon" :class="trendClasses" class="w-4 h-4" />
          <span :class="trendClasses" class="font-medium">{{ trendText }}</span>
          <span class="text-slate-500 dark:text-slate-400">vs last period</span>
        </div>
      </div>
      <div :class="iconWrapperClasses">
        <component :is="icon" class="w-6 h-6 text-white" />
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { TrendingUp, TrendingDown } from 'lucide-vue-next'
import { formatNumber } from '~/utils/formatting'

interface Props {
  title: string
  value: number
  icon: any
  iconColor?: 'blue' | 'green' | 'purple' | 'orange'
  trend?: number
  format?: 'number' | 'currency' | 'percentage'
}

const props = withDefaults(defineProps<Props>(), {
  iconColor: 'blue',
  format: 'number'
})

const formattedValue = computed(() => {
  switch (props.format) {
    case 'currency':
      return `$${formatNumber(props.value, 2)}`
    case 'percentage':
      return `${formatNumber(props.value, 1)}%`
    default:
      return formatNumber(props.value)
  }
})

const trendIcon = computed(() => {
  if (!props.trend) return null
  return props.trend > 0 ? TrendingUp : TrendingDown
})

const trendText = computed(() => {
  if (!props.trend) return ''
  const sign = props.trend > 0 ? '+' : ''
  return `${sign}${formatNumber(Math.abs(props.trend), 1)}%`
})

const trendClasses = computed(() => {
  if (!props.trend) return ''
  return props.trend > 0
    ? 'text-green-600 dark:text-green-400'
    : 'text-red-600 dark:text-red-400'
})

const iconWrapperClasses = computed(() => {
  const base = 'flex items-center justify-center w-12 h-12 rounded-lg'
  
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  }
  
  return `${base} ${colors[props.iconColor]}`
})
</script>
