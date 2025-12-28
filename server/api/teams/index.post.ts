import { getAuthenticatedUser } from '~/server/utils/auth'
import { badRequestError, handlePrismaError } from '~/server/utils/errors'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const body = await readBody(event)

  // Validate required fields
  if (!body.name || !body.slug) {
    throw badRequestError('Name and slug are required')
  }

  try {
    const team = await prisma.team.create({
      data: {
        name: body.name,
        slug: body.slug,
        ownerId: user.id
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return team
  } catch (error: any) {
    throw handlePrismaError(error)
  }
})
