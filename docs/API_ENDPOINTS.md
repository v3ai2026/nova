# API Endpoints Documentation

## Overview
Complete list of all 23 API endpoints with request/response formats.

## Authentication
All endpoints except health check require authentication via Supabase session.

## Projects API (5 endpoints)

### GET /api/projects
Get all user projects

**Response:**
```json
[{
  "id": "string",
  "name": "string",
  "slug": "string",
  "description": "string",
  "status": "active",
  "_count": { "deployments": 0 }
}]
```

### POST /api/projects
Create new project

**Request:**
```json
{
  "name": "string",
  "description": "string",
  "repository_url": "string",
  "framework": "string"
}
```

### GET /api/projects/[id]
Get single project

### PUT /api/projects/[id]
Update project

### DELETE /api/projects/[id]
Delete project

## Deployments API (4 endpoints)

### GET /api/deployments
Get deployments (optionally filtered by projectId)

### POST /api/deployments
Create deployment

### GET /api/deployments/[id]
Get deployment details

### PUT /api/deployments/[id]/status
Update deployment status

## Teams API (5 endpoints)

### GET /api/teams
Get user teams

### POST /api/teams
Create team

### GET /api/teams/[id]/members
Get team members

### POST /api/teams/[id]/members
Add team member

### DELETE /api/teams/[id]/members/[memberId]
Remove team member

## Tokens API (3 endpoints)

### GET /api/tokens
Get API tokens

### POST /api/tokens
Create token

### DELETE /api/tokens/[id]
Delete token

## Users API (2 endpoints)

### GET /api/users/profile
Get user profile

### PUT /api/users/profile
Update user profile

## Blockchain API (3 endpoints)

### POST /api/blockchain/record-deployment
Record deployment on blockchain

### GET /api/blockchain/verify/[txHash]
Verify transaction

### GET /api/blockchain/records/[projectId]
Get project chain records

## Health Check

### GET /api/health
System health check

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

See individual endpoint files for detailed request/response schemas.
