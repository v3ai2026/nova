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
      statusMessage: 'Deployment ID is required'
    })
  }
  
  if (!body.status) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Status is required'
    })
  }
  
  // Verify deployment ownership
  const existing = await prisma.deployment.findFirst({
    where: {
      id,
      project: {
        userId: user.id
      }
    }
  })
  
  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Deployment not found'
    })
  }
  
  const updateData: any = {
    status: body.status
  }
  
  if (body.deployed_url || body.deployedUrl) {
    updateData.deployedUrl = body.deployed_url || body.deployedUrl
  }
  
  if (body.build_logs || body.buildLogs) {
    updateData.buildLogs = body.build_logs || body.buildLogs
  }
  
  if (body.status === 'success' || body.status === 'failed') {
    updateData.completedAt = new Date()
  }
  
  const deployment = await prisma.deployment.update({
    where: { id },
    data: updateData
  })
  
  return deployment
})
