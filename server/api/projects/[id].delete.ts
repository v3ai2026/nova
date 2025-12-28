import { getAuthenticatedUser } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Project ID is required'
    })
  }
  
  // Verify ownership
  const existing = await prisma.project.findFirst({
    where: {
      id,
      userId: user.id
    }
  })
  
  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Project not found'
    })
  }
  
  // Delete project (cascade will delete related deployments)
  await prisma.project.delete({
    where: { id }
  })
  
  return { success: true }
})
