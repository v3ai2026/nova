import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { status } = body

    if (!id) {
      throw createError({
        statusCode: 400,
        message: '缺少部署ID'
      })
    }

    if (!status) {
      throw createError({
        statusCode: 400,
        message: '缺少状态参数'
      })
    }

    const deployment = await prisma.deployment.update({
      where: { id },
      data: { status },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    })

    return deployment
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '更新部署状态失败'
    })
  }
})
