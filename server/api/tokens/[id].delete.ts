import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: '缺少令牌ID'
      })
    }

    await prisma.apiToken.delete({
      where: { id }
    })

    return { success: true, message: '令牌删除成功' }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '删除令牌失败'
    })
  }
})
