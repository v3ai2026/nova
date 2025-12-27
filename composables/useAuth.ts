export const useAuth = () => {
  const { $supabase } = useNuxtApp()
  const user = useState('user', () => null)
  const profile = useState('profile', () => null)

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await $supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })

    if (error) throw error

    if (data.user) {
      await $supabase.from('profiles').insert({
        id: data.user.id,
        email: data.user.email,
        full_name: fullName
      })
    }

    return data
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await $supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await $supabase.auth.signOut()
    if (error) throw error
    user.value = null
    profile.value = null
    navigateTo('/login')
  }

  const getUser = async () => {
    const { data: { user: authUser } } = await $supabase.auth.getUser()

    if (authUser) {
      user.value = authUser

      const { data: profileData } = await $supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle()

      profile.value = profileData
    }

    return authUser
  }

  const initAuth = () => {
    (async () => {
      await getUser()

      $supabase.auth.onAuthStateChange((_event, session) => {
        (async () => {
          if (session?.user) {
            user.value = session.user
            await getUser()
          } else {
            user.value = null
            profile.value = null
          }
        })()
      })
    })()
  }

  return {
    user,
    profile,
    signUp,
    signIn,
    signOut,
    getUser,
    initAuth
  }
}
