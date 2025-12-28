import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const teamId = getRouterParam(event, 'id')
  const method = getMethod(event)

  if (!teamId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Team ID is required'
    })
  }

  // GET - List team members
  if (method === 'GET') {
    try {
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
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch team members',
        data: { error: error.message }
      })
    }
  }

  // POST - Add a team member
  if (method === 'POST') {
    try {
      const body = await readBody(event)
      const { userId, role = 'member' } = body

      if (!userId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'userId is required'
        })
      }

      const member = await prisma.teamMember.create({
        data: {
          teamId,
          userId,
          role
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              avatarUrl: true
            }
          }
        }
      })

      return member
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to add team member',
        data: { error: error.message }
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})
