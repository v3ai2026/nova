import { getAuthenticatedUser } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  
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
  
  // Update project
  const project = await prisma.project.update({
    where: { id },
    data: {
      name: body.name,
      description: body.description,
      repositoryUrl: body.repository_url || body.repositoryUrl,
      framework: body.framework,
      status: body.status
    }
  })
  
  return project
})
