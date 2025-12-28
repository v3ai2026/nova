import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { projectId, userId, branch, commitSha, commitMessage } = body

    if (!projectId || !userId || !commitSha) {
      throw createError({
        statusCode: 400,
        message: '缺少必要参数'
      })
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    })

    if (!project) {
      throw createError({
        statusCode: 404,
        message: '项目不存在'
      })
    }

    const deployment = await prisma.deployment.create({
      data: {
        projectId,
        userId,
        branch: branch || 'main',
        commitSha,
        commitMessage,
        status: 'pending'
      },
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
      message: error.message || '创建部署失败'
    })
  }
})
