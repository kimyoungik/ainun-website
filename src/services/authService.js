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

  async signInWithGoogle(redirectTo) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: redirectTo ? { redirectTo } : undefined,
    })

    if (error) throw error
    return data
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

  async ensureProfileFromUser(user) {
    if (!user) return null

    const existing = await this.getProfile(user.id)
    if (existing) return existing

    const metadata = user.user_metadata || {}
    const name =
      metadata.full_name ||
      metadata.name ||
      (user.email ? user.email.split('@')[0] : '사용자')
    const grade = '초등 3학년'
    const avatar = '😀'

    const { data, error } = await supabase
      .from('users')
      .insert({
        id: user.id,
        email: user.email,
        name,
        grade,
        avatar,
        phone: null,
        address: null,
      })
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
