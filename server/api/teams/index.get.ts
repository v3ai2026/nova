import { getAuthenticatedUser } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  
  // Get teams where user is a member
  const teamMembers = await prisma.teamMember.findMany({
    where: {
      userId: user.id
    },
    include: {
      team: {
        include: {
          _count: {
            select: {
              members: true
            }
          }
        }
      }
    }
  })
  
  return teamMembers.map(tm => ({
    ...tm.team,
    userRole: tm.role
  }))
})
