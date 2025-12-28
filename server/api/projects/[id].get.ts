import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: '缺少项目ID'
      })
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        deployments: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },
        chainRecords: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        },
        _count: {
          select: {
            deployments: true,
            chainRecords: true
          }
        }
      }
    })

    if (!project) {
      throw createError({
        statusCode: 404,
        message: '项目不存在'
      })
    }

    return project
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '获取项目详情失败'
    })
  }
})
