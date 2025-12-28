# Composables & Hooks Reference

Complete guide to all composables and their usage in the DeployHub application.

## Table of Contents

- [Authentication](#authentication)
- [Projects Management](#projects-management)
- [Deployments Management](#deployments-management)
- [Team Management](#team-management)
- [API Tokens](#api-tokens)
- [Blockchain Integration](#blockchain-integration)
- [3D & AR Features](#3d--ar-features)
- [UI Composables](#ui-composables)
- [Utility Composables](#utility-composables)

---

## Authentication

### useAuth()

Handles user authentication with Supabase.

```typescript
const { user, signIn, signUp, signOut } = useAuth()
```

**Properties:**
- `user` - Reactive reference to current user

**Methods:**
- `signIn(email, password)` - Sign in with credentials
- `signUp(email, password, fullName)` - Create new account
- `signOut()` - Sign out and redirect to login

**Example:**
```typescript
const { user, signIn, signOut } = useAuth()

// Sign in
await signIn('user@example.com', 'password123')

// Check if logged in
if (user.value) {
  console.log('User:', user.value.email)
}

// Sign out
await signOut()
```

---

## Projects Management

### useProjects()

Manage projects with full CRUD operations.

```typescript
const { 
  projects, 
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
- `loading` - Boolean loading state
- `error` - Error message string (null if no error)

**Methods:**

#### fetchProjects()
Fetch all projects for the current user.
```typescript
await fetchProjects()
```

#### fetchProject(id)
Fetch a single project by ID.
```typescript
const project = await fetchProject('project-id')
```

#### createProject(data)
Create a new project.
```typescript
const project = await createProject({
  name: 'My Project',
  description: 'Project description',
  repositoryUrl: 'https://github.com/user/repo',
  slug: 'my-project',
  userId: user.value.id
})
```

#### updateProject(id, data)
Update an existing project.
```typescript
const updated = await updateProject('project-id', {
  name: 'Updated Name',
  status: 'paused'
})
```

#### deleteProject(id)
Delete a project.
```typescript
const success = await deleteProject('project-id')
```

---

## Deployments Management

### useDeployments()

Manage deployments across projects.

```typescript
const {
  deployments,
  loading,
  error,
  fetchDeployments,
  fetchDeployment,
  createDeployment,
  updateDeploymentStatus
} = useDeployments()
```

**Properties:**
- `deployments` - Array of deployments
- `loading` - Boolean loading state
- `error` - Error message

**Methods:**

#### fetchDeployments(projectId?)
Fetch deployments, optionally filtered by project.
```typescript
// All deployments
await fetchDeployments()

// Project-specific
await fetchDeployments('project-id')
```

#### fetchDeployment(id)
Get a single deployment.
```typescript
const deployment = await fetchDeployment('deployment-id')
```

#### createDeployment(data)
Create a new deployment.
```typescript
const deployment = await createDeployment({
  projectId: 'project-id',
  commitHash: 'abc123',
  commitMessage: 'Fix bug',
  deployedUrl: 'https://app.example.com'
})
```

#### updateDeploymentStatus(id, status)
Update deployment status.
```typescript
await updateDeploymentStatus('deployment-id', 'success')
// Valid statuses: 'pending', 'building', 'success', 'failed'
```

---

## Team Management

### useTeams()

Manage teams and team members.

```typescript
const {
  teams,
  members,
  loading,
  error,
  fetchTeams,
  fetchTeam,
  createTeam,
  fetchTeamMembers,
  addTeamMember,
  removeTeamMember
} = useTeams()
```

**Types:**
```typescript
interface Team {
  id: string
  name: string
  slug: string
  ownerId: string
  created_at: string
  updated_at: string
}

interface TeamMember {
  id: string
  teamId: string
  userId: string
  role: 'owner' | 'admin' | 'member'
  user?: {
    id: string
    email: string
    name?: string
  }
  created_at: string
}
```

**Methods:**

#### createTeam(data)
```typescript
const team = await createTeam({
  name: 'My Team',
  ownerId: user.value.id,
  slug: 'my-team'
})
```

#### fetchTeamMembers(teamId)
```typescript
const members = await fetchTeamMembers('team-id')
```

#### addTeamMember(teamId, data)
```typescript
await addTeamMember('team-id', {
  userId: 'user-id',
  role: 'member'
})
```

#### removeTeamMember(teamId, memberId)
```typescript
await removeTeamMember('team-id', 'member-id')
```

---

## API Tokens

### useApiTokens()

Manage API tokens for programmatic access.

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

**Methods:**

#### fetchTokens()
```typescript
await fetchTokens()
```

#### createToken(name, expiresAt?)
```typescript
const token = await createToken('My API Token', '2024-12-31')
// token.token contains the full token value (only shown once!)
```

#### deleteToken(id)
```typescript
await deleteToken('token-id')
```

---

## Blockchain Integration

### useBlockchain()

Web3 wallet connection and blockchain operations.

```typescript
const {
  provider,
  account,
  chainId,
  isConnected,
  loading,
  error,
  connectWallet,
  disconnectWallet,
  recordDeployment,
  verifyDeployment,
  getProjectRecords,
  getNetworkName
} = useBlockchain()
```

**Properties:**
- `provider` - Ethers.js BrowserProvider
- `account` - Connected wallet address
- `chainId` - Current network chain ID
- `isConnected` - Boolean connection state

**Methods:**

#### connectWallet()
Connect MetaMask wallet.
```typescript
const connected = await connectWallet()
if (connected) {
  console.log('Wallet:', account.value)
  console.log('Network:', getNetworkName(chainId.value))
}
```

#### recordDeployment(projectId, deploymentId, dataHash)
Record deployment on blockchain.
```typescript
const record = await recordDeployment(
  'project-id',
  'deployment-id',
  '0xabc123...'
)
```

#### verifyDeployment(txHash)
Verify a deployment transaction.
```typescript
const result = await verifyDeployment('0xtxhash...')
if (result.verified) {
  console.log('Deployment verified!')
}
```

#### getProjectRecords(projectId)
Get all blockchain records for a project.
```typescript
const records = await getProjectRecords('project-id')
```

---

## 3D & AR Features

### use3DModel()

3D model viewer functionality.

```typescript
const {
  currentModel,
  loading,
  error,
  viewerReady,
  loadModel,
  updateModelTransform,
  resetModel,
  clearModel,
  captureSnapshot
} = use3DModel()
```

**Methods:**

#### loadModel(url, format)
```typescript
const model = await loadModel(
  '/models/product.gltf',
  'gltf'
)
```

#### updateModelTransform(transform)
```typescript
updateModelTransform({
  scale: 1.5,
  rotation: { x: 0, y: 45, z: 0 },
  position: { x: 0, y: 10, z: 0 }
})
```

### useAR()

Augmented reality functionality.

```typescript
const {
  session,
  loading,
  error,
  checkARSupport,
  startARSession,
  endARSession,
  placeObject,
  captureARPhoto
} = useAR()
```

**Methods:**

#### checkARSupport()
```typescript
const supported = await checkARSupport()
if (supported) {
  console.log('AR is available!')
}
```

#### startARSession(modelUrl)
```typescript
const success = await startARSession('/models/product.glb')
```

---

## UI Composables

### useNotification()

Display toast notifications.

```typescript
const { success, error, warning, info } = useNotification()
```

**Methods:**
```typescript
success('Success!', 'Operation completed')
error('Error!', 'Something went wrong')
warning('Warning!', 'Please check')
info('Info', 'Helpful information')
```

### useModal()

Modal state management.

```typescript
const { isOpen, open, close, toggle } = useModal()
```

### useTheme()

Theme switching.

```typescript
const { theme, isDark, toggleTheme, setTheme } = useTheme()

// Toggle theme
toggleTheme()

// Set specific theme
setTheme('dark')
```

---

## Utility Composables

### useForm()

Form validation helpers.

```typescript
const { registerField, setValue, validateAll, getValues } = useForm()

registerField('email', '', [
  { validator: isEmail, message: 'Invalid email' }
])
```

### usePagination()

Pagination state management.

```typescript
const { 
  currentPage, 
  totalPages, 
  nextPage, 
  previousPage,
  goToPage
} = usePagination(totalItems, itemsPerPage)
```

---

## Best Practices

### Error Handling
All composables set the `error` ref when operations fail:

```typescript
const { error, fetchProjects } = useProjects()

await fetchProjects()

if (error.value) {
  console.error('Failed:', error.value)
  // Handle error
}
```

### Loading States
Use the `loading` ref to show loading indicators:

```typescript
const { loading, deployments, fetchDeployments } = useDeployments()

await fetchDeployments()

// In template
<LoadingSpinner v-if="loading" />
<div v-else>{{ deployments.length }} deployments</div>
```

### Reactive Data
All composable data is reactive:

```typescript
const { projects } = useProjects()

// Automatically updates when projects change
const projectCount = computed(() => projects.value.length)
```

---

## Common Patterns

### Fetching on Mount
```typescript
const { fetchProjects } = useProjects()

onMounted(() => {
  fetchProjects()
})
```

### Creating with Notifications
```typescript
const { createProject } = useProjects()
const { success, error } = useNotification()

const handleCreate = async (data) => {
  const project = await createProject(data)
  
  if (project) {
    success('Created', 'Project created successfully')
    navigateTo(`/projects/${project.id}`)
  } else {
    error('Failed', 'Could not create project')
  }
}
```

### Conditional Rendering
```typescript
<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Error: {{ error }}</div>
  <div v-else>
    <!-- Content -->
  </div>
</template>
```

---

For API endpoint details, see [API_ENDPOINTS.md](./API_ENDPOINTS.md)
