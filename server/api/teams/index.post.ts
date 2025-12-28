import { getAuthenticatedUser } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import { createError } from 'h3'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const body = await readBody(event)
  
  if (!body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Team name is required'
    })
  }
  
  // Generate slug
  const slug = body.slug || body.name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  
  // Check if slug exists
  const existing = await prisma.team.findUnique({
    where: { slug }
  })
  
  if (existing) {
    throw createError({
      statusCode: 409,
      statusMessage: 'A team with this name already exists'
    })
  }
  
  // Create team and add creator as owner
  const team = await prisma.team.create({
    data: {
      name: body.name,
      slug,
      description: body.description,
      members: {
        create: {
          userId: user.id,
          role: 'owner'
        }
      }
    },
    include: {
      members: true
    }
  })
  
  return team
})
