import { getAuthenticatedUser } from '~/server/utils/auth'
import { notFoundError, forbiddenError, badRequestError, handlePrismaError } from '~/server/utils/errors'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw notFoundError('Team not found')
  }

  if (!body.userId) {
    throw badRequestError('userId is required')
  }

  const team = await prisma.team.findUnique({
    where: { id }
  })

  if (!team) {
    throw notFoundError('Team not found')
  }

  // Only owner or admin can add members
  const userMember = await prisma.teamMember.findFirst({
    where: {
      teamId: id,
      userId: user.id
    }
  })

  if (team.ownerId !== user.id && (!userMember || userMember.role !== 'admin')) {
    throw forbiddenError('You do not have permission to add members')
  }

  try {
    const member = await prisma.teamMember.create({
      data: {
        teamId: id,
        userId: body.userId,
        role: body.role || 'member'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return member
  } catch (error: any) {
    throw handlePrismaError(error)
  }
})
