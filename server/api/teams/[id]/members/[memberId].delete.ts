import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const teamId = getRouterParam(event, 'id')
  const memberId = getRouterParam(event, 'memberId')

  if (!teamId || !memberId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Team ID and Member ID are required'
    })
  }

  try {
    await prisma.teamMember.delete({
      where: {
        id: memberId,
        teamId
      }
    })

    return { success: true, message: 'Team member removed successfully' }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to remove team member',
      data: { error: error.message }
    })
  }
})
