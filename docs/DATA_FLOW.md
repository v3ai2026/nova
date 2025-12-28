# Data Flow Documentation

Understanding how data flows through the DeployHub application.

## Architecture Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│  Composable │────▶│   API       │────▶│  Database   │
│   (Vue)     │◀────│  (Logic)    │◀────│  (Server)   │◀────│  (Prisma)   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

## Data Flow Layers

### 1. Presentation Layer (Pages & Components)

**Location**: `pages/`, `components/`

- Vue components render UI
- Call composables for data operations
- Handle user interactions
- Display loading states and errors

**Example**:
```vue
<script setup>
const { projects, loading, fetchProjects } = useProjects()

onMounted(() => {
  fetchProjects()
})
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else>{{ projects.length }} projects</div>
</template>
```

### 2. Logic Layer (Composables)

**Location**: `composables/`

- Manage application state
- Handle API calls
- Provide reactive data
- Abstract business logic

**Example**:
```typescript
// composables/useProjects.ts
export const useProjects = () => {
  const projects = ref([])
  
  const fetchProjects = async () => {
    const data = await $fetch('/api/projects')
    projects.value = data
  }
  
  return { projects, fetchProjects }
}
```

### 3. API Layer (Server Routes)

**Location**: `server/api/`

- Handle HTTP requests
- Validate input data
- Call database through Prisma
- Return formatted responses

**Example**:
```typescript
// server/api/projects/index.ts
export default defineEventHandler(async (event) => {
  const projects = await prisma.project.findMany()
  return projects
})
```

### 4. Data Layer (Database)

**Location**: `prisma/`

- PostgreSQL database (Neon)
- Prisma ORM for type-safe queries
- Managed through migrations

---

## Common Data Flows

### Creating a Project

```
User Input (Form)
    ↓
Page Component validates input
    ↓
useProjects().createProject(data)
    ↓
POST /api/projects
    ↓
prisma.project.create(data)
    ↓
PostgreSQL Database
    ↓
Response with new project
    ↓
Update composable state
    ↓
UI updates reactively
```

**Code Flow**:
```typescript
// 1. Page component
const handleCreate = async () => {
  const project = await createProject(formData)
  if (project) {
    navigateTo(`/projects/${project.id}`)
  }
}

// 2. Composable
const createProject = async (data) => {
  const project = await $fetch('/api/projects', {
    method: 'POST',
    body: data
  })
  projects.value.push(project)
  return project
}

// 3. API endpoint
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const project = await prisma.project.create({
    data: body
  })
  return project
})
```

### Fetching Projects

```
Page Mount
    ↓
useProjects().fetchProjects()
    ↓
GET /api/projects
    ↓
prisma.project.findMany()
    ↓
PostgreSQL Database
    ↓
Array of projects
    ↓
Update reactive state
    ↓
Template re-renders
```

### Blockchain Recording

```
Successful Deployment
    ↓
User clicks "Record on Blockchain"
    ↓
useBlockchain().connectWallet()
    ↓
MetaMask Connection
    ↓
useBlockchain().recordDeployment()
    ↓
POST /api/blockchain/record-deployment
    ↓
Create transaction hash
    ↓
prisma.chainRecord.create()
    ↓
Store in database
    ↓
Return chain record
    ↓
Update UI with tx hash
```

---

## State Management

### Reactive State

All data is reactive using Vue 3's composition API:

```typescript
const projects = ref([])        // Reactive array
const loading = ref(false)      // Reactive boolean
const error = ref(null)         // Reactive error

// Computed values
const activeProjects = computed(() => 
  projects.value.filter(p => p.status === 'active')
)
```

### Global State

- **User Authentication**: `useAuth()` - Available app-wide
- **Notifications**: `useNotification()` - Toast messages
- **Theme**: `useTheme()` - Dark/light mode

### Local State

- Component-specific state lives in components
- Form data, modal state, UI toggles
- Not shared between components

