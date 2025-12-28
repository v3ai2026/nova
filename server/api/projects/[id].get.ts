import { getAuthenticatedUser } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Project ID is required'
    })
  }
  
  const project = await prisma.project.findFirst({
    where: {
      id,
      userId: user.id
    },
    include: {
      deployments: {
        take: 5,
        orderBy: {
          createdAt: 'desc'
        }
      },
      _count: {
        select: {
          deployments: true
        }
      }
    }
  })
  
  if (!project) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Project not found'
    })
  }
  
  return project
})
