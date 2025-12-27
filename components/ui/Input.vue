<template>
  <div class="w-full">
    <label v-if="label" :for="id" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <component
        v-if="iconLeft"
        :is="iconLeft"
        class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
      />
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      <component
        v-if="iconRight"
        :is="iconRight"
        class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
      />
    </div>
    <p v-if="error" class="mt-1.5 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>
    <p v-else-if="hint" class="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  modelValue?: string | number
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  hint?: string
  iconLeft?: any
  iconRight?: any
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  modelValue: '',
  disabled: false,
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}>()

const isFocused = ref(false)

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const inputClasses = computed(() => {
  const base = 'w-full rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-colors'
  const padding = props.iconLeft && props.iconRight
    ? 'pl-10 pr-10 py-2.5'
    : props.iconLeft
    ? 'pl-10 pr-4 py-2.5'
    : props.iconRight
    ? 'pl-4 pr-10 py-2.5'
    : 'px-4 py-2.5'
  
  const state = props.error
    ? 'border-red-300 dark:border-red-700 focus:ring-red-500 focus:border-red-500'
    : 'border-slate-300 dark:border-slate-700 focus:ring-blue-500 focus:border-blue-500'
  
  const disabled = props.disabled ? 'opacity-50 cursor-not-allowed' : ''
  
  return `${base} ${padding} ${state} ${disabled}`
})
</script>
