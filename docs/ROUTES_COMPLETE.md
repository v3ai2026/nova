# Complete Routes Inventory

## Overview
This document provides a complete inventory of all routes in the DeployHub application, their implementation status, required composables, API endpoints, and Prisma schema requirements.

## Routes Summary

Total Routes: **17**
- ✅ Implemented: **17**
- ❌ Missing: **0**

---

## 1. Authentication Routes

### `/login`
- **Status**: ✅ Implemented
- **File**: `pages/login.vue`
- **Layout**: None (full page)
- **Middleware**: None
- **Composables**: `useAuth`
- **API Endpoints**: 
  - `POST /api/auth/login`
- **Prisma Models**: `User`

### `/signup`
- **Status**: ✅ Implemented
- **File**: `pages/signup.vue`
- **Layout**: None (full page)
- **Middleware**: None
- **Composables**: `useAuth`
- **API Endpoints**:
  - `POST /api/auth/signup`
- **Prisma Models**: `User`

---

## 2. Main Application Routes

### `/` (Home/Landing)
- **Status**: ✅ Implemented
- **File**: `pages/index.vue`
- **Layout**: None
- **Middleware**: None
- **Composables**: None
- **API Endpoints**: None
- **Prisma Models**: None

### `/onboarding`
- **Status**: ✅ Implemented
- **File**: `pages/onboarding.vue`
- **Layout**: `default`
- **Middleware**: `auth`
- **Composables**: `useAuth`
- **API Endpoints**: None
- **Prisma Models**: `User`

### `/dashboard`
- **Status**: ✅ Implemented
- **File**: `pages/dashboard.vue`
- **Layout**: `default`
- **Middleware**: `auth`
- **Composables**: `useProjects`, `useDeployments`
- **API Endpoints**:
  - `GET /api/projects`
  - `GET /api/deployments`
- **Prisma Models**: `Project`, `Deployment`

---

## 3. Project Routes

### `/projects`
- **Status**: ✅ Implemented
- **File**: `pages/projects/index.vue`
- **Layout**: `default`
- **Middleware**: `auth`
- **Composables**: `useProjects`
- **API Endpoints**:
  - `GET /api/projects`
  - `DELETE /api/projects/:id`
- **Prisma Models**: `Project`

### `/projects/new`
- **Status**: ✅ Implemented
- **File**: `pages/projects/new.vue`
- **Layout**: `default`
- **Middleware**: `auth`
- **Composables**: `useProjects`
- **API Endpoints**:
  - `POST /api/projects`
- **Prisma Models**: `Project`

### `/projects/:id`
- **Status**: ✅ Implemented
- **File**: `pages/projects/[id].vue`
- **Layout**: `default`
- **Middleware**: `auth`
- **Composables**: `useProjects`, `useDeployments`
- **API Endpoints**:
  - `GET /api/projects/:id`
  - `GET /api/deployments?projectId=:id`
  - `POST /api/deployments`
- **Prisma Models**: `Project`, `Deployment`

### `/projects/:id/settings`
- **Status**: ✅ Implemented
- **File**: `pages/projects/[id]/settings.vue`
- **Layout**: `default`
- **Middleware**: `auth`
- **Composables**: `useProjects`
- **API Endpoints**:
  - `GET /api/projects/:id`
  - `PUT /api/projects/:id`
  - `DELETE /api/projects/:id`
- **Prisma Models**: `Project`

### `/projects/:id/deployments/:deploymentId`
- **Status**: ✅ Implemented
- **File**: `pages/projects/[id]/deployments/[deploymentId].vue`
- **Layout**: `default`
- **Middleware**: `auth`
- **Composables**: `useDeployments`
- **API Endpoints**:
  - `GET /api/deployments/:deploymentId`
- **Prisma Models**: `Deployment`

---

## 4. Deployment Routes

### `/deployments`
- **Status**: ✅ Implemented
- **File**: `pages/deployments/index.vue`
- **Layout**: `default`
- **Middleware**: `auth`
- **Composables**: `useDeployments`
- **API Endpoints**:
  - `GET /api/deployments`
- **Prisma Models**: `Deployment`

---

## 5. Activity Routes

### `/activity`
- **Status**: ✅ Implemented
- **File**: `pages/activity/index.vue`
- **Layout**: `default`
- **Middleware**: `auth`
- **Composables**: None (uses mock data)
- **API Endpoints**:
  - `GET /api/activities`
- **Prisma Models**: `Activity`

---

## 6. Team Routes

