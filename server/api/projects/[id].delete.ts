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

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id }
    })

    if (!project) {
      throw createError({
        statusCode: 404,
        message: '项目不存在'
      })
    }

    // Delete project (will cascade delete deployments and chain records)
    await prisma.project.delete({
      where: { id }
    })

    return { success: true, message: '项目删除成功' }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '删除项目失败'
    })
  }
})
