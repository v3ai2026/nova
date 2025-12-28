# Frontend-Backend Integration Guide

This document describes the complete integration between frontend pages and backend APIs in the Nova deployment platform.

## Overview

The application now has a full-stack architecture with:
- **Frontend**: Nuxt 3 pages with Vue components
- **Backend**: Nuxt API routes using Prisma ORM
- **Database**: PostgreSQL (Neon) with Prisma schema
- **Authentication**: Supabase for user authentication

## Architecture

```
Frontend Pages (Vue/Nuxt)
    ↓
Composables (useProjects, useDeployments, etc.)
    ↓
API Routes (/api/projects, /api/deployments, etc.)
    ↓
Server Utils (auth.ts, errors.ts)
    ↓
Prisma ORM
    ↓
PostgreSQL Database (Neon)
```

## Database Schema

### Models

1. **User** - User accounts synced from Supabase
   - Fields: id, email, name, createdAt, updatedAt
   - Relations: projects, ownedTeams, teamMembers, apiTokens

2. **Project** - User projects
   - Fields: id, name, slug, description, repositoryUrl, status, userId, createdAt, updatedAt
   - Relations: user, deployments

3. **Deployment** - Project deployments
   - Fields: id, projectId, branch, commitSha, commitMsg, status, url, createdAt, updatedAt
   - Relations: project

4. **Team** - Team management
   - Fields: id, name, slug, ownerId, createdAt, updatedAt
   - Relations: owner, members

5. **TeamMember** - Team membership
   - Fields: id, teamId, userId, role, createdAt
   - Relations: team, user

6. **ApiToken** - API tokens for programmatic access
   - Fields: id, userId, name, token, lastUsedAt, createdAt
   - Relations: user

## Backend API Routes

### Projects API
- `GET /api/projects` - List all user projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### Deployments API
- `GET /api/deployments` - List deployments (with optional projectId filter)
- `POST /api/deployments` - Create a new deployment
- `GET /api/deployments/:id` - Get deployment details
- `PUT /api/deployments/:id/status` - Update deployment status

### Users API
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile

### Teams API
- `GET /api/teams` - List user teams
- `POST /api/teams` - Create a new team
- `GET /api/teams/:id/members` - List team members
- `POST /api/teams/:id/members` - Add a team member
- `DELETE /api/teams/:id/members/:memberId` - Remove a team member

### Tokens API
- `GET /api/tokens` - List user API tokens
- `POST /api/tokens` - Create a new token
- `DELETE /api/tokens/:id` - Delete a token

## Frontend Composables

### useProjects()
```typescript
const { projects, loading, error, fetchProjects, createProject, updateProject, deleteProject } = useProjects()
```

### useDeployments()
```typescript
const { deployments, loading, error, fetchDeployments, createDeployment, updateDeploymentStatus } = useDeployments()
```

### useTeams()
```typescript
const { teams, loading, error, fetchTeams, createTeam, fetchTeamMembers, addTeamMember, removeTeamMember } = useTeams()
```

### useApiTokens()
```typescript
const { tokens, loading, error, fetchTokens, createToken, deleteToken } = useApiTokens()
```

### useAuth()
```typescript
const { user, profile, signIn, signUp, signOut, initAuth, updateProfile } = useAuth()
```

## Updated Pages

### pages/projects/index.vue
- Fetches projects from API on mount
- Shows loading spinner while fetching
- Displays error notifications on failure
- Real-time project deletion

### pages/projects/[id].vue
- Fetches project details from API
- Fetches and displays deployments
- Creates new deployments via API
- Shows loading and error states

### pages/dashboard.vue
- Fetches projects and deployments
- Calculates real statistics from data
- Shows recent deployments from API

### pages/settings/tokens.vue
- Fetches tokens from API
- Creates and deletes tokens
- Shows token value only once after creation
- Proper error handling

## Authentication Flow

1. User logs in via Supabase (frontend)
2. Supabase session is maintained by @nuxtjs/supabase
3. API requests include Supabase auth headers automatically
4. Backend API routes call `getAuthenticatedUser()` helper
5. Helper verifies Supabase token and syncs user to Prisma DB
6. API operations use Prisma user ID

## Error Handling

All API routes use standardized error responses:
- 400 - Bad Request (validation errors)
- 401 - Unauthorized (not authenticated)
- 403 - Forbidden (no permission)
- 404 - Not Found (resource doesn't exist)
- 409 - Conflict (duplicate resource)
- 422 - Validation Error (with field details)
- 500 - Internal Server Error

Frontend composables catch errors and expose them via `error` ref.

## Security

- All API routes (except /api/health) require authentication
- User can only access their own resources
- Cascade deletes ensure data consistency
- API tokens are hashed (only shown once during creation)
- Row-level security via ownership checks

## Running Migrations

To apply the database schema:

```bash
cd /home/runner/work/nova/nova
npx prisma migrate deploy
```

Or to create and apply migrations during development:

```bash
npx prisma migrate dev
```

## Testing

Since the database is not accessible from the build environment, the integration can be tested by:

1. Deploying to an environment with database access (Vercel, etc.)
2. Running `npx prisma migrate deploy` to apply migrations
3. Opening the application and testing each feature
4. Checking browser console for errors
5. Verifying API responses in network tab

## Next Steps

1. Deploy to production environment
2. Run database migrations
3. Test all API endpoints
4. Verify authentication flow
5. Test error handling
6. Add logging and monitoring
7. Implement CI/CD pipeline
8. Add E2E tests

## Notes

- The application uses TypeScript for type safety
- All dates use ISO 8601 format
- Prisma client is generated from schema
- Composables handle loading states and errors
- Pages show appropriate loading and error UI
