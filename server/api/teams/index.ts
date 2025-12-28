import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // GET - List all teams
  if (method === 'GET') {
    try {
      const teams = await prisma.team.findMany({
        include: {
          _count: {
            select: {
              members: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return teams
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch teams',
        data: { error: error.message }
      })
    }
  }

  // POST - Create a new team
  if (method === 'POST') {
    try {
      const body = await readBody(event)
      const { name, ownerId, slug } = body

      if (!name || !ownerId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Name and ownerId are required'
        })
      }

      // Generate slug if not provided
      const teamSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')

      const team = await prisma.team.create({
        data: {
          name,
          slug: teamSlug,
          ownerId
        }
      })

      // Add the owner as a team member
      await prisma.teamMember.create({
        data: {
          teamId: team.id,
          userId: ownerId,
          role: 'owner'
        }
      })

      return team
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create team',
        data: { error: error.message }
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})
