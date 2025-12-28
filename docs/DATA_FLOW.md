# Data Flow Architecture

## Overview
Complete data flow from UI components through composables to API endpoints and database.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Vue Pages                            │
│  (projects/index.vue, dashboard.vue, etc.)                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Uses composables
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                        Composables                           │
│  useProjects, useDeployments, useTeams, etc.                │
│  - State management                                          │
│  - Business logic                                            │
│  - API calls via $fetch                                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP requests
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Routes (Server)                     │
│  server/api/projects/*, deployments/*, teams/*              │
│  - Authentication via server/utils/auth.ts                  │
│  - Validation                                                │
│  - Database operations                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Prisma ORM
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      PostgreSQL Database                     │
│  Tables: users, projects, deployments, teams, etc.          │
└─────────────────────────────────────────────────────────────┘
```

## Example: Creating a Project

### 1. User Action (UI Layer)
```vue
<!-- pages/projects/new.vue -->
<template>
  <form @submit.prevent="handleSubmit">
    <Input v-model="form.name" />
    <Button type="submit">Create</Button>
  </form>
</template>

<script setup>
const { createProject } = useProjects()
const handleSubmit = async () => {
  await createProject(form.value)
}
</script>
```

### 2. Composable Layer
```typescript
// composables/useProjects.ts
export const useProjects = () => {
  const createProject = async (data) => {
    const project = await $fetch('/api/projects', {
      method: 'POST',
      body: data
    })
    projects.value = [project, ...projects.value]
    return project
  }
}
```

### 3. API Layer
```typescript
// server/api/projects/index.post.ts
export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const body = await readBody(event)
  
  return await prisma.project.create({
    data: {
      name: body.name,
      userId: user.id
    }
  })
})
```

### 4. Database Layer
```sql
-- PostgreSQL
INSERT INTO projects (id, name, user_id)
VALUES ('cuid', 'My Project', 'user-id');
```

## State Management

### Reactive State
```typescript
// State is shared across components
const projects = useState<Project[]>('projects', () => [])

// Updates automatically trigger UI updates
projects.value = [newProject, ...projects.value]
```

## Authentication Flow

```
User Login
    ↓
Supabase Auth
    ↓
Session Cookie
    ↓
API Request with Cookie
    ↓
serverSupabaseUser(event)
    ↓
Prisma User Sync
    ↓
Authorized Access
```

## Error Handling

### Client Side
```typescript
try {
  await createProject(data)
  success('Project created')
} catch (e) {
  error('Failed to create project', e.message)
}
```

### Server Side
```typescript
if (!body.name) {
  throw createError({
    statusCode: 400,
    statusMessage: 'Name required'
  })
}
```

## Component Communication

- **Props down** - Parent to child data
- **Events up** - Child to parent notifications
- **Composables** - Shared state and logic
- **Provide/Inject** - Deep component tree data

## Best Practices

1. **Separation of concerns** - UI, logic, API, data separate
2. **Type safety** - TypeScript throughout
3. **Error boundaries** - Handle errors at each layer
4. **Loading states** - Show feedback during operations
5. **Optimistic updates** - Update UI before API confirms
