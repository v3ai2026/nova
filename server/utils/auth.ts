import type { H3Event } from 'h3'

export const requireAuth = async (event: H3Event) => {
  const user = event.context.user
  
  if (!user) {
    throw createError({
      statusCode: 401,
      message: '未授权访问'
    })
  }
  
  return user
}

export const getAuthUser = (event: H3Event) => {
  return event.context.user
}
