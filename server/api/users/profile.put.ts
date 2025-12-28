import { getAuthenticatedUser } from '~/server/utils/auth'
import { handlePrismaError } from '~/server/utils/errors'
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  const body = await readBody(event)

  try {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: body.name !== undefined ? body.name : user.name,
        email: body.email !== undefined ? body.email : user.email
      }
    })

    return updatedUser
  } catch (error: any) {
    throw handlePrismaError(error)
  }
})
