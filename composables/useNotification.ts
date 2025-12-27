export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export const useNotification = () => {
  const notifications = useState<Notification[]>('notifications', () => [])

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substring(7)
    const newNotification: Notification = {
      id,
      duration: 5000,
      ...notification
    }

    notifications.value.push(newNotification)

    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    return id
  }

  const removeNotification = (id: string) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  const success = (title: string, message?: string) => {
    return addNotification({ type: 'success', title, message })
  }

  const error = (title: string, message?: string) => {
    return addNotification({ type: 'error', title, message })
  }

  const warning = (title: string, message?: string) => {
    return addNotification({ type: 'warning', title, message })
  }

  const info = (title: string, message?: string) => {
    return addNotification({ type: 'info', title, message })
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info
  }
}
