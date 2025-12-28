# Complete Routes Documentation

## Overview
This document provides a comprehensive overview of all routes available in the Nova deployment platform.

## Public Routes

### Authentication
- **`/login`** - User login page
- **`/signup`** - User registration page

### Landing
- **`/`** - Landing page

## Protected Routes (Authentication Required)

### Dashboard
- **`/dashboard`** - Main dashboard with statistics and recent deployments

### Projects
- **`/projects`** - List all projects
- **`/projects/new`** - Create new project
- **`/projects/[id]`** - View project details with deployments
- **`/projects/[id]/settings`** - Project settings
- **`/projects/[id]/deployments/[deploymentId]`** - View deployment details

### Deployments
- **`/deployments`** - List all deployments across projects

### Blockchain
- **`/blockchain`** - Blockchain management and wallet connection

### Settings
- **`/settings/profile`** - User profile settings
- **`/settings/tokens`** - API token management

### Onboarding
- **`/onboarding`** - User onboarding flow

## API Routes

### Projects API
- **GET `/api/projects`** - List all projects
- **POST `/api/projects`** - Create a new project
- **GET `/api/projects/[id]`** - Get project details
- **PUT `/api/projects/[id]`** - Update project
- **DELETE `/api/projects/[id]`** - Delete project

### Deployments API
- **GET `/api/deployments`** - List all deployments (supports `?projectId=` filter)
- **POST `/api/deployments`** - Create a new deployment
- **GET `/api/deployments/[id]`** - Get deployment details
- **PUT `/api/deployments/[id]/status`** - Update deployment status

### Teams API
- **GET `/api/teams`** - List all teams
- **POST `/api/teams`** - Create a new team
- **GET `/api/teams/[id]`** - Get team details
- **PUT `/api/teams/[id]`** - Update team
- **DELETE `/api/teams/[id]`** - Delete team
- **POST `/api/teams/[id]/members`** - Add team member
- **DELETE `/api/teams/[id]/members/[memberId]`** - Remove team member

### API Tokens
- **GET `/api/tokens`** - List all API tokens
- **POST `/api/tokens`** - Create a new token
- **DELETE `/api/tokens/[id]`** - Delete token

### Blockchain API
- **POST `/api/blockchain/record-deployment`** - Record deployment to blockchain
- **GET `/api/blockchain/verify/[txHash]`** - Verify blockchain transaction
- **GET `/api/blockchain/records/[projectId]`** - Get all chain records for a project

### Stats API
- **GET `/api/stats`** - Get platform statistics

### Health Check
- **GET `/api/health`** - Database health check

## Route Parameters

### Dynamic Parameters
- **`[id]`** - Project, deployment, team, or token ID (CUID format)
- **`[deploymentId]`** - Deployment ID
- **`[txHash]`** - Blockchain transaction hash
- **`[projectId]`** - Project ID for filtering
- **`[memberId]`** - Team member ID

## Query Parameters

### Deployments
- **`projectId`** - Filter deployments by project

## Middleware

### Auth Middleware
All protected routes use the `auth` middleware to ensure users are authenticated before accessing the route.

## Layout

### Default Layout
Most pages use the `default` layout which includes:
- Navigation bar
- Sidebar
- Footer
- Notification container

## Navigation Structure

```
Dashboard
├── Projects
│   ├── List all projects
│   ├── Create new project
│   └── Project details
│       ├── Deployments
│       ├── Activity
│       └── Settings
├── Deployments
│   └── All deployments list
├── Blockchain
│   └── Wallet & chain records
└── Settings
    ├── Profile
    └── API Tokens
```

## Redirects

- Unauthenticated users accessing protected routes are redirected to `/login`
- After successful login, users are redirected to `/dashboard`
- After creating a project, users are redirected to `/projects/[id]`

## Error Pages

- **404** - Page not found (handled by Nuxt default)
- **500** - Server error (handled by Nuxt default)

## Best Practices

1. Always use `navigateTo()` for client-side navigation
2. Use `NuxtLink` for internal links
3. Protected routes should include `middleware: 'auth'` in `definePageMeta`
4. Use meaningful route names for better SEO
5. Keep URL structure consistent and predictable
