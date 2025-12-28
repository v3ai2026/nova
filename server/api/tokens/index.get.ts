import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    // In a real app, you'd get userId from session/auth
    const tokens = await prisma.apiToken.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return tokens
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || '获取令牌列表失败'
    })
  }
})
