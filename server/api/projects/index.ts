import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // GET - List all projects
  if (method === 'GET') {
    try {
      const projects = await prisma.project.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          },
          _count: {
            select: {
              deployments: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return projects
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch projects',
        data: { error: error.message }
      })
    }
  }

  // POST - Create a new project
  if (method === 'POST') {
    try {
      const body = await readBody(event)
      const { name, description, repositoryUrl, userId, slug } = body

      if (!name || !userId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Name and userId are required'
        })
      }

      // Generate slug if not provided
      const projectSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')

      const project = await prisma.project.create({
        data: {
          name,
          slug: projectSlug,
          description,
          repositoryUrl,
          userId,
          status: 'active'
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
        statusMessage: 'Failed to create project',
        data: { error: error.message }
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})
