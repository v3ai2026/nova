export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

export interface Project {
  id: string
  name: string
  slug: string
  description?: string
  repository_url?: string
  status: 'active' | 'paused' | 'error'
  created_at: string
  updated_at: string
}

export interface Deployment {
  id: string
  project_id: string
  status: 'pending' | 'building' | 'success' | 'failed'
  commit_hash?: string
  commit_message?: string
  deployed_url?: string
  created_at: string
  completed_at?: string
  project?: {
    id: string
    name: string
    slug: string
  }
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
