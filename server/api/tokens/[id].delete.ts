import { getAuthenticatedUser } from '~/server/utils/auth'
import { notFoundError, forbiddenError, handlePrismaError } from '~/server/utils/errors'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw notFoundError('Token not found')
  }

  const token = await prisma.apiToken.findUnique({
    where: { id }
  })

  if (!token) {
    throw notFoundError('Token not found')
  }

  // Check if user owns the token
  if (token.userId !== user.id) {
    throw forbiddenError('You do not have access to this token')
  }

  try {
    await prisma.apiToken.delete({
      where: { id }
    })

    return { success: true, message: 'Token deleted successfully' }
  } catch (error: any) {
    throw handlePrismaError(error)
  }
})
