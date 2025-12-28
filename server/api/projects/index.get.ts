import { getAuthenticatedUser } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  
  const projects = await prisma.project.findMany({
    where: {
      userId: user.id
    },
    orderBy: {
      updatedAt: 'desc'
    },
    include: {
      _count: {
        select: {
          deployments: true
        }
      }
    }
  })
  
  return projects
})
