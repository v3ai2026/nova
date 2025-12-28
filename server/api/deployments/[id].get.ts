import { getAuthenticatedUser } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Deployment ID is required'
    })
  }
  
  const deployment = await prisma.deployment.findFirst({
    where: {
      id,
      project: {
        userId: user.id
      }
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          slug: true,
          repositoryUrl: true
        }
      }
    }
  })
  
  if (!deployment) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Deployment not found'
    })
  }
  
  return deployment
})
