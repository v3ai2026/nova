import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const method = getMethod(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Project ID is required'
    })
  }

  // GET - Get a single project
  if (method === 'GET') {
    try {
      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          },
          deployments: {
            orderBy: { createdAt: 'desc' },
            take: 10
          },
          _count: {
            select: {
              deployments: true,
              chainRecords: true
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
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch project',
        data: { error: error.message }
      })
    }
  }

  // PUT - Update a project
  if (method === 'PUT') {
    try {
      const body = await readBody(event)
      const { name, description, repositoryUrl, status } = body

      const project = await prisma.project.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(description !== undefined && { description }),
          ...(repositoryUrl !== undefined && { repositoryUrl }),
          ...(status && { status })
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        }
      })

      return project
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update project',
        data: { error: error.message }
      })
    }
  }

  // DELETE - Delete a project
  if (method === 'DELETE') {
    try {
      await prisma.project.delete({
        where: { id }
      })

      return { success: true, message: 'Project deleted successfully' }
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete project',
        data: { error: error.message }
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})
