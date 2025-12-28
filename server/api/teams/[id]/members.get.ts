import { getAuthenticatedUser } from '~/server/utils/auth'
import { notFoundError, forbiddenError } from '~/server/utils/errors'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw notFoundError('Team not found')
  }

  const team = await prisma.team.findUnique({
    where: { id }
  })

  if (!team) {
    throw notFoundError('Team not found')
  }

  // Check if user is owner or member
  const isMember = await prisma.teamMember.findFirst({
    where: {
      teamId: id,
      userId: user.id
    }
  })

  if (team.ownerId !== user.id && !isMember) {
    throw forbiddenError('You do not have access to this team')
  }

  const members = await prisma.teamMember.findMany({
    where: { teamId: id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: { createdAt: 'asc' }
  })

  return members
})
