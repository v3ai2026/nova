import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { name, slug, description, repositoryUrl, status } = body

    if (!id) {
      throw createError({
        statusCode: 400,
        message: '缺少项目ID'
      })
    }

    // Check if slug is being changed and already exists
    if (slug) {
      const existingProject = await prisma.project.findFirst({
        where: {
          slug,
          NOT: { id }
        }
      })

      if (existingProject) {
        throw createError({
          statusCode: 400,
          message: '项目标识已存在'
        })
      }
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(repositoryUrl !== undefined && { repositoryUrl }),
        ...(status && { status })
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    })

    return project
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '更新项目失败'
    })
  }
})
