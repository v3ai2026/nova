import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    // Get counts
    const [
      totalProjects,
      totalDeployments,
      successfulDeployments,
      totalUsers,
      totalChainRecords
    ] = await Promise.all([
      prisma.project.count(),
      prisma.deployment.count(),
      prisma.deployment.count({ where: { status: 'success' } }),
      prisma.user.count(),
      prisma.chainRecord.count()
    ])

    // Calculate success rate
    const successRate = totalDeployments > 0 
      ? ((successfulDeployments / totalDeployments) * 100).toFixed(1)
      : '0.0'

    return {
      totalProjects,
      totalDeployments,
      activeDeployments: successfulDeployments, // Number of successful deployments
      totalUsers,
      totalChainRecords,
      successRate: parseFloat(successRate)
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || '获取统计数据失败'
    })
  }
})
