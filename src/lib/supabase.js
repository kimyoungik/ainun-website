import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 환경 변수 유효성 검증
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase 환경 변수가 설정되지 않았습니다:', {
    url: supabaseUrl,
    key: supabaseAnonKey ? '설정됨' : '없음'
  })
  throw new Error('VITE_SUPABASE_URL 및 VITE_SUPABASE_ANON_KEY 환경 변수를 설정해주세요.')
}

// Supabase 클라이언트 인스턴스 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
