import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const txHash = getRouterParam(event, 'txHash')

  if (!txHash) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Transaction hash is required'
    })
  }

  try {
    const record = await prisma.chainRecord.findUnique({
      where: { txHash },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        deployment: {
          select: {
            id: true,
            status: true,
            commitHash: true,
            commitMessage: true
          }
        }
      }
    })

    if (!record) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Chain record not found'
      })
    }

    // In a real implementation, this would verify the transaction on-chain
    // For now, we'll mark it as verified
    const verifiedRecord = await prisma.chainRecord.update({
      where: { txHash },
      data: { verified: true }
    })

    return {
      verified: true,
      record: {
        ...record,
        verified: true
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to verify deployment',
      data: { error: error.message }
    })
  }
})
