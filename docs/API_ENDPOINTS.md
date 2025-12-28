# API Endpoints Specification

## Overview
Complete specification for all API endpoints in the DeployHub application.

**Base URL**: `/api`

**Authentication**: All endpoints (except `/auth/*`) require Bearer token authentication.

---

## Table of Contents
1. [Authentication](#authentication)
2. [Projects](#projects)
3. [Deployments](#deployments)
4. [Team Members](#team-members)
5. [API Tokens](#api-tokens)
6. [Activities](#activities)
7. [Blockchain](#blockchain)
8. [User Profile](#user-profile)

---

## Authentication

### POST `/api/auth/login`
Authenticate user and receive access token.

**Request Body:**
```typescript
{
  email: string
  password: string
}
```

**Response:**
```typescript
{
  user: {
    id: string
    email: string
    name: string
    avatar_url?: string
  }
  token: string
}
```

**Status Codes:**
- `200` - Success
- `401` - Invalid credentials
- `400` - Validation error

**Example:**
```typescript
const response = await $fetch('/api/auth/login', {
  method: 'POST',
  body: {
    email: 'user@example.com',
    password: 'password123'
  }
})
```

---

### POST `/api/auth/signup`
Register a new user account.

**Request Body:**
```typescript
{
  email: string
  password: string
  name?: string
}
```

**Response:**
```typescript
{
  user: {
    id: string
    email: string
    name: string
  }
  token: string
}
```

**Status Codes:**
- `201` - Created
- `409` - Email already exists
- `400` - Validation error

---

### POST `/api/auth/logout`
Invalidate current session.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```typescript
{
  message: "Logged out successfully"
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized

---

## Projects

### GET `/api/projects`
List all projects for authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status?: 'active' | 'paused' | 'error'` - Filter by status
- `search?: string` - Search by name or description
- `page?: number` - Page number (default: 1)
- `limit?: number` - Items per page (default: 20, max: 100)

**Response:**
```typescript
{
  projects: Project[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

interface Project {
  id: string
  name: string
  slug: string
  description?: string
  repository_url?: string
  status: 'active' | 'paused' | 'error'
  created_at: string
  updated_at: string
}
```

**Example:**
```typescript
const { projects } = await $fetch('/api/projects?status=active&limit=10')
```

---

### GET `/api/projects/:id`
Get a specific project by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```typescript
{
  project: Project
  stats: {
    totalDeployments: number
    successfulDeployments: number
    failedDeployments: number
    lastDeployment?: string
  }
}
```

**Status Codes:**
- `200` - Success
- `404` - Project not found
- `403` - Access denied

---

### POST `/api/projects`
Create a new project.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```typescript
{
  name: string                 // Required, 3-50 chars
  description?: string         // Optional, max 500 chars
  repository_url?: string      // Optional, valid URL
}
```

**Response:**
```typescript
{
  project: Project
}
```

**Status Codes:**
- `201` - Created
- `400` - Validation error
- `409` - Project name/slug already exists

**Example:**
```typescript
const { project } = await $fetch('/api/projects', {
  method: 'POST',
  body: {
    name: 'My New Project',
    description: 'A cool project',
    repository_url: 'https://github.com/user/repo'
  }
})
```

---

### PUT `/api/projects/:id`
Update an existing project.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```typescript
{
  name?: string
  description?: string
  repository_url?: string
  status?: 'active' | 'paused' | 'error'
}
```

**Response:**
```typescript
{
  project: Project
}
```

**Status Codes:**
- `200` - Success
- `404` - Project not found
- `403` - Access denied
- `400` - Validation error

---

### DELETE `/api/projects/:id`
Delete a project and all its deployments.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```typescript
{
  message: "Project deleted successfully"
}
```

**Status Codes:**
- `200` - Success
- `404` - Project not found
- `403` - Access denied

---

## Deployments

### GET `/api/deployments`
List deployments with optional filtering.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `projectId?: string` - Filter by project
- `status?: 'pending' | 'building' | 'success' | 'failed'` - Filter by status
- `page?: number` - Page number
- `limit?: number` - Items per page

**Response:**
```typescript
{
  deployments: Deployment[]
  pagination: PaginationMeta
}

interface Deployment {
  id: string
  project_id: string
  status: 'pending' | 'building' | 'success' | 'failed'
  commit_hash?: string
  commit_message?: string
  deployed_url?: string
  created_at: string
  completed_at?: string
}
```

---

### GET `/api/deployments/:id`
Get deployment details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```typescript
{
  deployment: Deployment
  logs?: string[]
  duration?: number  // milliseconds
}
```

---

### POST `/api/deployments`
Create a new deployment.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```typescript
{
  project_id: string           // Required
  commit_hash?: string         // Optional
  commit_message?: string      // Optional
}
```

**Response:**
```typescript
{
  deployment: Deployment
}
```

**Status Codes:**
- `201` - Created
- `400` - Validation error
- `404` - Project not found

**Example:**
```typescript
const { deployment } = await $fetch('/api/deployments', {
  method: 'POST',
  body: {
    project_id: 'proj_123',
    commit_hash: 'abc123',
    commit_message: 'Deploy new feature'
  }
})
```

---

### GET `/api/deployments/:id/logs`
Get deployment logs.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```typescript
{
  logs: string[]
  status: string
  updated_at: string
}
```

---

## Team Members

### GET `/api/teams/members`
List all team members.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```typescript
{
  members: TeamMember[]
}

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  avatar_url?: string
  created_at: string
}
```

---

### POST `/api/teams/members`
Invite a new team member.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```typescript
{
  email: string                                        // Required
  role: 'owner' | 'admin' | 'member' | 'viewer'       // Required
}
```

**Response:**
```typescript
{
  member: TeamMember
  invitation_sent: boolean
}
```

**Status Codes:**
- `201` - Created
- `400` - Validation error
- `409` - Member already exists
- `403` - Insufficient permissions

---

### PUT `/api/teams/members/:id`
Update team member role.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```typescript
{
  role: 'owner' | 'admin' | 'member' | 'viewer'
}
```

**Response:**
```typescript
{
  member: TeamMember
}
```

**Status Codes:**
- `200` - Success
- `404` - Member not found
- `403` - Insufficient permissions

---

### DELETE `/api/teams/members/:id`
Remove a team member.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```typescript
{
  message: "Member removed successfully"
}
```

**Status Codes:**
- `200` - Success
- `404` - Member not found
- `403` - Cannot remove owner or insufficient permissions

---

## API Tokens

### GET `/api/tokens`
List all API tokens for current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```typescript
{
  tokens: ApiToken[]
}

interface ApiToken {
  id: string
  name: string
  token: string          // Masked, e.g., "dp_xxxxx...xxxxx"
  created_at: string
  last_used?: string
  expires_at?: string
}
```

---

### POST `/api/tokens`
Create a new API token.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```typescript
{
  name: string              // Required, token name
  expires_in?: number       // Optional, days until expiration
}
```

**Response:**
```typescript
{
  token: {
    id: string
    name: string
    token: string          // Full token, ONLY returned on creation
    created_at: string
    expires_at?: string
  }
}
```

**⚠️ Important:** The full token is only returned on creation. Save it immediately!

---

### DELETE `/api/tokens/:id`
Delete an API token.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```typescript
{
  message: "Token deleted successfully"
}
```

---

## Activities

### GET `/api/activities`
Get activity timeline.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `type?: string` - Filter by activity type
- `page?: number` - Page number
- `limit?: number` - Items per page (max: 50)

**Response:**
```typescript
{
  activities: Activity[]
  pagination: PaginationMeta
}

interface Activity {
  id: string
  type: 'deployment' | 'commit' | 'user' | 'settings' | 'alert'
  title: string
  description: string
  metadata?: object
  created_at: string
  user?: {
    id: string
    name: string
    avatar_url?: string
  }
}
```

---

## Blockchain

### POST `/api/blockchain/connect`
Connect wallet and store address.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```typescript
{
  address: string
  chain_id: number
}
```

**Response:**
```typescript
{
  connected: boolean
  address: string
}
```

---

### GET `/api/blockchain/records`
Get blockchain records.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `deployment_id?: string` - Filter by deployment

**Response:**
```typescript
{
  records: ChainRecord[]
}

interface ChainRecord {
  id: string
  deployment_id: string
  transaction_hash: string
  block_number: number
  verified: boolean
  timestamp: string
}
```

---

### POST `/api/blockchain/record`
Record a deployment on blockchain.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```typescript
{
  deployment_id: string
  metadata: object
}
```

**Response:**
```typescript
{
  record: ChainRecord
  transaction_hash: string
}
```

---

### GET `/api/blockchain/verify/:deploymentId`
Verify deployment on blockchain.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```typescript
{
  verified: boolean
  record?: ChainRecord
}
```

---

## User Profile

### GET `/api/user/profile`
Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```typescript
{
  user: {
    id: string
    email: string
    name: string
    avatar_url?: string
    created_at: string
  }
}
```

---

### PUT `/api/user/profile`
Update user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```typescript
{
  name?: string
  avatar_url?: string
}
```

**Response:**
```typescript
{
  user: User
}
```

---

## Error Responses

All endpoints may return these error formats:

### Validation Error (400)
```typescript
{
  error: "Validation failed"
  details: {
    field: string
    message: string
  }[]
}
```

### Unauthorized (401)
```typescript
{
  error: "Unauthorized"
  message: "Invalid or expired token"
}
```

### Forbidden (403)
```typescript
{
  error: "Forbidden"
  message: "Insufficient permissions"
}
```

### Not Found (404)
```typescript
{
  error: "Not found"
  message: "Resource not found"
}
```

### Server Error (500)
```typescript
{
  error: "Internal server error"
  message: string
}
```

---

## Rate Limiting

API endpoints are rate-limited:
- **Authenticated requests**: 1000 requests per hour
- **Unauthenticated requests**: 100 requests per hour

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640000000
```

---

## Pagination

Paginated endpoints return:
```typescript
{
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}
```

**Example:**
```typescript
const response = await $fetch('/api/projects?page=2&limit=10')
console.log(`Page ${response.pagination.page} of ${response.pagination.pages}`)
```

---

## Best Practices

### 1. Always Handle Errors
```typescript
try {
  const data = await $fetch('/api/projects')
} catch (error) {
  if (error.statusCode === 401) {
    // Handle unauthorized
  }
}
```

### 2. Use Type Safety
```typescript
interface Project {
  id: string
  name: string
  // ...
}

const { projects } = await $fetch<{ projects: Project[] }>('/api/projects')
```

### 3. Include Headers
```typescript
const token = useAuth().token

await $fetch('/api/projects', {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
```

### 4. Handle Loading States
```typescript
const loading = ref(true)
try {
  const data = await $fetch('/api/projects')
} finally {
  loading.value = false
}
```
