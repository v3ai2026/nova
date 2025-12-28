import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // GET - List deployments
  if (method === 'GET') {
    try {
      const query = getQuery(event)
      const projectId = query.projectId as string | undefined

      const deployments = await prisma.deployment.findMany({
        where: projectId ? { projectId } : undefined,
        include: {
          project: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          _count: {
            select: {
              chainRecords: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return deployments
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch deployments',
        data: { error: error.message }
      })
    }
  }

  // POST - Create a new deployment
  if (method === 'POST') {
    try {
      const body = await readBody(event)
      const { projectId, commitHash, commitMessage, deployedUrl } = body

      if (!projectId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'projectId is required'
        })
      }

      const deployment = await prisma.deployment.create({
        data: {
          projectId,
          status: 'pending',
          commitHash,
          commitMessage,
          deployedUrl
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      })

      return deployment
    } catch (error: any) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create deployment',
        data: { error: error.message }
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})
