import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Token ID is required'
    })
  }

  try {
    await prisma.apiToken.delete({
      where: { id }
    })

    return { success: true, message: 'Token deleted successfully' }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete token',
      data: { error: error.message }
    })
  }
})
