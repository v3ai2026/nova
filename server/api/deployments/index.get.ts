import { getAuthenticatedUser } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const query = getQuery(event)
  const projectId = query.projectId as string | undefined
  
  const where: any = {
    project: {
      userId: user.id
    }
  }
  
  if (projectId) {
    where.projectId = projectId
  }
  
  const deployments = await prisma.deployment.findMany({
    where,
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      }
    },
    take: 50
  })
  
  return deployments
})
