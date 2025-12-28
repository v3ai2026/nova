import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const userId = query.userId as string | undefined

    // Get total projects
    const totalProjects = await prisma.project.count({
      where: userId ? { userId } : undefined
    })

    // Get total deployments
    const totalDeployments = await prisma.deployment.count({
      where: userId ? { project: { userId } } : undefined
    })

    // Get deployments by status
    const deploymentsByStatus = await prisma.deployment.groupBy({
      by: ['status'],
      where: userId ? { project: { userId } } : undefined,
      _count: {
        status: true
      }
    })

    const statusCounts = deploymentsByStatus.reduce((acc, item) => {
      acc[item.status] = item._count.status
      return acc
    }, {} as Record<string, number>)

    // Calculate success rate
    const successCount = statusCounts.success || 0
    const failedCount = statusCounts.failed || 0
    const successRate = totalDeployments > 0
      ? ((successCount / (successCount + failedCount)) * 100).toFixed(1)
      : '0.0'

    // Get recent deployments
    const recentDeployments = await prisma.deployment.findMany({
      where: userId ? { project: { userId } } : undefined,
      include: {
        project: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    // Get active projects
    const activeProjects = await prisma.project.count({
      where: {
        ...(userId ? { userId } : {}),
        status: 'active'
      }
    })

    return {
      totalProjects,
      totalDeployments,
      activeProjects,
      successRate: parseFloat(successRate),
      deploymentsByStatus: statusCounts,
      recentDeployments
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch stats',
      data: { error: error.message }
    })
  }
})
