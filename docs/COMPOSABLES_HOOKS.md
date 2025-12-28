# Composables & Hooks Documentation

## Overview
This document provides complete documentation for all composables (Vue 3 Composition API hooks) used in the DeployHub application.

---

## Table of Contents
1. [useProjects](#useprojects)
2. [useDeployments](#usedeployments)
3. [useTeams](#useteams)
4. [useApiTokens](#useapitokens)
5. [useBlockchain](#useblockchain)
6. [use3DModel](#use3dmodel)
7. [useAR](#usear)

---

## useProjects

Manages project-related state and operations.

### Import
```typescript
import { useProjects } from '~/composables/useProjects'
```

### API

#### State
```typescript
{
  projects: Readonly<Ref<Project[]>>,      // List of projects
  loading: Readonly<Ref<boolean>>,          // Loading state
  error: Readonly<Ref<string | null>>       // Error message
}
```

#### Methods

##### `fetchProjects(): Promise<void>`
Fetches all projects for the current user.

**Example:**
```typescript
const { projects, loading, fetchProjects } = useProjects()

onMounted(async () => {
  await fetchProjects()
  console.log(projects.value) // Array of projects
})
```

##### `fetchProject(id: string): Promise<Project | null>`
Fetches a single project by ID.

**Parameters:**
- `id` - Project ID

**Returns:** Project object or null if not found

**Example:**
```typescript
const project = await fetchProject('project-123')
if (project) {
  console.log(project.name)
}
```

##### `createProject(data: Partial<Project>): Promise<Project | null>`
Creates a new project.

**Parameters:**
- `data.name` - Project name (required)
- `data.description` - Project description (optional)
- `data.repository_url` - Git repository URL (optional)

**Returns:** Created project or null on error

**Example:**
```typescript
const { createProject } = useProjects()

const newProject = await createProject({
  name: 'My New App',
  description: 'A cool new application',
  repository_url: 'https://github.com/user/repo'
})
```

##### `updateProject(id: string, data: Partial<Project>): Promise<Project | null>`
Updates an existing project.

**Parameters:**
- `id` - Project ID
- `data` - Fields to update

**Returns:** Updated project or null on error

**Example:**
```typescript
await updateProject('project-123', {
  description: 'Updated description',
  status: 'paused'
})
```

##### `deleteProject(id: string): Promise<boolean>`
Deletes a project.

**Parameters:**
- `id` - Project ID

**Returns:** `true` on success, `false` on error

**Example:**
```typescript
const success = await deleteProject('project-123')
if (success) {
  console.log('Project deleted')
}
```

##### `getStats(): Object`
Returns project statistics.

**Returns:**
```typescript
{
  totalProjects: number,
  activeProjects: number,
  pausedProjects: number,
  errorProjects: number
}
```

**Example:**
```typescript
const { getStats } = useProjects()
const stats = getStats()
console.log(`Total: ${stats.totalProjects}`)
```

---

## useDeployments

Manages deployment-related state and operations.

### Import
```typescript
import { useDeployments } from '~/composables/useDeployments'
```

### API

#### State
```typescript
{
  deployments: Readonly<Ref<Deployment[]>>,  // List of deployments
  loading: Readonly<Ref<boolean>>,            // Loading state
  error: Readonly<Ref<string | null>>         // Error message
}
```

#### Methods

##### `fetchDeployments(projectId?: string): Promise<void>`
Fetches deployments, optionally filtered by project.

**Parameters:**
- `projectId` - Optional project ID to filter by

**Example:**
```typescript
const { fetchDeployments } = useDeployments()

// Fetch all deployments
await fetchDeployments()

// Fetch for specific project
await fetchDeployments('project-123')
```

##### `fetchDeployment(id: string): Promise<Deployment | null>`
Fetches a single deployment by ID.

**Parameters:**
- `id` - Deployment ID

**Returns:** Deployment object or null

**Example:**
```typescript
const deployment = await fetchDeployment('deploy-456')
```

##### `createDeployment(projectId: string, data?: Partial<Deployment>): Promise<Deployment | null>`
Creates a new deployment.

**Parameters:**
- `projectId` - Project ID
- `data` - Optional deployment data

**Returns:** Created deployment or null

**Example:**
```typescript
const deployment = await createDeployment('project-123', {
  commit_hash: 'abc123',
  commit_message: 'Deploy new feature'
})
```

##### `getRecentDeployments(limit: number = 10): Deployment[]`
Gets the most recent deployments.

**Parameters:**
- `limit` - Number of deployments to return (default: 10)

**Returns:** Array of deployments

**Example:**
```typescript
const recent = getRecentDeployments(5)
```

##### `getStats(): Object`
Returns deployment statistics.

**Returns:**
```typescript
{
  totalDeployments: number,
  activeDeployments: number,
  successfulDeployments: number,
  failedDeployments: number,
  successRate: number
}
```

---

## useTeams

Manages team member operations.

### Import
```typescript
import { useTeams } from '~/composables/useTeams'
```

### API

#### State
```typescript
{
  members: Readonly<Ref<TeamMember[]>>,    // List of team members
  loading: Readonly<Ref<boolean>>,          // Loading state
  error: Readonly<Ref<string | null>>       // Error message
}
```

#### Methods

##### `fetchMembers(): Promise<void>`
Fetches all team members.

**Example:**
```typescript
const { members, fetchMembers } = useTeams()
await fetchMembers()
```

##### `addMember(data: { email: string; role: string }): Promise<TeamMember | null>`
Adds a new team member.

**Parameters:**
- `data.email` - Member email
- `data.role` - Member role ('owner' | 'admin' | 'member' | 'viewer')

**Returns:** Created member or null

**Example:**
```typescript
const member = await addMember({
  email: 'user@example.com',
  role: 'member'
})
```

##### `updateMemberRole(id: string, role: string): Promise<TeamMember | null>`
Updates a member's role.

**Parameters:**
- `id` - Member ID
- `role` - New role

**Returns:** Updated member or null

**Example:**
```typescript
await updateMemberRole('member-123', 'admin')
```

##### `removeMember(id: string): Promise<boolean>`
Removes a team member.

**Parameters:**
- `id` - Member ID

**Returns:** `true` on success

**Example:**
```typescript
await removeMember('member-123')
```

---

## useApiTokens

Manages API tokens.

### Import
```typescript
import { useApiTokens } from '~/composables/useApiTokens'
```

### API

#### State
```typescript
{
  tokens: Readonly<Ref<ApiToken[]>>,      // List of tokens
  loading: Readonly<Ref<boolean>>,         // Loading state
  error: Readonly<Ref<string | null>>      // Error message
}
```

#### Methods

##### `fetchTokens(): Promise<void>`
Fetches all API tokens.

**Example:**
```typescript
const { tokens, fetchTokens } = useApiTokens()
await fetchTokens()
```

##### `createToken(name: string): Promise<ApiToken | null>`
Creates a new API token.

**Parameters:**
- `name` - Token name

**Returns:** Created token (includes token value) or null

**Example:**
```typescript
const token = await createToken('Production Deploy')
console.log(token.token) // Save this value!
```

##### `deleteToken(id: string): Promise<boolean>`
Deletes an API token.

**Parameters:**
- `id` - Token ID

**Returns:** `true` on success

**Example:**
```typescript
await deleteToken('token-123')
```

##### `copyToClipboard(token: string): Promise<boolean>`
Copies a token to clipboard.

**Parameters:**
- `token` - Token string

**Returns:** `true` on success

**Example:**
```typescript
const success = await copyToClipboard(token.token)
```

---

## useBlockchain

Manages blockchain wallet and operations.

### Import
```typescript
import { useBlockchain } from '~/composables/useBlockchain'
```

### API

#### State
```typescript
{
  wallet: Readonly<Ref<WalletState>>,      // Wallet state
  records: Readonly<Ref<ChainRecord[]>>,   // Blockchain records
  loading: Readonly<Ref<boolean>>,          // Loading state
  error: Readonly<Ref<string | null>>       // Error message
}

interface WalletState {
  address: string | null
  chainId: number | null
  connected: boolean
}
```

#### Methods

##### `connectWallet(): Promise<WalletState | null>`
Connects to MetaMask wallet.

**Returns:** Wallet state or null

**Example:**
```typescript
const { connectWallet, wallet } = useBlockchain()
const connected = await connectWallet()
if (connected) {
  console.log(wallet.value.address)
}
```

##### `disconnectWallet(): void`
Disconnects the wallet.

**Example:**
```typescript
disconnectWallet()
```

##### `fetchRecords(deploymentId?: string): Promise<void>`
Fetches blockchain records.

**Parameters:**
- `deploymentId` - Optional deployment ID to filter by

**Example:**
```typescript
await fetchRecords('deploy-123')
```

##### `recordDeployment(deploymentId: string, metadata: any): Promise<ChainRecord | null>`
Records a deployment on the blockchain.

**Parameters:**
- `deploymentId` - Deployment ID
- `metadata` - Deployment metadata

**Returns:** Chain record or null

**Example:**
```typescript
const record = await recordDeployment('deploy-123', {
  timestamp: new Date().toISOString()
})
```

##### `verifyDeployment(deploymentId: string): Promise<boolean>`
Verifies if a deployment is recorded on chain.

**Parameters:**
- `deploymentId` - Deployment ID

**Returns:** `true` if verified

**Example:**
```typescript
const verified = await verifyDeployment('deploy-123')
```

---

## use3DModel

Manages 3D model loading and interaction.

### Import
```typescript
import { use3DModel } from '~/composables/use3DModel'
```

### API

#### State
```typescript
{
  state: Readonly<Ref<Model3DState>>
}

interface Model3DState {
  loaded: boolean
  loading: boolean
  error: string | null
  progress: number
}
```

#### Methods

##### `loadModel(url: string): Promise<boolean>`
Loads a 3D model from URL.

**Parameters:**
- `url` - Model file URL (e.g., .glb, .gltf)

**Returns:** `true` on success

**Example:**
```typescript
const { loadModel, state } = use3DModel()
await loadModel('/models/product.glb')
console.log(state.value.loaded)
```

##### `resetCamera(): void`
Resets camera to default position.

**Example:**
```typescript
resetCamera()
```

##### `toggleAutoRotate(): void`
Toggles automatic rotation.

**Example:**
```typescript
toggleAutoRotate()
```

##### `dispose(): void`
Cleans up model resources.

**Example:**
```typescript
onUnmounted(() => {
  dispose()
})
```

---

## useAR

Manages Augmented Reality features.

### Import
```typescript
import { useAR } from '~/composables/useAR'
```

### API

#### State
```typescript
{
  state: Readonly<Ref<ARState>>
}

interface ARState {
  supported: boolean
  active: boolean
  error: string | null
}
```

#### Methods

##### `checkSupport(): boolean`
Checks if AR is supported on the device.

**Returns:** `true` if supported

**Example:**
```typescript
const { checkSupport, state } = useAR()
if (checkSupport()) {
  console.log('AR is supported')
}
```

##### `startAR(): Promise<boolean>`
Starts AR session.

**Returns:** `true` on success

**Example:**
```typescript
const success = await startAR()
```

##### `stopAR(): void`
Stops AR session.

**Example:**
```typescript
stopAR()
```

---

## Best Practices

### 1. Error Handling
Always check for errors after operations:
```typescript
const { error, createProject } = useProjects()
const project = await createProject(data)
if (error.value) {
  console.error('Failed:', error.value)
}
```

### 2. Loading States
Use loading state for UI feedback:
```typescript
const { loading, fetchProjects } = useProjects()

watchEffect(() => {
  if (loading.value) {
    // Show loading spinner
  }
})
```

### 3. Reactive Updates
Composable state is reactive:
```typescript
const { projects } = useProjects()

watch(projects, (newProjects) => {
  console.log('Projects updated:', newProjects.length)
})
```

### 4. Cleanup
Some composables need cleanup:
```typescript
const { dispose } = use3DModel()

onUnmounted(() => {
  dispose()
})
```

---

## Common Patterns

### Fetch on Mount
```typescript
const { fetchProjects } = useProjects()

onMounted(() => {
  fetchProjects()
})
```

### Handle Success/Error
```typescript
const { success, error: errorNotif } = useNotification()
const { createProject, error } = useProjects()

const handleCreate = async (data) => {
  const project = await createProject(data)
  if (project) {
    success('Created!', 'Project created successfully')
    navigateTo(`/projects/${project.id}`)
  } else {
    errorNotif('Failed', error.value || 'Unknown error')
  }
}
```

### Filter/Transform Data
```typescript
const { projects } = useProjects()

const activeProjects = computed(() => 
  projects.value.filter(p => p.status === 'active')
)
```
