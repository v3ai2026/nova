import { getAuthenticatedUser } from '~/server/utils/auth'
import { notFoundError, forbiddenError, badRequestError, handlePrismaError } from '~/server/utils/errors'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw notFoundError('Deployment not found')
  }

  if (!body.status) {
    throw badRequestError('Status is required')
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

  try {
    const updatedDeployment = await prisma.deployment.update({
      where: { id },
      data: {
        status: body.status,
        url: body.url !== undefined ? body.url : deployment.url
      }
    })

    return updatedDeployment
  } catch (error: any) {
    throw handlePrismaError(error)
  }
})
