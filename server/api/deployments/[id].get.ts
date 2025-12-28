import { getAuthenticatedUser } from '~/server/utils/auth'
import { notFoundError, forbiddenError } from '~/server/utils/errors'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw notFoundError('Deployment not found')
  }

  const deployment = await prisma.deployment.findUnique({
    where: { id },
    include: {
      project: true
    }
  })

  if (!deployment) {
    throw notFoundError('Deployment not found')
  }

  // Check if user owns the project
  if (deployment.project.userId !== user.id) {
    throw forbiddenError('You do not have access to this deployment')
  }

  return deployment
})
