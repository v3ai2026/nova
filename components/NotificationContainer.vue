<template>
  <div class="fixed top-4 right-4 z-50 space-y-3 max-w-md">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="bg-white dark:bg-slate-900 rounded-lg border shadow-lg p-4 flex items-start gap-3"
        :class="getBorderClass(notification.type)"
      >
        <component :is="getIcon(notification.type)" class="w-5 h-5 flex-shrink-0 mt-0.5" :class="getIconClass(notification.type)" />
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-semibold text-slate-900 dark:text-white">
            {{ notification.title }}
          </h4>
          <p v-if="notification.message" class="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {{ notification.message }}
          </p>
        </div>
        <button
          @click="removeNotification(notification.id)"
          class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-vue-next'

const { notifications, removeNotification } = useNotification()

const getIcon = (type: string) => {
  const icons: Record<string, any> = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info
  }
  return icons[type] || Info
}

const getIconClass = (type: string) => {
  const classes: Record<string, string> = {
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-blue-600 dark:text-blue-400'
  }
  return classes[type] || classes.info
}

const getBorderClass = (type: string) => {
  const classes: Record<string, string> = {
    success: 'border-green-200 dark:border-green-800',
    error: 'border-red-200 dark:border-red-800',
    warning: 'border-yellow-200 dark:border-yellow-800',
    info: 'border-blue-200 dark:border-blue-800'
  }
  return classes[type] || classes.info
}
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
