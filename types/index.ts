export interface User {
  id: string
  email: string
  name?: string
  avatarUrl?: string
  bio?: string
  location?: string
  website?: string
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  slug: string
  description?: string
  repository_url?: string
  framework?: string
  status: 'active' | 'paused' | 'error'
  user_id: string
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
  build_logs?: string
  created_at: string
  completed_at?: string
}

export interface Team {
  id: string
  name: string
  slug: string
  description?: string
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  team_id: string
  user_id: string
  role: 'owner' | 'admin' | 'member'
  created_at: string
}

export interface ApiToken {
  id: string
  user_id: string
  name: string
  token: string
  last_used_at?: string
  expires_at?: string
  created_at: string
}

export interface ChainRecord {
  id: string
  project_id: string
  tx_hash: string
  block_number?: number
  network: string
  deployment_id?: string
  metadata?: string
  verified: boolean
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
