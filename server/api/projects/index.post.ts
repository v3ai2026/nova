import { getAuthenticatedUser } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const body = await readBody(event)
  
  // Validate required fields
  if (!body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Project name is required'
    })
  }
  
  // Generate slug from name
  const slug = body.slug || body.name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  
  // Check if slug already exists
  const existing = await prisma.project.findUnique({
    where: { slug }
  })
  
  if (existing) {
    throw createError({
      statusCode: 409,
      statusMessage: 'A project with this name already exists'
    })
  }
  
  const project = await prisma.project.create({
    data: {
      name: body.name,
      slug,
      description: body.description,
      repositoryUrl: body.repository_url || body.repositoryUrl,
      framework: body.framework,
      userId: user.id,
      status: 'active'
    }
  })
  
  return project
})
