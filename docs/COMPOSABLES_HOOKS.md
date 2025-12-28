# Composables Documentation

## Overview
All 12 composables with their methods and usage examples.

## 1. useAuth
**Purpose:** Authentication management

**Methods:**
- `signIn(email, password)` - Sign in user
- `signUp(email, password, fullName)` - Register new user
- `signOut()` - Sign out current user

**Usage:**
```typescript
const { user, signIn, signOut } = useAuth()
await signIn('user@example.com', 'password')
```

## 2. useProjects
**Purpose:** Project management

**Methods:**
- `fetchProjects()` - Get all user projects
- `fetchProject(id)` - Get single project
- `createProject(data)` - Create new project
- `updateProject(id, data)` - Update project
- `deleteProject(id)` - Delete project

**State:**
- `projects` - Array of projects
- `currentProject` - Current project
- `loading` - Loading state
- `error` - Error message

**Usage:**
```typescript
const { fetchProjects, createProject, projects } = useProjects()
await fetchProjects()
await createProject({ name: 'My Project' })
```

## 3. useDeployments
**Purpose:** Deployment management

**Methods:**
- `fetchDeployments(projectId?)` - Get deployments
- `fetchDeployment(id)` - Get single deployment
- `createDeployment(projectId, data)` - Create deployment
- `updateDeploymentStatus(id, status, updates)` - Update status

## 4. useTeams
**Purpose:** Team collaboration

**Methods:**
- `fetchTeams()` - Get user teams
- `fetchTeamMembers(teamId)` - Get team members
- `createTeam(data)` - Create team
- `addTeamMember(teamId, userId, role)` - Add member
- `removeTeamMember(teamId, memberId)` - Remove member

## 5. useApiTokens
**Purpose:** API token management

**Methods:**
- `fetchTokens()` - Get all tokens
- `createToken(name, expiresIn)` - Create token
- `deleteToken(id)` - Delete token
- `copyToClipboard(token)` - Copy token

## 6. useBlockchain
**Purpose:** Blockchain integration

**Methods:**
- `connectWallet()` - Connect Web3 wallet
- `disconnectWallet()` - Disconnect wallet
- `recordDeployment(projectId, data)` - Record on chain
- `verifyOnChain(txHash)` - Verify transaction
- `getChainRecords(projectId)` - Get chain records

## 7. use3DModel
**Purpose:** 3D model rendering with Three.js

**Methods:**
- `loadModel(url, container)` - Load 3D model
- `animate()` - Start animation loop
- `dispose()` - Clean up resources

## 8. useAR
**Purpose:** Augmented Reality with WebXR

**Methods:**
- `checkARSupport()` - Check AR availability
- `startARSession(modelUrl)` - Start AR session
- `endARSession()` - End AR session

## Additional Composables

9. **useNotification** - Toast notifications
10. **useTheme** - Dark/light theme toggle
11. **useModal** - Modal management
12. **usePagination** - Pagination helper

See individual files for complete API documentation.
