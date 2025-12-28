import { getAuthenticatedUser } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getAuthenticatedUser(event)
  return user
})
