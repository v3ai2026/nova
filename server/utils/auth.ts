import { H3Event } from 'h3'
import { serverSupabaseUser } from '#supabase/server'
import { prisma } from './prisma'

/**
 * Get authenticated user from Supabase and sync with Prisma database
 */
export async function getAuthenticatedUser(event: H3Event) {
  const supabaseUser = await serverSupabaseUser(event)
  
  if (!supabaseUser) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  // Sync user with Prisma database
  let user = await prisma.user.findUnique({
    where: { id: supabaseUser.id }
  })

  if (!user) {
    // Create user in Prisma database if not exists
    user = await prisma.user.create({
      data: {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || null
      }
    })
  }

  return user
}

/**
 * Optional authentication - returns user if authenticated, null otherwise
 */
export async function getOptionalUser(event: H3Event) {
  try {
    return await getAuthenticatedUser(event)
  } catch {
    return null
  }
}
