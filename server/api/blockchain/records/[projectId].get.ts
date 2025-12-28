import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, 'projectId')

  if (!projectId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Project ID is required'
    })
  }

  try {
    const records = await prisma.chainRecord.findMany({
      where: { projectId },
      include: {
        deployment: {
          select: {
            id: true,
            status: true,
            commitHash: true,
            commitMessage: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return records
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch blockchain records',
      data: { error: error.message }
    })
  }
})
