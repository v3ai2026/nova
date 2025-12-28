# Data Flow Documentation

## Overview
This document describes how data flows through the DeployHub application, from user actions to database persistence and back.

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Data Flow Patterns](#data-flow-patterns)
3. [User → Composable → API → Database](#user--composable--api--database)
4. [State Management](#state-management)
5. [Synchronization Strategies](#synchronization-strategies)
6. [Complete Implementation Examples](#complete-implementation-examples)

---

## Architecture Overview

### Layers

```
┌─────────────────────────────────────────┐
│         Vue Components (UI)             │
│  - Forms, Tables, Modals, Cards         │
└─────────────┬───────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────┐
│       Composables (Logic Layer)         │
│  - useProjects, useDeployments, etc.    │
└─────────────┬───────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────┐
│         API Routes (Server)             │
│  - /api/projects, /api/deployments      │
└─────────────┬───────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────┐
│        Database (PostgreSQL)            │
│  - Prisma ORM, Supabase                 │
└─────────────────────────────────────────┘
```

### Request/Response Flow

```
User Action
    ↓
Component Event Handler
    ↓
Composable Method Call
    ↓
HTTP Request ($fetch)
    ↓
API Route Handler
    ↓
Database Query (Prisma)
    ↓
Database Response
    ↓
API Response
    ↓
Composable State Update
    ↓
Component Re-render
```

---

## Data Flow Patterns

### 1. Read Pattern (Fetching Data)

```
User navigates to page
    ↓
Component mounted
    ↓
Call composable fetch method
    ↓
API GET request
    ↓
Database SELECT query
    ↓
Data returned to composable
    ↓
State updated (reactive)
    ↓
Component displays data
```

**Example:**
```typescript
// Component
onMounted(() => {
  fetchProjects() // Trigger fetch
})

// Composable updates state
projects.value = response.projects

// Component reactively shows updated data
```

### 2. Write Pattern (Creating/Updating Data)

```
User fills form
    ↓
User clicks submit
    ↓
Component validates data
    ↓
Call composable create/update method
    ↓
API POST/PUT request
    ↓
Database INSERT/UPDATE query
    ↓
New/updated record returned
    ↓
State updated with new data
    ↓
Component shows success message
    ↓
Navigate to detail page
```

**Example:**
```typescript
// User submits form
const handleSubmit = async () => {
  const project = await createProject(formData)
  if (project) {
    success('Created!', 'Project created successfully')
    navigateTo(`/projects/${project.id}`)
  }
}
```

### 3. Delete Pattern

```
User clicks delete
    ↓
Confirmation modal shown
    ↓
User confirms
    ↓
Call composable delete method
    ↓
API DELETE request
    ↓
Database DELETE query
    ↓
Success response
    ↓
Remove item from local state
    ↓
Component re-renders without item
```

---

## User → Composable → API → Database

### Complete Flow Example: Creating a Project

#### 1. User Interaction (Component)

```vue
<!-- pages/projects/new.vue -->
<template>
  <form @submit.prevent="handleSubmit">
    <Input v-model="form.name" label="Project Name" />
    <Input v-model="form.repository_url" label="Repository URL" />
    <Button type="submit" :loading="loading">
      Create Project
    </Button>
  </form>
</template>

<script setup lang="ts">
const { createProject, loading, error } = useProjects()
const { success, error: errorNotif } = useNotification()

const form = ref({
  name: '',
  repository_url: ''
})

const handleSubmit = async () => {
  // Validate
  if (!form.value.name) {
    errorNotif('Validation Error', 'Project name is required')
    return
  }
  
  // Call composable
  const project = await createProject(form.value)
  
  if (project) {
    success('Success', 'Project created successfully')
    navigateTo(`/projects/${project.id}`)
  } else {
    errorNotif('Error', error.value || 'Failed to create project')
  }
}
</script>
```

#### 2. Composable Logic Layer

```typescript
// composables/useProjects.ts
export const useProjects = () => {
  const projects = ref<Project[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const createProject = async (data: Partial<Project>) => {
    loading.value = true
    error.value = null
    
    try {
      // Make API request
      const response = await $fetch('/api/projects', {
        method: 'POST',
        body: data
      })
      
      // Update local state
      projects.value.push(response.project)
      
      return response.project
    } catch (e) {
      error.value = e.message
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    projects: readonly(projects),
    loading: readonly(loading),
    error: readonly(error),
    createProject
  }
}
```

#### 3. API Route Handler

```typescript
// server/api/projects.post.ts
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  // Get user from auth middleware
  const user = event.context.user
  
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }
  
  // Parse request body
  const body = await readBody(event)
  
  // Validate
  if (!body.name) {
    throw createError({
      statusCode: 400,
      message: 'Project name is required'
    })
  }
  
  // Create slug
  const slug = body.name.toLowerCase().replace(/\s+/g, '-')
  
  // Check if slug exists
  const existing = await prisma.project.findUnique({
    where: { slug }
  })
  
  if (existing) {
    throw createError({
      statusCode: 409,
      message: 'Project with this name already exists'
    })
  }
  
  // Create project in database
  const project = await prisma.project.create({
    data: {
      name: body.name,
      slug,
      description: body.description,
      repositoryUrl: body.repository_url,
      userId: user.id,
      status: 'active'
    }
  })
  
  // Return response
  return {
    project: {
      id: project.id,
      name: project.name,
      slug: project.slug,
      description: project.description,
      repository_url: project.repositoryUrl,
      status: project.status,
      created_at: project.createdAt.toISOString(),
      updated_at: project.updatedAt.toISOString()
    }
  }
})
```

#### 4. Database Layer

```typescript
// Prisma generates type-safe queries
await prisma.project.create({
  data: {
    name: 'My Project',
    slug: 'my-project',
    userId: 'user_123',
    status: 'active'
  }
})

// SQL executed:
// INSERT INTO projects (id, name, slug, user_id, status, created_at, updated_at)
// VALUES ('proj_abc', 'My Project', 'my-project', 'user_123', 'active', NOW(), NOW())
// RETURNING *
```

---

## State Management

### Reactive State Pattern

```typescript
// Composable maintains reactive state
const projects = ref<Project[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Components can watch this state
watch(projects, (newProjects) => {
  console.log('Projects updated:', newProjects.length)
})

// Multiple components can share the same state
const { projects } = useProjects()
```

### Read-Only Exports

```typescript
// Prevent external modification
return {
  projects: readonly(projects),
  loading: readonly(loading),
  error: readonly(error),
  createProject  // Methods can mutate internal state
}
```

### Computed Derived State

```typescript
const { projects } = useProjects()

const activeProjects = computed(() => 
  projects.value.filter(p => p.status === 'active')
)

const projectCount = computed(() => projects.value.length)
```

---

## Synchronization Strategies

### 1. Optimistic Updates

Update UI immediately, rollback on error:

```typescript
const deleteProject = async (id: string) => {
  // Save current state
  const backup = [...projects.value]
  
  // Optimistic update
  projects.value = projects.value.filter(p => p.id !== id)
  
  try {
    await $fetch(`/api/projects/${id}`, { method: 'DELETE' })
  } catch (error) {
    // Rollback on error
    projects.value = backup
    throw error
  }
}
```

### 2. Pessimistic Updates

Wait for server confirmation before updating UI:

```typescript
const deleteProject = async (id: string) => {
  loading.value = true
  
  try {
    // Wait for server
    await $fetch(`/api/projects/${id}`, { method: 'DELETE' })
    
    // Update UI only on success
    projects.value = projects.value.filter(p => p.id !== id)
  } catch (error) {
    console.error('Delete failed:', error)
  } finally {
    loading.value = false
  }
}
```

### 3. Real-Time Updates

Use WebSockets or polling for live data:

```typescript
// WebSocket approach
const ws = new WebSocket('ws://localhost:3000/ws')

ws.onmessage = (event) => {
  const update = JSON.parse(event.data)
  
  if (update.type === 'deployment_status') {
    // Update local state
    const deployment = deployments.value.find(d => d.id === update.id)
    if (deployment) {
      deployment.status = update.status
    }
  }
}

// Polling approach
const pollDeployments = () => {
  setInterval(async () => {
    const { deployments: latest } = await $fetch('/api/deployments')
    deployments.value = latest
  }, 5000) // Poll every 5 seconds
}
```

### 4. Cache Invalidation

Refresh data after mutations:

```typescript
const createProject = async (data: Partial<Project>) => {
  const project = await $fetch('/api/projects', {
    method: 'POST',
    body: data
  })
  
  // Invalidate cache - refetch all projects
  await fetchProjects()
  
  return project
}
```

---

## Complete Implementation Examples

### Example 1: Project List with Search

```vue
<template>
  <div>
    <!-- Search -->
    <SearchBar v-model="searchQuery" />
    
    <!-- Loading -->
    <LoadingSpinner v-if="loading" />
    
    <!-- Projects -->
    <div v-else-if="filteredProjects.length > 0">
      <ProjectCard
        v-for="project in filteredProjects"
        :key="project.id"
        :project="project"
        @delete="handleDelete"
      />
    </div>
    
    <!-- Empty -->
    <EmptyState v-else title="No projects found" />
  </div>
</template>

<script setup lang="ts">
const { projects, loading, fetchProjects, deleteProject } = useProjects()
const searchQuery = ref('')

// Computed filtered list
const filteredProjects = computed(() => {
  if (!searchQuery.value) return projects.value
  
  const query = searchQuery.value.toLowerCase()
  return projects.value.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.description?.toLowerCase().includes(query)
  )
})

// Handle delete
const handleDelete = async (project: Project) => {
  if (!confirm(`Delete ${project.name}?`)) return
  
  await deleteProject(project.id)
}

// Fetch on mount
onMounted(() => {
  fetchProjects()
})
</script>
```

### Example 2: Deployment Status with Real-Time Updates

```vue
<template>
  <Card>
    <template #header>
      <h3>Latest Deployment</h3>
    </template>
    
    <div v-if="latestDeployment">
      <Badge :variant="getStatusVariant(latestDeployment.status)">
        {{ latestDeployment.status }}
      </Badge>
      
      <p>{{ latestDeployment.commit_message }}</p>
      
      <!-- Progress for building deployments -->
      <div v-if="latestDeployment.status === 'building'" class="mt-4">
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-500 h-2 rounded-full transition-all"
            :style="{ width: `${progress}%` }"
          />
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
const { deployments, fetchDeployments } = useDeployments()

const latestDeployment = computed(() => 
  deployments.value[0] || null
)

const progress = ref(0)

// Poll for updates on building deployments
const pollInterval = ref<NodeJS.Timer>()

watch(latestDeployment, (deployment) => {
  if (deployment?.status === 'building') {
    // Start polling
    pollInterval.value = setInterval(async () => {
      await fetchDeployments()
      progress.value = Math.min(progress.value + 10, 90)
    }, 2000)
  } else {
    // Stop polling
    if (pollInterval.value) {
      clearInterval(pollInterval.value)
      progress.value = 100
    }
  }
})

onMounted(() => {
  fetchDeployments()
})

onUnmounted(() => {
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
  }
})

const getStatusVariant = (status: string) => {
  const variants = {
    success: 'success',
    building: 'info',
    failed: 'error'
  }
  return variants[status] || 'default'
}
</script>
```

### Example 3: Form with Validation and Error Handling

```vue
<template>
  <Card>
    <form @submit.prevent="handleSubmit">
      <Input
        v-model="form.name"
        label="Project Name"
        :error="errors.name"
        required
      />
      
      <Input
        v-model="form.repository_url"
        label="Repository URL"
        type="url"
        :error="errors.repository_url"
      />
      
      <div class="flex gap-3">
        <Button
          type="submit"
          :loading="loading"
          :disabled="!isValid"
        >
          Create Project
        </Button>
        <Button
          type="button"
          variant="ghost"
          @click="navigateTo('/projects')"
        >
          Cancel
        </Button>
      </div>
    </form>
  </Card>
</template>

<script setup lang="ts">
const { createProject, loading, error } = useProjects()
const { success, error: errorNotif } = useNotification()

const form = ref({
  name: '',
  repository_url: ''
})

const errors = ref({
  name: '',
  repository_url: ''
})

// Client-side validation
const isValid = computed(() => {
  return form.value.name.length >= 3 && !errors.value.name
})

const validate = () => {
  errors.value = { name: '', repository_url: '' }
  
  if (form.value.name.length < 3) {
    errors.value.name = 'Name must be at least 3 characters'
    return false
  }
  
  if (form.value.repository_url && !form.value.repository_url.match(/^https?:\/\/.+/)) {
    errors.value.repository_url = 'Must be a valid URL'
    return false
  }
  
  return true
}

const handleSubmit = async () => {
  if (!validate()) return
  
  const project = await createProject(form.value)
  
  if (project) {
    success('Success', `${project.name} created successfully`)
    navigateTo(`/projects/${project.id}`)
  } else {
    errorNotif('Error', error.value || 'Failed to create project')
  }
}

// Watch for changes to clear errors
watch(() => form.value.name, () => {
  errors.value.name = ''
})
</script>
```

---

## Best Practices

### 1. Always Handle Loading States
```typescript
const { loading } = useProjects()

// Show loading spinner
if (loading.value) {
  // render loading UI
}
```

### 2. Always Handle Errors
```typescript
const { error } = useProjects()

if (error.value) {
  errorNotif('Error', error.value)
}
```

### 3. Use Computed for Derived Data
```typescript
const activeProjects = computed(() => 
  projects.value.filter(p => p.status === 'active')
)
```

### 4. Cleanup on Unmount
```typescript
onUnmounted(() => {
  if (pollInterval.value) {
    clearInterval(pollInterval.value)
  }
})
```

### 5. Validate Before Submitting
```typescript
const handleSubmit = async () => {
  if (!validate()) return
  
  await createProject(form.value)
}
```

---

## Performance Considerations

1. **Debounce search inputs** to avoid excessive API calls
2. **Cache frequently accessed data** in composables
3. **Use pagination** for large datasets
4. **Lazy load** data when tabs/sections are opened
5. **Optimize re-renders** with computed properties

---

## Security Considerations

1. **Always authenticate** on the server side
2. **Validate input** both client and server side
3. **Sanitize data** before displaying
4. **Use HTTPS** for API requests
5. **Implement rate limiting** on API endpoints
