import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // GET - Get user profile
  if (method === 'GET') {
    try {
      const query = getQuery(event)
      const userId = query.userId as string

      if (!userId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'userId is required'
        })
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          _count: {
            select: {
              projects: true,
              apiTokens: true,
              teamMembers: true
            }
          }
        }
      })

      if (!user) {
        throw createError({
          statusCode: 404,
          statusMessage: 'User not found'
        })
      }

      return user
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch user profile',
        data: { error: error.message }
      })
    }
  }

  // PUT - Update user profile
  if (method === 'PUT') {
    try {
      const body = await readBody(event)
      const { userId, name, avatarUrl } = body

      if (!userId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'userId is required'
        })
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(name !== undefined && { name }),
          ...(avatarUrl !== undefined && { avatarUrl })
        }
      })

      return user
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update user profile',
        data: { error: error.message }
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})
