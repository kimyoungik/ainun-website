-- 무료 체험 신청 테이블 생성
CREATE TABLE IF NOT EXISTS free_trials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'contacted', 'completed', 'cancelled'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE free_trials ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 무료 체험 신청 가능 (INSERT)
CREATE POLICY "Anyone can submit free trial" ON free_trials
  FOR INSERT
  WITH CHECK (true);

-- 관리자만 무료 체험 신청 목록 조회 가능
CREATE POLICY "Admins can view free trials" ON free_trials
  FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

-- 관리자만 무료 체험 신청 상태 업데이트 가능
CREATE POLICY "Admins can update free trials" ON free_trials
  FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid()));

-- 관리자만 무료 체험 신청 삭제 가능
CREATE POLICY "Admins can delete free trials" ON free_trials
  FOR DELETE TO authenticated
  USING (public.is_admin(auth.uid()));

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_free_trials_created_at ON free_trials(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_free_trials_status ON free_trials(status);
