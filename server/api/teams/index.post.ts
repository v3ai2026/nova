import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, slug, ownerId } = body

    if (!name || !slug || !ownerId) {
      throw createError({
        statusCode: 400,
        message: '缺少必要参数'
      })
    }

    // Check if slug already exists
    const existingTeam = await prisma.team.findUnique({
      where: { slug }
    })

    if (existingTeam) {
      throw createError({
        statusCode: 400,
        message: '团队标识已存在'
      })
    }

    const team = await prisma.team.create({
      data: {
        name,
        slug,
        ownerId
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    })

    return team
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '创建团队失败'
    })
  }
})
