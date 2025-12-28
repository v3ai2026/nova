# Composables & Hooks Documentation

## Overview
This document provides comprehensive documentation for all composables (hooks) available in the Nova platform. Composables are reusable Vue 3 Composition API functions that encapsulate business logic.

## Core Composables

### useAuth
Authentication and user session management.

```typescript
const { user, session, loading, signIn, signUp, signOut } = useAuth()
```

**Properties:**
- `user` - Current user object
- `session` - Current session
- `loading` - Loading state

**Methods:**
- `signIn(email, password)` - Sign in user
- `signUp(email, password, name)` - Register new user
- `signOut()` - Sign out current user

---

### useNotification
Display toast notifications to users.

```typescript
const { notifications, success, error, warning, info, removeNotification } = useNotification()
```

**Properties:**
- `notifications` - Array of active notifications

**Methods:**
- `success(title, message?)` - Show success notification
- `error(title, message?)` - Show error notification
- `warning(title, message?)` - Show warning notification
- `info(title, message?)` - Show info notification
- `removeNotification(id)` - Remove specific notification

**Example:**
```typescript
const { success, error } = useNotification()

try {
  await createProject(data)
  success('Project created', 'Your project has been created successfully')
} catch (e) {
  error('Creation failed', e.message)
}
```

---

## Business Logic Composables

### useProjects
Manage projects with full CRUD operations.

```typescript
const { 
  projects, 
  currentProject, 
  loading, 
  error,
  fetchProjects,
  fetchProject,
  createProject,
  updateProject,
  deleteProject
} = useProjects()
```

**Properties:**
- `projects` - Array of all projects
- `currentProject` - Currently selected project
- `loading` - Loading state
- `error` - Error message if any

**Methods:**
- `fetchProjects()` - Load all projects
- `fetchProject(id)` - Load single project by ID
- `createProject(data)` - Create new project
  - Required: `name`, `slug`, `userId`
  - Optional: `description`, `repositoryUrl`
- `updateProject(id, data)` - Update existing project
- `deleteProject(id)` - Delete project

**Example:**
```typescript
const { projects, loading, fetchProjects, createProject } = useProjects()

onMounted(async () => {
  await fetchProjects()
})

const handleCreate = async () => {
  const newProject = await createProject({
    name: 'My Project',
    slug: 'my-project',
    userId: 'user123',
    description: 'A new project'
  })
}
```

---

### useDeployments
Manage deployments and deployment status.

```typescript
const {
  deployments,
  currentDeployment,
  loading,
  error,
  fetchDeployments,
  fetchDeployment,
  createDeployment,
  updateDeploymentStatus
} = useDeployments()
```

**Properties:**
- `deployments` - Array of all deployments
- `currentDeployment` - Currently selected deployment
- `loading` - Loading state
- `error` - Error message if any

**Methods:**
- `fetchDeployments(projectId?)` - Load deployments, optionally filtered by project
- `fetchDeployment(id)` - Load single deployment
- `createDeployment(data)` - Create new deployment
  - Required: `projectId`, `userId`, `commitSha`
  - Optional: `branch`, `commitMessage`
- `updateDeploymentStatus(id, status)` - Update deployment status

**Example:**
```typescript
const { deployments, fetchDeployments, createDeployment } = useDeployments()

// Fetch all deployments
await fetchDeployments()

// Fetch deployments for specific project
await fetchDeployments('project123')

// Create new deployment
await createDeployment({
  projectId: 'project123',
  userId: 'user123',
  commitSha: 'abc123',
  commitMessage: 'Fix bug'
})
```

---

### useTeams
Manage teams and team members.

```typescript
const {
  teams,
  currentTeam,
  loading,
  error,
  fetchTeams,
  fetchTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  addMember,
  removeMember
} = useTeams()
```

**Properties:**
- `teams` - Array of all teams
- `currentTeam` - Currently selected team
- `loading` - Loading state
- `error` - Error message if any

**Methods:**
- `fetchTeams()` - Load all teams
- `fetchTeam(id)` - Load single team
- `createTeam(data)` - Create new team
- `updateTeam(id, data)` - Update team
- `deleteTeam(id)` - Delete team
- `addMember(teamId, userId, role)` - Add team member
- `removeMember(teamId, memberId)` - Remove team member

---

### useApiTokens
Manage API tokens for authentication.

```typescript
const {
  tokens,
  loading,
  error,
  fetchTokens,
  createToken,
  deleteToken
} = useApiTokens()
```

**Properties:**
- `tokens` - Array of all API tokens
- `loading` - Loading state
- `error` - Error message if any

