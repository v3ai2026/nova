import { getAuthenticatedUser } from '~/server/utils/auth'
import { badRequestError, handlePrismaError } from '~/server/utils/errors'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const body = await readBody(event)

  // Validate required fields
  if (!body.name || !body.slug) {
    throw badRequestError('Name and slug are required')
  }

  try {
    const project = await prisma.project.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || null,
        repositoryUrl: body.repositoryUrl || null,
        status: body.status || 'active',
        userId: user.id
      }
    })

    return project
  } catch (error: any) {
    throw handlePrismaError(error)
  }
})
