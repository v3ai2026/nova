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
    const body = await readBody(event)
    const { status } = body

    if (!status) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Status is required'
      })
    }

    const validStatuses = ['pending', 'building', 'success', 'failed']
    if (!validStatuses.includes(status)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      })
    }

    const deployment = await prisma.deployment.update({
      where: { id },
      data: {
        status,
        ...(status === 'success' || status === 'failed' 
          ? { completedAt: new Date() } 
          : {}
        )
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
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update deployment status',
      data: { error: error.message }
    })
  }
})
