import { getAuthenticatedUser } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const body = await readBody(event)
  
  if (!body.projectId && !body.project_id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Project ID is required'
    })
  }
  
  const projectId = body.projectId || body.project_id
  
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
  
  const deployment = await prisma.deployment.create({
    data: {
      projectId,
      status: 'pending',
      commitHash: body.commit_hash || body.commitHash,
      commitMessage: body.commit_message || body.commitMessage
    },
    include: {
      project: true
    }
  })
  
  return deployment
})
