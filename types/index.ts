export interface User {
  id: string
  email: string
  name?: string | null
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  name: string
  slug: string
  description?: string | null
  repositoryUrl?: string | null
  status: 'active' | 'paused' | 'error'
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Deployment {
  id: string
  projectId: string
  branch: string
  commitSha: string
  commitMsg?: string | null
  status: 'pending' | 'building' | 'success' | 'failed'
  url?: string | null
  createdAt: string
  updatedAt: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  owner_id: string
  created_at: string
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  read: boolean
  created_at: string
}
