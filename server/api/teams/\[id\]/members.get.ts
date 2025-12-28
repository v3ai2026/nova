import { getAuthenticatedUser } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const teamId = getRouterParam(event, 'id')
  
  if (!teamId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Team ID is required'
    })
  }
  
  const membership = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId: user.id
    }
  })
  
  if (!membership) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You are not a member of this team'
    })
  }
  
  const members = await prisma.teamMember.findMany({
    where: { teamId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  })
  
  return members
})
