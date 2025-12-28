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
  
  if (!body.txHash && !body.tx_hash) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Transaction hash is required'
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
  
  const txHash = body.txHash || body.tx_hash
  
  // Check if record already exists
  const existing = await prisma.chainRecord.findUnique({
    where: { txHash }
  })
  
  if (existing) {
    throw createError({
      statusCode: 409,
      statusMessage: 'This transaction has already been recorded'
    })
  }
  
  // Create chain record
  const record = await prisma.chainRecord.create({
    data: {
      projectId,
      txHash,
      blockNumber: body.blockNumber || body.block_number,
      network: body.network || 'ethereum',
      deploymentId: body.deploymentId || body.deployment_id,
      metadata: body.metadata ? JSON.stringify(body.metadata) : null,
      verified: false
    }
  })
  
  return record
})
