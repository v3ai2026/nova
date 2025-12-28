import { getAuthenticatedUser } from '~/server/utils/auth'
import { notFoundError, forbiddenError } from '~/server/utils/errors'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw notFoundError('Project not found')
  }

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      deployments: {
        orderBy: { createdAt: 'desc' },
        take: 10
      },
      _count: {
        select: { deployments: true }
      }
    }
  })

  if (!project) {
    throw notFoundError('Project not found')
  }

  // Check if user owns the project
  if (project.userId !== user.id) {
    throw forbiddenError('You do not have access to this project')
  }

  return project
})
