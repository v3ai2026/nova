<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">Activity Timeline</h1>
      <p class="text-slate-300">Track all activities and events across your organization</p>
    </div>

    <!-- Activity Feed -->
    <ActivityFeed :activities="activities" />

    <!-- Load More -->
    <div v-if="hasMore" class="mt-6 text-center">
      <Button
        variant="ghost"
        :loading="loading"
        @click="loadMore"
      >
        Load More
      </Button>
    </div>

    <!-- Empty State -->
    <EmptyState
      v-if="!loading && activities.length === 0"
      :icon="Activity"
      title="No activity yet"
      description="Activity will appear here as you and your team use the platform"
    />
  </div>
</template>

<script setup lang="ts">
import { Activity } from 'lucide-vue-next'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

interface ActivityItem {
  id: string
  type: 'deployment' | 'commit' | 'user' | 'settings' | 'alert'
  title: string
  description: string
  created_at: string
  user?: string
  badge?: string
  badgeVariant?: 'success' | 'error' | 'warning' | 'info' | 'default'
}

const activities = ref<ActivityItem[]>([])
const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)

const fetchActivities = async () => {
  loading.value = true
  try {
    // TODO: Replace with actual API call
    // const response = await $fetch(`/api/activities?page=${page.value}`)
    
    // Mock data for demonstration
    const mockActivities: ActivityItem[] = [
      {
        id: `${page.value}-1`,
        type: 'deployment',
        title: 'Deployment completed',
        description: 'my-app deployed to production successfully',
        created_at: new Date(Date.now() - 300000 * page.value).toISOString(),
        user: 'John Doe',
        badge: 'Success',
        badgeVariant: 'success'
      },
      {
        id: `${page.value}-2`,
        type: 'commit',
        title: 'New commit pushed',
        description: 'Fix authentication bug in login flow',
        created_at: new Date(Date.now() - 600000 * page.value).toISOString(),
        user: 'Jane Smith'
      },
      {
        id: `${page.value}-3`,
        type: 'user',
        title: 'Team member added',
        description: 'Bob Johnson joined the team',
        created_at: new Date(Date.now() - 900000 * page.value).toISOString(),
        user: 'Admin'
      },
      {
        id: `${page.value}-4`,
        type: 'settings',
        title: 'Environment updated',
        description: 'Production environment variables updated',
        created_at: new Date(Date.now() - 1200000 * page.value).toISOString(),
        user: 'John Doe'
      },
      {
        id: `${page.value}-5`,
        type: 'deployment',
        title: 'Deployment failed',
        description: 'api-service deployment failed with build errors',
        created_at: new Date(Date.now() - 1500000 * page.value).toISOString(),
        user: 'System',
        badge: 'Failed',
        badgeVariant: 'error'
      }
    ]
    
    activities.value.push(...mockActivities)
    hasMore.value = page.value < 3 // Only show 3 pages of mock data
  } catch (error) {
    console.error('Error fetching activities:', error)
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  page.value++
  fetchActivities()
}

// Fetch initial activities
onMounted(() => {
  fetchActivities()
})
</script>
