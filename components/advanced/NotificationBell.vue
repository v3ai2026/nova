<template>
  <Dropdown position="right">
    <template #trigger="{ isOpen }">
      <button
        class="relative p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      >
        <Bell class="w-5 h-5" />
        <span
          v-if="unreadCount > 0"
          class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
        >
          {{ unreadCount > 9 ? '9+' : unreadCount }}
        </span>
      </button>
    </template>
    <template #default="{ close }">
      <div class="py-2">
        <div class="px-4 py-2 border-b border-slate-200 dark:border-slate-800">
          <h3 class="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h3>
        </div>
        <div class="max-h-96 overflow-y-auto">
          <button
            v-for="notification in notifications"
            :key="notification.id"
            @click="handleNotificationClick(notification, close)"
            class="w-full px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
            :class="{ 'bg-blue-50 dark:bg-blue-900/10': !notification.read }"
          >
            <div class="flex items-start gap-3">
              <component :is="getIcon(notification.type)" class="w-4 h-4 mt-0.5" :class="getIconClass(notification.type)" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-slate-900 dark:text-white">
                  {{ notification.title }}
                </p>
                <p v-if="notification.message" class="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  {{ notification.message }}
                </p>
                <p class="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  {{ formatDate(notification.created_at, 'relative') }}
                </p>
              </div>
            </div>
          </button>
          <div v-if="notifications.length === 0" class="px-4 py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            No notifications
          </div>
        </div>
        <div v-if="notifications.length > 0" class="px-4 py-2 border-t border-slate-200 dark:border-slate-800">
          <button
            @click="markAllAsRead"
            class="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Mark all as read
          </button>
        </div>
      </div>
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
import { Bell, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-vue-next'
import { formatDate } from '~/utils/formatting'
import type { Notification } from '~/types'

const notifications = ref<Notification[]>([
  {
    id: '1',
    type: 'success',
    title: 'Deployment successful',
    message: 'Your app has been deployed to production',
    read: false,
    created_at: new Date(Date.now() - 300000).toISOString()
  },
  {
    id: '2',
    type: 'warning',
    title: 'Build warning',
    message: 'Found 3 warnings in your build',
    read: false,
    created_at: new Date(Date.now() - 3600000).toISOString()
  }
])

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

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

const handleNotificationClick = (notification: Notification, close: () => void) => {
  notification.read = true
  close()
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
}
</script>
