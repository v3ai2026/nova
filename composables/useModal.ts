export const useModal = () => {
  const isOpen = useState('modal-open', () => false)
  const modalData = useState('modal-data', () => null as any)

  const open = (data?: any) => {
    modalData.value = data
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
    modalData.value = null
  }

  const toggle = () => {
    isOpen.value = !isOpen.value
    if (!isOpen.value) {
      modalData.value = null
    }
  }

  return {
    isOpen,
    modalData,
    open,
    close,
    toggle
  }
}
