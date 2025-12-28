import { getAuthenticatedUser } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import { createError } from 'h3'
import { randomBytes } from 'crypto'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const body = await readBody(event)
  
  if (!body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Token name is required'
    })
  }
  
  // Generate cryptographically secure token
  const tokenValue = `dh_${randomBytes(32).toString('base64url')}`
  
  // Calculate expiration
  let expiresAt: Date | null = null
  if (body.expiresIn && body.expiresIn !== 'never') {
    const days = parseInt(body.expiresIn)
    expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000)
  }
  
  const token = await prisma.apiToken.create({
    data: {
      userId: user.id,
      name: body.name,
      token: tokenValue,
      expiresAt
    }
  })
  
  // Return the token value only once
  return {
    ...token,
    token: tokenValue
  }
})
