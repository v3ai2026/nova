import { getAuthenticatedUser } from '~/server/utils/auth'
import { notFoundError, forbiddenError, handlePrismaError } from '~/server/utils/errors'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const id = getRouterParam(event, 'id')
  const memberId = getRouterParam(event, 'memberId')

  if (!id || !memberId) {
    throw notFoundError('Team or member not found')
  }

  const team = await prisma.team.findUnique({
    where: { id }
  })

  if (!team) {
    throw notFoundError('Team not found')
  }

  // Only owner or admin can remove members
  const userMember = await prisma.teamMember.findFirst({
    where: {
      teamId: id,
      userId: user.id
    }
  })

  if (team.ownerId !== user.id && (!userMember || userMember.role !== 'admin')) {
    throw forbiddenError('You do not have permission to remove members')
  }

  try {
    await prisma.teamMember.delete({
      where: { id: memberId }
    })

    return { success: true, message: 'Member removed successfully' }
  } catch (error: any) {
    throw handlePrismaError(error)
  }
})
