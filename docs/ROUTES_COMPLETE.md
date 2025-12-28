# Complete Routes Guide

This document provides a comprehensive overview of all routes in the DeployHub application.

## Table of Contents

- [Public Routes](#public-routes)
- [Authentication Routes](#authentication-routes)
- [Dashboard & Overview](#dashboard--overview)
- [Projects](#projects)
- [Deployments](#deployments)
- [Team Management](#team-management)
- [Settings](#settings)
- [Blockchain](#blockchain)
- [Advanced Features](#advanced-features)

---

## Public Routes

### Landing Page
- **Path**: `/`
- **Component**: `pages/index.vue`
- **Description**: Public landing page with product information
- **Middleware**: None

---

## Authentication Routes

### Login
- **Path**: `/login`
- **Component**: `pages/login.vue`
- **Description**: User login page
- **Middleware**: None

### Sign Up
- **Path**: `/signup`
- **Component**: `pages/signup.vue`
- **Description**: New user registration
- **Middleware**: None

### Onboarding
- **Path**: `/onboarding`
- **Component**: `pages/onboarding.vue`
- **Description**: First-time user onboarding flow
- **Middleware**: `auth`

---

## Dashboard & Overview

### Dashboard
- **Path**: `/dashboard`
- **Component**: `pages/dashboard.vue`
- **Description**: Main dashboard with stats, recent deployments, and quick actions
- **Middleware**: `auth`
- **Features**:
  - Stats cards (projects, deployments, success rate)
  - Recent deployments list
  - Activity feed
  - Quick action buttons

---

## Projects

### Projects List
- **Path**: `/projects`
- **Component**: `pages/projects/index.vue`
- **Description**: View all projects with search and filters
- **Middleware**: `auth`
- **Features**:
  - Project cards grid
  - Search functionality
  - Status filters
  - Create new project button

### Create Project
- **Path**: `/projects/new`
- **Component**: `pages/projects/new.vue`
- **Description**: Create a new project
- **Middleware**: `auth`
- **Features**:
  - Project details form
  - Repository URL input
  - Blockchain verification option
  - Auto-deploy configuration

### Project Details
- **Path**: `/projects/:id`
- **Component**: `pages/projects/[id].vue`
- **Description**: View single project with tabs
- **Middleware**: `auth`
- **Tabs**:
  - Deployments - View deployment history
  - Activity - Project activity feed
  - Settings - Project configuration

### Project Settings
- **Path**: `/projects/:id/settings`
- **Component**: `pages/projects/[id]/settings.vue`
- **Description**: Detailed project configuration
- **Middleware**: `auth`
- **Features**:
  - General settings
  - Environment variables
  - Build configuration
  - Danger zone (pause/delete)

### Deployment Details
- **Path**: `/projects/:id/deployments/:deploymentId`
- **Component**: `pages/projects/[id]/deployments/[deploymentId].vue`
- **Description**: View single deployment details
- **Middleware**: `auth`
- **Features**:
  - Deployment status
  - Build logs
  - Commit information
  - Blockchain verification

---

## Deployments

### All Deployments
- **Path**: `/deployments`
- **Component**: `pages/deployments/index.vue`
- **Description**: View all deployments across all projects
- **Middleware**: `auth`
- **Features**:
  - Stats cards (total, successful, failed, in progress)
  - Search and filter
  - Deployment cards with status
  - Quick actions

---

## Team Management

### Team Overview
- **Path**: `/team`
- **Component**: `pages/team/index.vue`
- **Description**: Manage team members and permissions
- **Middleware**: `auth`
- **Features**:
  - Team members list
  - Invite new members
  - Role management
  - Remove members

---

## Settings

### Profile Settings
- **Path**: `/settings/profile`
- **Component**: `pages/settings/profile.vue`
- **Description**: User profile settings
- **Middleware**: `auth`
- **Features**:
  - Personal information
  - Avatar upload
  - Account settings

### API Tokens
- **Path**: `/settings/tokens`
- **Component**: `pages/settings/tokens.vue`
- **Description**: Manage API tokens
- **Middleware**: `auth`
- **Features**:
  - List all tokens
  - Create new token
  - Set expiration
  - Delete tokens
  - Copy token value

---

## Blockchain

### Blockchain Overview
- **Path**: `/blockchain`
- **Component**: `pages/blockchain/index.vue`
- **Description**: Blockchain verification and wallet management
- **Middleware**: `auth`
- **Features**:
  - Wallet connection (MetaMask)
  - View blockchain records
  - Verify deployments
  - Transaction history

---

## Advanced Features

### Activity Feed
- **Path**: `/activity`
- **Component**: `pages/activity/index.vue`
- **Description**: Global activity feed
- **Middleware**: `auth`
- **Features**:
  - All system events
  - Activity filters
  - Timeline view
  - Activity stats

### 3D Product Viewer
- **Path**: `/products/3d-viewer`
- **Component**: `pages/products/3d-viewer.vue`
- **Description**: Interactive 3D model viewer
- **Middleware**: `auth`
- **Features**:
  - 3D model loading
  - Rotation and zoom controls
  - AR support detection
  - Model library
  - Upload functionality

---

## Route Patterns

### Dynamic Routes
All routes with `:id` or `[id]` are dynamic routes that accept parameters:
- `:id` - Project ID
- `:deploymentId` - Deployment ID
- `:memberId` - Team member ID

### Protected Routes
All routes except `/`, `/login`, and `/signup` require authentication via the `auth` middleware.

### Layout Structure
- **Default Layout**: Used for dashboard and main app pages
- **Auth Layout**: Used for login/signup pages
- **Dashboard Layout**: Used for settings pages

---

## Navigation Structure

```
├── Dashboard (/)
├── Projects (/projects)
│   ├── Project Details (/projects/:id)
│   │   ├── Deployments (tab)
│   │   ├── Activity (tab)
│   │   └── Settings (tab)
│   ├── New Project (/projects/new)
│   └── Deployment Details (/projects/:id/deployments/:deploymentId)
├── Deployments (/deployments)
├── Activity (/activity)
├── Team (/team)
├── Blockchain (/blockchain)
├── Settings
│   ├── Profile (/settings/profile)
│   └── API Tokens (/settings/tokens)
└── Advanced
    └── 3D Viewer (/products/3d-viewer)
```

---

## Quick Links Reference

| Feature | Route |
|---------|-------|
| Main Dashboard | `/dashboard` |
| Create Project | `/projects/new` |
| View All Projects | `/projects` |
| View All Deployments | `/deployments` |
| Team Management | `/team` |
| API Tokens | `/settings/tokens` |
| Blockchain | `/blockchain` |
| Activity Feed | `/activity` |
| 3D Viewer | `/products/3d-viewer` |

---

## Notes

- All authenticated routes redirect to `/login` if user is not logged in
- After login, users are redirected to `/dashboard`
- First-time users are redirected to `/onboarding`
- 404 pages are handled automatically by Nuxt

For API endpoint documentation, see [API_ENDPOINTS.md](./API_ENDPOINTS.md)
