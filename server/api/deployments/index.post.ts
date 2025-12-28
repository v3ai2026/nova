import { getAuthenticatedUser } from '~/server/utils/auth'
import { badRequestError, forbiddenError, notFoundError, handlePrismaError } from '~/server/utils/errors'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const body = await readBody(event)

  // Validate required fields
  if (!body.projectId || !body.commitSha) {
    throw badRequestError('projectId and commitSha are required')
  }

  // Verify user owns the project
  const project = await prisma.project.findUnique({
    where: { id: body.projectId }
  })

  if (!project) {
    throw notFoundError('Project not found')
  }

  if (project.userId !== user.id) {
    throw forbiddenError('You do not have access to this project')
  }

  try {
    const deployment = await prisma.deployment.create({
      data: {
        projectId: body.projectId,
        branch: body.branch || 'main',
        commitSha: body.commitSha,
        commitMsg: body.commitMsg || null,
        status: 'pending',
        url: body.url || null
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    return deployment
  } catch (error: any) {
    throw handlePrismaError(error)
  }
})
