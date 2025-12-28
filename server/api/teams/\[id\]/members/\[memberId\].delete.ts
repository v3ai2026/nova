import { getAuthenticatedUser } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const teamId = getRouterParam(event, 'id')
  const memberId = getRouterParam(event, 'memberId')
  
  if (!teamId || !memberId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Team ID and Member ID are required'
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
      statusMessage: 'You do not have permission to remove members'
    })
  }
  
  const targetMember = await prisma.teamMember.findUnique({
    where: { id: memberId }
  })
  
  if (!targetMember || targetMember.teamId !== teamId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Member not found'
    })
  }
  
  if (targetMember.role === 'owner' && requesterMembership.role !== 'owner') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Only owners can remove other owners'
    })
  }
  
  await prisma.teamMember.delete({
    where: { id: memberId }
  })
  
  return { success: true }
})
