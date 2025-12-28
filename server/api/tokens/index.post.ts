import { prisma } from '~/server/utils/prisma'
import crypto from 'crypto'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, userId } = body

    if (!name || !userId) {
      throw createError({
        statusCode: 400,
        message: '缺少必要参数'
      })
    }

    // Generate random token
    const token = `nova_${crypto.randomBytes(32).toString('hex')}`

    const apiToken = await prisma.apiToken.create({
      data: {
        name,
        userId,
        token
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

    return apiToken
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || '创建令牌失败'
    })
  }
})
