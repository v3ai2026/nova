import { PrismaClient } from '@prisma/client'

// PrismaClient singleton to prevent connection pool exhaustion
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// 使用示例：
// import { prisma } from '~/server/utils/prisma'
// const users = await prisma.user.findMany()
