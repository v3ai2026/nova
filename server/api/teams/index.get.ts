import { getAuthenticatedUser } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  
  // Get teams where user is owner or member
  const teams = await prisma.team.findMany({
    where: {
      OR: [
        { ownerId: user.id },
        { members: { some: { userId: user.id } } }
      ]
    },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      _count: {
        select: { members: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return teams
})
