import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, slug, description, repositoryUrl, userId } = body

    if (!name || !slug || !userId) {
      throw createError({
        statusCode: 400,
        message: '缺少必要参数'
      })
    }

    // Check if slug already exists
    const existingProject = await prisma.project.findUnique({
      where: { slug }
    })

    if (existingProject) {
      throw createError({
        statusCode: 400,
        message: '项目标识已存在'
      })
    }

    const project = await prisma.project.create({
      data: {
        name,
        slug,
        description,
        repositoryUrl,
        status: 'active',
        userId
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
      message: error.message || '创建项目失败'
    })
  }
})
