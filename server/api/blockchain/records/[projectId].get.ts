import { getAuthenticatedUser } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const projectId = getRouterParam(event, 'projectId')
  
  if (!projectId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Project ID is required'
    })
  }
  
  // Verify project ownership
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId: user.id
    }
  })
  
  if (!project) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Project not found'
    })
  }
  
  const records = await prisma.chainRecord.findMany({
    where: { projectId },
    orderBy: {
      createdAt: 'desc'
    }
  })
  
  return records
})
