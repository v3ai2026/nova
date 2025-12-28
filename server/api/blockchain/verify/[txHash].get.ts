import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const txHash = getRouterParam(event, 'txHash')

    if (!txHash) {
      throw createError({
        statusCode: 400,
        message: '缺少交易哈希'
      })
    }

    const chainRecord = await prisma.chainRecord.findUnique({
      where: { txHash },
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

    if (!chainRecord) {
      throw createError({
        statusCode: 404,
        message: '未找到链上记录'
      })
    }

    // Simulate verification
    const verified = true
    
    // Update verification status
    const updatedRecord = await prisma.chainRecord.update({
      where: { txHash },
      data: { verified }
    })

    return {
      success: true,
      verified,
      record: updatedRecord
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '验证链上记录失败'
    })
  }
})
