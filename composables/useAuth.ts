export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const profile = useState<any>('user-profile', () => null)

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    await initAuth()
    return data
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    profile.value = null
    await navigateTo('/login')
  }

  const initAuth = async () => {
    if (!user.value) {
      profile.value = null
      return
    }

    try {
      const data = await $fetch('/api/users/profile')
      profile.value = data
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      profile.value = null
    }
  }

  const updateProfile = async (data: { name?: string; email?: string }) => {
    try {
      const updated = await $fetch('/api/users/profile', {
        method: 'PUT',
        body: data
      })
      profile.value = updated
      return updated
    } catch (error) {
      throw error
    }
  }

  return {
    user,
    profile,
    signIn,
    signUp,
    signOut,
    initAuth,
    updateProfile
  }
}
