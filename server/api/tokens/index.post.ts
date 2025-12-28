import { getAuthenticatedUser } from '~/server/utils/auth'
import { badRequestError, handlePrismaError } from '~/server/utils/errors'
import { prisma } from '~/server/utils/prisma'
import { randomBytes } from 'crypto'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const body = await readBody(event)

  // Validate required fields
  if (!body.name) {
    throw badRequestError('Token name is required')
  }

  // Generate a secure random token
  const tokenValue = `nova_${randomBytes(32).toString('hex')}`

  try {
    const token = await prisma.apiToken.create({
      data: {
        userId: user.id,
        name: body.name,
        token: tokenValue
      }
    })

    // Return the token value only once during creation
    return {
      id: token.id,
      name: token.name,
      token: tokenValue,
      createdAt: token.createdAt
    }
  } catch (error: any) {
    throw handlePrismaError(error)
  }
})
