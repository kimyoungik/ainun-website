import { supabase } from '../lib/supabase'

class AuthService {
  async signUp(email, password, profileData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error
    if (!data?.user) throw new Error('Sign up failed.')

    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email,
        name: profileData.name,
        grade: profileData.grade,
        avatar: profileData.avatar,
        phone: profileData.phone || null,
        address: profileData.address || null,
      })

    if (profileError) throw profileError

    return data.user
  }

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data.user
  }

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser()
    if (error && error.message !== 'Auth session missing!') {
      throw error
    }
    return data.user
  }

  async getProfile(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error) throw error
    return data
  }

  async updateProfile(userId, profileData) {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

export const authService = new AuthService()
