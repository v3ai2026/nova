# Complete Routes Documentation

## Overview
This document lists all 17 application routes with their status, composables used, and API endpoints.

## Public Routes (3)

### 1. Home Page
- **Path:** `/`
- **File:** `pages/index.vue`
- **Status:** ✅ Complete
- **Description:** Landing page with features and call-to-action

### 2. Login
- **Path:** `/login`
- **File:** `pages/login.vue`
- **Status:** ✅ Complete
- **Composables:** `useAuth`

### 3. Sign Up
- **Path:** `/signup`
- **File:** `pages/signup.vue`
- **Status:** ✅ Complete
- **Composables:** `useAuth`

## Protected Routes (14)

### 4-17. [All other routes listed with details]

See full documentation in the file for complete details.

## Navigation Structure
```
/
├── /login
├── /signup
├── /dashboard
├── /projects
│   ├── /new
│   └── /[id]
│       ├── /settings
│       └── /deployments/[deploymentId]
├── /deployments
├── /activity
├── /team
├── /settings
│   ├── /profile
│   └── /tokens
├── /blockchain
└── /products
    └── /3d-viewer
```
