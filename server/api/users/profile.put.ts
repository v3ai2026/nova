import { getAuthenticatedUser, syncUserToDatabase } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const body = await readBody(event)
  
  if (!body.name && !body.email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'At least one field must be provided'
    })
  }
  
  const updateData: any = {}
  
  if (body.name) updateData.name = body.name
  if (body.bio) updateData.bio = body.bio
  if (body.location) updateData.location = body.location
  if (body.website) updateData.website = body.website
  if (body.avatarUrl || body.avatar_url) {
    updateData.avatarUrl = body.avatarUrl || body.avatar_url
  }
  
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: updateData
  })
  
  return updatedUser
})
