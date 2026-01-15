-- 무료 체험 신청 테이블 생성
CREATE TABLE IF NOT EXISTS free_trials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  email VARCHAR(255),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'contacted', 'completed', 'cancelled'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'free_trials'
      AND column_name = 'user_id'
  ) THEN
    ALTER TABLE free_trials
      ADD COLUMN user_id UUID;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'free_trials'
      AND column_name = 'email'
  ) THEN
    ALTER TABLE free_trials
      ADD COLUMN email VARCHAR(255);
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_free_trials_user_id_unique
  ON free_trials(user_id)
  WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_free_trials_email_unique
  ON free_trials(email)
  WHERE email IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_free_trials_phone_unique
  ON free_trials(phone)
  WHERE phone IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_free_trials_address_unique
  ON free_trials(address)
  WHERE address IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_free_trials_name_unique
  ON free_trials(name)
  WHERE name IS NOT NULL;

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
