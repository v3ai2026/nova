import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Deployment ID is required'
    })
  }

  try {
    const deployment = await prisma.deployment.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            slug: true,
            repositoryUrl: true
          }
        },
        chainRecords: {
          orderBy: { createdAt: 'desc' }
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
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch deployment',
      data: { error: error.message }
    })
  }
})
