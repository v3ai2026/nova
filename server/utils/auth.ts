import type { H3Event } from 'h3'
import { createError } from 'h3'
import { serverSupabaseUser } from '#supabase/server'
import { prisma } from './prisma'

/**
 * Require authentication for an API route
 * Returns the authenticated Supabase user or throws 401 error
 */
export async function requireAuth(event: H3Event) {
  const user = await serverSupabaseUser(event)
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
  
  return user
}

/**
 * Sync Supabase user to Prisma database
 * Creates or updates user record in Prisma
 */
export async function syncUserToDatabase(supabaseUser: any) {
  const userData = {
    email: supabaseUser.email!,
    name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name,
    avatarUrl: supabaseUser.user_metadata?.avatar_url,
    updatedAt: new Date()
  }

  return await prisma.user.upsert({
    where: { email: supabaseUser.email! },
    update: userData,
    create: {
      id: supabaseUser.id,
      ...userData,
    }
  })
}

/**
 * Get or create user in database from Supabase session
 */
export async function getAuthenticatedUser(event: H3Event) {
  const supabaseUser = await requireAuth(event)
  return await syncUserToDatabase(supabaseUser)
}
