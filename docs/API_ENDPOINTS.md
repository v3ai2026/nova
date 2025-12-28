# API Endpoints Documentation

## Overview
Complete documentation for all REST API endpoints in the Nova platform.

## Base URL
```
Development: http://localhost:3000/api
Production: https://yourdomain.com/api
```

## Authentication
Most endpoints require authentication. Include session cookie or authorization header with requests.

---

## Projects API

### List Projects
```http
GET /api/projects
```

**Response:**
```json
[
  {
    "id": "clx123...",
    "name": "My Project",
    "slug": "my-project",
    "description": "Project description",
    "repositoryUrl": "https://github.com/user/repo",
    "status": "active",
    "userId": "clx456...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": "clx456...",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "_count": {
      "deployments": 5
    }
  }
]
```

### Create Project
```http
POST /api/projects
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "My Project",
  "slug": "my-project",
  "userId": "clx456...",
  "description": "Optional description",
  "repositoryUrl": "https://github.com/user/repo"
}
```

**Response:** Same as single project object

### Get Project
```http
GET /api/projects/:id
```

**Response:**
```json
{
  "id": "clx123...",
  "name": "My Project",
  "slug": "my-project",
  "description": "Project description",
  "repositoryUrl": "https://github.com/user/repo",
  "status": "active",
  "userId": "clx456...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "user": {
    "id": "clx456...",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "deployments": [...],
  "chainRecords": [...],
  "_count": {
    "deployments": 5,
    "chainRecords": 2
  }
}
```

### Update Project
```http
PUT /api/projects/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "status": "paused"
}
```

### Delete Project
```http
DELETE /api/projects/:id
```

**Response:**
```json
{
  "success": true,
  "message": "项目删除成功"
}
```

---

## Deployments API

### List Deployments
```http
GET /api/deployments
GET /api/deployments?projectId=clx123...
```

**Query Parameters:**
- `projectId` (optional) - Filter by project ID

**Response:**
```json
[
  {
    "id": "clx789...",
    "projectId": "clx123...",
    "userId": "clx456...",
    "branch": "main",
    "commitSha": "abc123def456",
    "commitMessage": "Fix bug",
    "status": "success",
    "url": "https://deploy-url.com",
    "buildTime": 45000,
    "chainTxHash": "0x123abc...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "project": {
      "id": "clx123...",
      "name": "My Project",
      "slug": "my-project"
    },
    "user": {
      "id": "clx456...",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
]
```

### Create Deployment
```http
POST /api/deployments
Content-Type: application/json
```

**Request Body:**
```json
{
  "projectId": "clx123...",
  "userId": "clx456...",
  "commitSha": "abc123def456",
  "commitMessage": "Fix bug",
  "branch": "main"
}
```

### Get Deployment
```http
GET /api/deployments/:id
```

### Update Deployment Status
```http
PUT /api/deployments/:id/status
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "success"
}
```

**Possible Status Values:**
- `pending` - Initial state
- `building` - Build in progress
- `success` - Deployment successful
- `failed` - Deployment failed

---

## Teams API

### List Teams
```http
GET /api/teams
```

**Response:**
```json
[
  {
    "id": "clx111...",
    "name": "Development Team",
    "slug": "dev-team",
    "ownerId": "clx456...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "owner": {
      "id": "clx456...",
      "email": "owner@example.com",
      "name": "Team Owner"
    },
    "members": [
      {
        "id": "clx222...",
        "teamId": "clx111...",
        "userId": "clx333...",
        "role": "member",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "user": {
          "id": "clx333...",
          "email": "member@example.com",
          "name": "Team Member"
        }
      }
    ],
    "_count": {
      "members": 3
    }
  }
]
```

### Create Team
```http
POST /api/teams
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Development Team",
  "slug": "dev-team",
  "ownerId": "clx456..."
}
```

### Add Team Member
```http
POST /api/teams/:teamId/members
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "clx333...",
  "role": "member"
}
```

**Roles:**
- `owner` - Team owner (full access)
- `admin` - Administrator
- `member` - Regular member

### Remove Team Member
```http
DELETE /api/teams/:teamId/members/:memberId
```

---

## API Tokens

### List Tokens
```http
GET /api/tokens
```

**Response:**
```json
[
  {
    "id": "clx777...",
    "userId": "clx456...",
    "name": "Production API Token",
    "token": "nova_abc123def456...",
    "lastUsedAt": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": "clx456...",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
]
```

### Create Token
```http
POST /api/tokens
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Production API Token",
  "userId": "clx456..."
}
```

**Response:**
```json
{
  "id": "clx777...",
  "userId": "clx456...",
  "name": "Production API Token",
  "token": "nova_abc123def456...",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

⚠️ **Important:** Save the token value immediately. It won't be shown again.

### Delete Token
```http
DELETE /api/tokens/:id
```

---

## Blockchain API

### Record Deployment to Blockchain
```http
POST /api/blockchain/record-deployment
Content-Type: application/json
```

**Request Body:**
```json
{
  "projectId": "clx123...",
  "walletAddress": "0x1234...",
  "deploymentData": {
    "deploymentId": "clx789...",
    "commitSha": "abc123",
    "commitMessage": "Fix bug",
    "status": "success",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response:**
```json
{
  "success": true,
  "txHash": "0xabc123def456...",
  "blockNumber": 1234567,
  "record": {
    "id": "clx888...",
    "projectId": "clx123...",
    "txHash": "0xabc123def456...",
    "blockNumber": 1234567,
    "eventType": "deployment",
    "data": {...},
    "verified": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Verify Transaction
```http
GET /api/blockchain/verify/:txHash
```

**Response:**
```json
{
  "success": true,
  "verified": true,
  "record": {
    "id": "clx888...",
    "projectId": "clx123...",
    "txHash": "0xabc123def456...",
    "blockNumber": 1234567,
    "eventType": "deployment",
    "verified": true
  }
}
```

### Get Chain Records for Project
```http
GET /api/blockchain/records/:projectId
```

**Response:**
```json
[
  {
    "id": "clx888...",
    "projectId": "clx123...",
    "txHash": "0xabc123def456...",
    "blockNumber": 1234567,
    "eventType": "deployment",
    "data": {...},
    "verified": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "project": {
      "id": "clx123...",
      "name": "My Project",
      "slug": "my-project"
    }
  }
]
```

---

## Stats API

### Get Platform Statistics
```http
GET /api/stats
```

**Response:**
```json
{
  "totalProjects": 24,
  "totalDeployments": 342,
  "activeDeployments": 8,
  "totalUsers": 15,
  "totalChainRecords": 45,
  "successRate": 98.5
}
```

---

## Health Check

### Database Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "PostgreSQL 15.0..."
}
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "statusCode": 400,
  "message": "Error message here"
}
```

**Common Status Codes:**
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

Currently no rate limiting is implemented. In production, consider:
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## Best Practices

### 1. Error Handling
```typescript
try {
  const data = await $fetch('/api/projects')
} catch (error) {
  console.error('API Error:', error)
}
```

### 2. Query Parameters
```typescript
const deployments = await $fetch('/api/deployments', {
  params: { projectId: 'clx123...' }
})
```

### 3. Request Body
```typescript
const project = await $fetch('/api/projects', {
  method: 'POST',
  body: {
    name: 'New Project',
    slug: 'new-project',
    userId: 'clx456...'
  }
})
```

### 4. Headers
```typescript
const data = await $fetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```
