import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        _count: {
          select: {
            deployments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return projects
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || '获取项目列表失败'
    })
  }
})
