import { supabase } from '../lib/supabase'

class AuthService {
  // 회원가입
  async signUp(email, password, profileData) {
    // 1. Auth 계정 생성
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error

    // 2. 프로필 정보 users 테이블에 저장
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

  // 로그인
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data.user
  }

  // 로그아웃
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  // 현재 사용자 가져오기
  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return data.user
  }

  // 프로필 조회
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  }

  // 프로필 업데이트
  async updateProfile(userId, profileData) {
    const { data, error} = await supabase
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

  // 인증 상태 변화 리스너
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

export const authService = new AuthService()
