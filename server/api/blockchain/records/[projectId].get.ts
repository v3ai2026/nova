import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const projectId = getRouterParam(event, 'projectId')

    if (!projectId) {
      throw createError({
        statusCode: 400,
        message: '缺少项目ID'
      })
    }

    const chainRecords = await prisma.chainRecord.findMany({
      where: { projectId },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return chainRecords
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '获取链上记录失败'
    })
  }
})