### `/team`
- **Status**: ✅ Implemented
- **File**: `pages/team/index.vue`
- **Layout**: `default`
- **Middleware**: `auth`
- **Composables**: `useTeams`
- **API Endpoints**:
  - `GET /api/teams/members`
  - `POST /api/teams/members`
  - `PUT /api/teams/members/:id`
  - `DELETE /api/teams/members/:id`
- **Prisma Models**: `TeamMember`, `User`

---

## 7. Settings Routes

### `/settings/profile`
- **Status**: ✅ Implemented
- **File**: `pages/settings/profile.vue`
- **Layout**: `default`
- **Middleware**: `auth`
- **Composables**: `useAuth`
- **API Endpoints**:
  - `GET /api/user/profile`
  - `PUT /api/user/profile`
- **Prisma Models**: `User`

### `/settings/tokens`
- **Status**: ✅ Implemented
- **File**: `pages/settings/tokens.vue`
- **Layout**: `default`
- **Middleware**: `auth`
- **Composables**: `useApiTokens`
- **API Endpoints**:
  - `GET /api/tokens`
  - `POST /api/tokens`
  - `DELETE /api/tokens/:id`
- **Prisma Models**: `ApiToken`

---

## 8. Blockchain Routes

### `/blockchain`
- **Status**: ✅ Implemented
- **File**: `pages/blockchain/index.vue`
- **Layout**: `default`
- **Middleware**: `auth`
- **Composables**: `useBlockchain`
- **API Endpoints**:
  - `POST /api/blockchain/connect`
  - `GET /api/blockchain/records`
  - `POST /api/blockchain/record`
  - `GET /api/blockchain/verify/:deploymentId`
- **Prisma Models**: `ChainRecord`

---

## 9. Product Routes

### `/products/3d-viewer`
- **Status**: ✅ Implemented
- **File**: `pages/products/3d-viewer.vue`
- **Layout**: `default`
- **Middleware**: `auth`
- **Composables**: `use3DModel`, `useAR`
- **API Endpoints**: None (client-side only)
- **Prisma Models**: None

---

## Required Prisma Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  avatarUrl String?  @map("avatar_url")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  
  projects     Project[]
  teamMembers  TeamMember[]
  apiTokens    ApiToken[]
  activities   Activity[]

  @@map("users")
}

model Project {
  id            String   @id @default(cuid())
  name          String
  slug          String   @unique
  description   String?
  repositoryUrl String?  @map("repository_url")
  status        String   @default("active")
  userId        String   @map("user_id")
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  
  deployments   Deployment[]

  @@map("projects")
}

model Deployment {
  id            String    @id @default(cuid())
  projectId     String    @map("project_id")
  project       Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  status        String    @default("pending")
  commitHash    String?   @map("commit_hash")
  commitMessage String?   @map("commit_message")
  deployedUrl   String?   @map("deployed_url")
  createdAt     DateTime  @default(now()) @map("created_at")
  completedAt   DateTime? @map("completed_at")
  
  chainRecords  ChainRecord[]

  @@map("deployments")
}

model TeamMember {
  id        String   @id @default(cuid())
  userId    String   @map("user_id")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name      String
  email     String
  role      String   @default("member")
  avatarUrl String?  @map("avatar_url")
  createdAt DateTime @default(now()) @map("created_at")

  @@map("team_members")
}

model ApiToken {
  id         String    @id @default(cuid())
  userId     String    @map("user_id")
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  name       String
  token      String    @unique
  lastUsed   DateTime? @map("last_used")
  expiresAt  DateTime? @map("expires_at")
  createdAt  DateTime  @default(now()) @map("created_at")

  @@map("api_tokens")
}

model Activity {
  id          String   @id @default(cuid())
  userId      String   @map("user_id")
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  type        String
  title       String
  description String
  metadata    Json?
  createdAt   DateTime @default(now()) @map("created_at")

  @@map("activities")
}

model ChainRecord {
  id              String     @id @default(cuid())
  deploymentId    String     @map("deployment_id")
  deployment      Deployment @relation(fields: [deploymentId], references: [id], onDelete: Cascade)
  transactionHash String     @map("transaction_hash")
  blockNumber     Int        @map("block_number")
  verified        Boolean    @default(false)
  createdAt       DateTime   @default(now()) @map("created_at")

  @@map("chain_records")
}
```

---

## Route Protection

All routes under `/dashboard`, `/projects`, `/deployments`, `/activity`, `/team`, `/settings`, and `/blockchain` are protected by the `auth` middleware.

Unauthenticated users are redirected to `/login`.

---

## Next Steps

1. Implement missing API endpoints
2. Add database migrations for Prisma schema
3. Connect composables to real API endpoints
4. Add proper error handling and loading states
5. Implement real-time updates using WebSockets or polling
