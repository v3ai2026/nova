import { getAuthenticatedUser } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const teamId = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  if (!teamId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Team ID is required'
    })
  }
  
  if (!body.userId && !body.user_id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required'
    })
  }
  
  const requesterMembership = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId: user.id,
      role: {
        in: ['owner', 'admin']
      }
    }
  })
  
  if (!requesterMembership) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You do not have permission to add members'
    })
  }
  
  const targetUserId = body.userId || body.user_id
  const role = body.role || 'member'
  
  const existing = await prisma.teamMember.findFirst({
    where: {
      teamId,
      userId: targetUserId
    }
  })
  
  if (existing) {
    throw createError({
      statusCode: 409,
      statusMessage: 'User is already a member of this team'
    })
  }
  
  const member = await prisma.teamMember.create({
    data: {
      teamId,
      userId: targetUserId,
      role
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true
        }
      }
    }
  })
  
  return member
})
