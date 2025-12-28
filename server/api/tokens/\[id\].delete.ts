import { getAuthenticatedUser } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Token ID is required'
    })
  }
  
  // Verify ownership
  const token = await prisma.apiToken.findFirst({
    where: {
      id,
      userId: user.id
    }
  })
  
  if (!token) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Token not found'
    })
  }
  
  await prisma.apiToken.delete({
    where: { id }
  })
  
  return { success: true }
})
