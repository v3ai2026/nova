import { neon } from '@neondatabase/serverless'

// Validate environment variable
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// Neon Serverless SQL 连接
export const sql = neon(process.env.DATABASE_URL)

// 使用示例：
// const result = await sql`SELECT * FROM users WHERE id = ${userId}`
