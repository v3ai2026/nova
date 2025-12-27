<template>
  <div>
    <div class="flex border-b border-slate-200 dark:border-slate-800">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        @click="selectTab(index)"
        :class="tabClasses(index)"
      >
        <component v-if="tab.icon" :is="tab.icon" class="w-4 h-4" />
        {{ tab.label }}
      </button>
    </div>
    <div class="mt-4">
      <slot :name="`tab-${activeTab}`" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Tab {
  label: string
  icon?: any
}

interface Props {
  tabs: Tab[]
  initialTab?: number
}

const props = withDefaults(defineProps<Props>(), {
  initialTab: 0
})

const emit = defineEmits<{
  change: [index: number]
}>()

const activeTab = ref(props.initialTab)

const selectTab = (index: number) => {
  activeTab.value = index
  emit('change', index)
}

const tabClasses = (index: number) => {
  const base = 'inline-flex items-center gap-2 px-4 py-2.5 font-medium text-sm transition-colors border-b-2'
  const active = index === activeTab.value
    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
  
  return `${base} ${active}`
}
</script>
