# API Endpoints Documentation

Complete reference for all backend API endpoints in DeployHub.

## Base URL

- Development: `http://localhost:3000/api`
- Production: `https://your-domain.com/api`

---

## Projects

### GET /api/projects
List all projects.

**Response:**
```json
[
  {
    "id": "cuid",
    "name": "My Project",
    "slug": "my-project",
    "description": "Project description",
    "repositoryUrl": "https://github.com/user/repo",
    "status": "active",
    "userId": "user-id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "user": { "id": "...", "email": "...", "name": "..." },
    "_count": { "deployments": 5 }
  }
]
```

### POST /api/projects
Create a new project.

**Request Body:**
```json
{
  "name": "My Project",
  "description": "Optional description",
  "repositoryUrl": "https://github.com/user/repo",
  "slug": "my-project",
  "userId": "user-id"
}
```

### GET /api/projects/:id
Get a single project.

### PUT /api/projects/:id
Update a project.

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "New description",
  "status": "paused"
}
```

### DELETE /api/projects/:id
Delete a project.

---

## Deployments

### GET /api/deployments
List all deployments.

**Query Parameters:**
- `projectId` (optional) - Filter by project

### POST /api/deployments
Create a new deployment.

**Request Body:**
```json
{
  "projectId": "project-id",
  "commitHash": "abc123",
  "commitMessage": "Fix bug",
  "deployedUrl": "https://app.example.com"
}
```

### GET /api/deployments/:id
Get a single deployment.

### PUT /api/deployments/:id/status
Update deployment status.

**Request Body:**
```json
{
  "status": "success"
}
```

Valid statuses: `pending`, `building`, `success`, `failed`

---

## Teams

### GET /api/teams
List all teams.

### POST /api/teams
Create a new team.

**Request Body:**
```json
{
  "name": "My Team",
  "slug": "my-team",
  "ownerId": "user-id"
}
```

### GET /api/teams/:id/members
List team members.

### POST /api/teams/:id/members
Add a team member.

**Request Body:**
```json
{
  "userId": "user-id",
  "role": "member"
}
```

Valid roles: `owner`, `admin`, `member`

### DELETE /api/teams/:id/members/:memberId
Remove a team member.

---

## API Tokens

### GET /api/tokens
List API tokens.

**Query Parameters:**
- `userId` (optional) - Filter by user

### POST /api/tokens
Create a new API token.

**Request Body:**
```json
{
  "name": "My API Token",
  "userId": "user-id",
  "expiresAt": "2024-12-31T00:00:00.000Z"
}
```

**Response:**
```json
{
  "id": "token-id",
  "name": "My API Token",
  "token": "dh_abc123...",
  "userId": "user-id",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

⚠️ **Important**: The full token is only returned on creation!

### DELETE /api/tokens/:id
Delete an API token.

---

## Blockchain

### POST /api/blockchain/record-deployment
Record a deployment on blockchain.

**Request Body:**
```json
{
  "projectId": "project-id",
  "deploymentId": "deployment-id",
  "dataHash": "0xabc123...",
  "walletAddress": "0x..."
}
```

**Response:**
```json
{
  "id": "record-id",
  "projectId": "project-id",
  "deploymentId": "deployment-id",
  "txHash": "0xtransaction...",
  "blockNumber": "15000000",
  "network": "ethereum",
  "dataHash": "0xabc123...",
  "verified": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### GET /api/blockchain/verify/:txHash
Verify a blockchain transaction.

**Response:**
```json
{
  "verified": true,
  "record": { /* ChainRecord */ }
}
```

### GET /api/blockchain/records/:projectId
Get all blockchain records for a project.

---

## Users

### GET /api/users/profile
Get user profile.

**Query Parameters:**
- `userId` (required)

### PUT /api/users/profile
Update user profile.

**Request Body:**
```json
{
  "userId": "user-id",
  "name": "John Doe",
  "avatarUrl": "https://..."
}
```

---

## Stats

### GET /api/stats/overview
Get overview statistics.

**Query Parameters:**
- `userId` (optional) - Filter stats by user

**Response:**
```json
{
  "totalProjects": 10,
  "totalDeployments": 45,
  "activeProjects": 8,
  "successRate": 95.5,
  "deploymentsByStatus": {
    "success": 40,
    "failed": 2,
    "pending": 2,
    "building": 1
  },
  "recentDeployments": [/* ... */]
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "statusCode": 400,
  "statusMessage": "Bad Request",
  "data": {
    "error": "Detailed error message"
  }
}
```

Common status codes:
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `405` - Method Not Allowed
- `500` - Internal Server Error

---

## Authentication

Currently, the API uses Supabase authentication. Include the Supabase session token in requests:

```typescript
const { data } = await $fetch('/api/projects', {
  headers: {
    Authorization: `Bearer ${session.access_token}`
  }
})
```

For API token authentication (when using programmatic access):

```typescript
const { data } = await $fetch('/api/projects', {
  headers: {
    'X-API-Token': 'dh_your_token_here'
  }
})
```

---

## Rate Limiting

- No rate limiting currently implemented
- Recommended: 100 requests per minute per IP

---

## Pagination

Not yet implemented. All list endpoints return all results.

Future implementation will use:
- `page` - Page number (default: 1)
- `perPage` - Items per page (default: 30, max: 100)

---

For composable usage, see [COMPOSABLES_HOOKS.md](./COMPOSABLES_HOOKS.md)
