import { sql } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const result = await sql`SELECT NOW() as time, version() as version`
    return {
      status: 'ok',
      database: 'connected',
      timestamp: result[0].time,
      version: result[0].version
    }
  } catch (error: any) {
    return {
      status: 'error',
      database: 'disconnected',
      error: error.message
    }
  }
})
