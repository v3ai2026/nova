import { getAuthenticatedUser } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const query = getQuery(event)

  const where: any = {
    project: {
      userId: user.id
    }
  }

  // Filter by project if specified
  if (query.projectId) {
    where.projectId = query.projectId as string
  }

  const deployments = await prisma.deployment.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      }
    },
    take: query.limit ? parseInt(query.limit as string) : 50
  })

  return deployments
})