**Methods:**
- `fetchTokens()` - Load all tokens
- `createToken(name)` - Create new token
- `deleteToken(id)` - Delete token

**Example:**
```typescript
const { tokens, fetchTokens, createToken } = useApiTokens()

onMounted(async () => {
  await fetchTokens()
})

const handleCreateToken = async () => {
  const token = await createToken('My API Token')
  console.log('Token:', token.token) // Save this securely
}
```

---

### useBlockchain
Blockchain wallet connection and chain record management.

```typescript
const {
  connected,
  walletAddress,
  chainId,
  balance,
  loading,
  error,
  connectWallet,
  disconnectWallet,
  recordDeployment,
  verifyOnChain,
  getChainRecords
} = useBlockchain()
```

**Properties:**
- `connected` - Whether wallet is connected
- `walletAddress` - Connected wallet address
- `chainId` - Current blockchain network ID
- `balance` - Wallet balance in ETH
- `loading` - Loading state
- `error` - Error message if any

**Methods:**
- `connectWallet()` - Connect Web3 wallet (MetaMask, etc.)
- `disconnectWallet()` - Disconnect wallet
- `recordDeployment(projectId, deploymentData)` - Record deployment to blockchain
- `verifyOnChain(txHash)` - Verify transaction on blockchain
- `getChainRecords(projectId)` - Get all chain records for a project

**Example:**
```typescript
const { connected, connectWallet, recordDeployment } = useBlockchain()

// Connect wallet
const handleConnect = async () => {
  await connectWallet()
}

// Record deployment
const handleRecord = async () => {
  if (!connected.value) {
    return
  }
  
  const result = await recordDeployment('project123', {
    deploymentId: 'deploy123',
    commitSha: 'abc123',
    status: 'success'
  })
  
  console.log('TX Hash:', result.txHash)
}
```

---

## UI Composables

### useModal
Manage modal dialogs.

```typescript
const { isOpen, open, close, toggle } = useModal()
```

### useForm
Form state and validation management.

```typescript
const { values, errors, handleSubmit, validate, reset } = useForm()
```

### useTheme
Theme switching (light/dark mode).

```typescript
const { theme, setTheme, toggleTheme } = useTheme()
```

### usePagination
Pagination logic.

```typescript
const { page, perPage, total, totalPages, nextPage, prevPage, goToPage } = usePagination()
```

---

## Best Practices

### 1. Error Handling
All composables handle errors internally and show notifications. You can also catch errors for custom handling:

```typescript
try {
  await createProject(data)
  // Success - notification already shown
} catch (e) {
  // Additional error handling if needed
  console.error(e)
}
```

### 2. Loading States
Always check loading states before performing actions:

```typescript
const { loading, fetchProjects } = useProjects()

<Button :disabled="loading" @click="fetchProjects">
  {{ loading ? 'Loading...' : 'Refresh' }}
</Button>
```

### 3. Reactivity
All return values are reactive refs or computed properties:

```typescript
const { projects } = useProjects()

// Automatically updates when projects change
watchEffect(() => {
  console.log('Projects count:', projects.value.length)
})
```

### 4. Composable Composition
Composables can be used together:

```typescript
const { projects, fetchProjects } = useProjects()
const { success, error } = useNotification()
const { connected } = useBlockchain()

const handleAction = async () => {
  if (!connected.value) {
    error('Not connected', 'Please connect your wallet')
    return
  }
  
  await fetchProjects()
  success('Loaded', 'Projects loaded successfully')
}
```

### 5. Lifecycle
Load data in `onMounted` or when component needs it:

```typescript
onMounted(async () => {
  await fetchProjects()
  await fetchDeployments()
})
```

---

## Type Definitions

All composables are fully typed with TypeScript. Import types from `~/types`:

```typescript
import type { Project, Deployment, Team, ApiToken } from '~/types'
```

---

## Common Patterns

### List/Detail Pattern
```typescript
// List page
const { projects, fetchProjects } = useProjects()
onMounted(() => fetchProjects())

// Detail page
const { currentProject, fetchProject } = useProjects()
const route = useRoute()
onMounted(() => fetchProject(route.params.id))
```

### Create/Update Pattern
```typescript
const isEditing = computed(() => !!route.params.id)

const handleSubmit = async () => {
  if (isEditing.value) {
    await updateProject(route.params.id, formData)
  } else {
    await createProject(formData)
  }
}
```

### Delete Confirmation Pattern
```typescript
const handleDelete = async (id: string) => {
  if (confirm('Are you sure?')) {
    await deleteProject(id)
  }
}
```
