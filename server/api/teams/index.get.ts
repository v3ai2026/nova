import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true
              }
            }
          }
        },
        _count: {
          select: {
            members: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return teams
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || '获取团队列表失败'
    })
  }
})
