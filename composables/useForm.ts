interface FormRule {
  validator: (value: any) => boolean
  message: string
}

interface FormField {
  value: any
  rules: FormRule[]
  error: string | null
  touched: boolean
}

export const useForm = () => {
  const fields = ref<Record<string, FormField>>({})

  const registerField = (name: string, initialValue: any = '', rules: FormRule[] = []) => {
    fields.value[name] = {
      value: initialValue,
      rules,
      error: null,
      touched: false
    }
  }

  const setValue = (name: string, value: any) => {
    if (fields.value[name]) {
      fields.value[name].value = value
      fields.value[name].touched = true
    }
  }

  const validateField = (name: string): boolean => {
    const field = fields.value[name]
    if (!field) return true

    for (const rule of field.rules) {
      if (!rule.validator(field.value)) {
        field.error = rule.message
        return false
      }
    }

    field.error = null
    return true
  }

  const validateAll = (): boolean => {
    let isValid = true
    for (const name in fields.value) {
      if (!validateField(name)) {
        isValid = false
      }
    }
    return isValid
  }

  const reset = () => {
    for (const name in fields.value) {
      fields.value[name].value = ''
      fields.value[name].error = null
      fields.value[name].touched = false
    }
  }

  const getValues = () => {
    const values: Record<string, any> = {}
    for (const name in fields.value) {
      values[name] = fields.value[name].value
    }
    return values
  }

  const hasErrors = computed(() => {
    return Object.values(fields.value).some(field => field.error !== null)
  })

  return {
    fields,
    registerField,
    setValue,
    validateField,
    validateAll,
    reset,
    getValues,
    hasErrors
  }
}