---

## API Communication

### Request Flow

```typescript
// Client-side composable
const { data } = await $fetch('/api/projects', {
  method: 'POST',
  body: { name: 'Project' },
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

### Error Handling

```typescript
try {
  const data = await $fetch('/api/projects')
} catch (e) {
  if (e.statusCode === 404) {
    // Handle not found
  } else if (e.statusCode === 500) {
    // Handle server error
  }
}
```

---

## Database Operations

### Prisma Queries

**Create**:
```typescript
const project = await prisma.project.create({
  data: {
    name: 'Project',
    userId: 'user-id'
  }
})
```

**Read**:
```typescript
const projects = await prisma.project.findMany({
  where: { userId: 'user-id' },
  include: { deployments: true }
})
```

**Update**:
```typescript
const updated = await prisma.project.update({
  where: { id: 'project-id' },
  data: { status: 'paused' }
})
```

**Delete**:
```typescript
await prisma.project.delete({
  where: { id: 'project-id' }
})
```

---

## Real-time Updates

Currently not implemented, but could add:

### WebSocket Integration

```
User Action
    ↓
API Update
    ↓
WebSocket Broadcast
    ↓
All Connected Clients Update
```

### Server-Sent Events

For deployment status updates:

```typescript
// Server
const eventStream = createEventStream(event)
eventStream.push({ status: 'building' })

// Client
const eventSource = new EventSource('/api/deployments/stream')
eventSource.onmessage = (e) => {
  updateDeploymentStatus(JSON.parse(e.data))
}
```

---

## Performance Optimizations

### Caching

```typescript
// Client-side caching
const cachedProjects = ref(null)

const fetchProjects = async () => {
  if (cachedProjects.value) {
    return cachedProjects.value
  }
  const data = await $fetch('/api/projects')
  cachedProjects.value = data
  return data
}
```

### Lazy Loading

```typescript
// Load deployments only when needed
const { deployments, fetchDeployments } = useDeployments()

// Only fetch when tab is active
watch(activeTab, (tab) => {
  if (tab === 'deployments' && !deployments.value.length) {
    fetchDeployments(projectId)
  }
})
```

### Pagination

```typescript
// Future implementation
const { currentPage, itemsPerPage } = usePagination()

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return projects.value.slice(start, start + itemsPerPage)
})
```

---

## Security Flow

### Authentication

```
User Login
    ↓
Supabase Auth
    ↓
Session Token
    ↓
Stored in Cookie
    ↓
Included in API Requests
    ↓
Validated by Middleware
```

### Authorization

```
API Request
    ↓
Extract User from Token
    ↓
Check Resource Ownership
    ↓
Verify Permissions
    ↓
Allow/Deny Access
```

---

## Error Propagation

```
Database Error
    ↓
Caught by API Handler
    ↓
Formatted Error Response
    ↓
Composable error.value set
    ↓
UI displays error message
    ↓
Notification shown to user
```

**Example**:
```typescript
// API
try {
  const data = await prisma.project.findUnique()
  if (!data) {
    throw createError({ statusCode: 404, message: 'Not found' })
  }
  return data
} catch (e) {
  throw createError({ statusCode: 500, message: e.message })
}

// Composable
try {
  const data = await $fetch('/api/projects/123')
} catch (e) {
  error.value = e.message
  showError('Failed to load project')
}
```

---

## Best Practices

1. **Single Source of Truth**: State lives in composables
2. **Unidirectional Data Flow**: Data flows down, events flow up
3. **Error Boundaries**: Handle errors at each layer
4. **Loading States**: Always show loading indicators
5. **Optimistic Updates**: Update UI immediately, sync later
6. **Type Safety**: Use TypeScript throughout the stack

---

For detailed API reference, see [API_ENDPOINTS.md](./API_ENDPOINTS.md)

For composable usage, see [COMPOSABLES_HOOKS.md](./COMPOSABLES_HOOKS.md)
