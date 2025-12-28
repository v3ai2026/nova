import { getAuthenticatedUser } from '~/server/utils/auth'
import { notFoundError, forbiddenError, handlePrismaError } from '~/server/utils/errors'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw notFoundError('Project not found')
  }

  const project = await prisma.project.findUnique({
    where: { id }
  })

  if (!project) {
    throw notFoundError('Project not found')
  }

  // Check if user owns the project
  if (project.userId !== user.id) {
    throw forbiddenError('You do not have access to this project')
  }

  try {
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        name: body.name || project.name,
        slug: body.slug || project.slug,
        description: body.description !== undefined ? body.description : project.description,
        repositoryUrl: body.repositoryUrl !== undefined ? body.repositoryUrl : project.repositoryUrl,
        status: body.status || project.status
      }
    })

    return updatedProject
  } catch (error: any) {
    throw handlePrismaError(error)
  }
})
