import { prisma } from '~/server/utils/prisma'
import { randomBytes } from 'crypto'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // GET - List all API tokens
  if (method === 'GET') {
    try {
      const query = getQuery(event)
      const userId = query.userId as string | undefined

      const tokens = await prisma.apiToken.findMany({
        where: userId ? { userId } : undefined,
        select: {
          id: true,
          name: true,
          token: false, // Don't return full token for security
          userId: true,
          lastUsedAt: true,
          expiresAt: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return tokens
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch tokens',
        data: { error: error.message }
      })
    }
  }

  // POST - Create a new API token
  if (method === 'POST') {
    try {
      const body = await readBody(event)
      const { name, userId, expiresAt } = body

      if (!name || !userId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Name and userId are required'
        })
      }

      // Generate a secure random token
      const token = `dh_${randomBytes(32).toString('hex')}`

      const apiToken = await prisma.apiToken.create({
        data: {
          name,
          token,
          userId,
          expiresAt: expiresAt ? new Date(expiresAt) : null
        }
      })

      // Return the full token only on creation
      return apiToken
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create token',
        data: { error: error.message }
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})
