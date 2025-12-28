import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { projectId, deploymentData, walletAddress } = body

    if (!projectId || !deploymentData || !walletAddress) {
      throw createError({
        statusCode: 400,
        message: '缺少必要参数'
      })
    }

    // Simulate blockchain transaction
    const txHash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    const blockNumber = Math.floor(Math.random() * 10000000) + 1000000

    // Store chain record
    const chainRecord = await prisma.chainRecord.create({
      data: {
        projectId,
        txHash,
        blockNumber,
        eventType: 'deployment',
        data: deploymentData,
        verified: false
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

    return {
      success: true,
      txHash,
      blockNumber,
      record: chainRecord
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '记录部署到链上失败'
    })
  }
})
