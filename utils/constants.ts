// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh'
  },
  PROJECTS: {
    LIST: '/api/projects',
    CREATE: '/api/projects',
    GET: (id: string) => `/api/projects/${id}`,
    UPDATE: (id: string) => `/api/projects/${id}`,
    DELETE: (id: string) => `/api/projects/${id}`
  },
  DEPLOYMENTS: {
    LIST: (projectId: string) => `/api/projects/${projectId}/deployments`,
    CREATE: (projectId: string) => `/api/projects/${projectId}/deployments`,
    GET: (projectId: string, deploymentId: string) => `/api/projects/${projectId}/deployments/${deploymentId}`,
    CANCEL: (projectId: string, deploymentId: string) => `/api/projects/${projectId}/deployments/${deploymentId}/cancel`
  }
}

// Status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
}

// Deployment statuses
export const DEPLOYMENT_STATUS = {
  PENDING: 'pending',
  BUILDING: 'building',
  SUCCESS: 'success',
  FAILED: 'failed'
} as const

// Project statuses
export const PROJECT_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  ERROR: 'error'
} as const

// Notification types
export const NOTIFICATION_TYPE = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
} as const

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 20,
  MAX_PER_PAGE: 100
}

// Theme
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark'
} as const

// Storage keys
export const STORAGE_KEYS = {
  THEME: 'theme',
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences'
}
