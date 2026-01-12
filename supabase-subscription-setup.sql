-- ============================================
-- 구독 시스템 설정
-- ============================================

-- 1. 구독 테이블 생성
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- 구독 상품 정보
  plan_type VARCHAR(50) NOT NULL, -- '1month', '3months', '6months', '12months'
  plan_name VARCHAR(100) NOT NULL,

  -- 결제 정보
  amount INTEGER NOT NULL,
  payment_method VARCHAR(50) NOT NULL, -- 'card', 'virtual_account'
  order_id VARCHAR(100) UNIQUE NOT NULL,
  payment_key VARCHAR(200),

  -- 결제 상태
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'cancelled'

  -- 구독 기간
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,

  -- 가상계좌 정보 (가상계좌 결제시에만)
  virtual_account_bank VARCHAR(50),
  virtual_account_number VARCHAR(100),
  virtual_account_holder VARCHAR(100),
  virtual_account_due_date TIMESTAMPTZ,

  -- 배송 정보
  delivery_name VARCHAR(100),
  delivery_phone VARCHAR(20),
  delivery_address TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_order_id ON subscriptions(order_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- 3. RLS 정책 설정
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 구독만 조회 가능
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 사용자는 자신의 구독만 생성 가능
DROP POLICY IF EXISTS "Users can create own subscriptions" ON subscriptions;
CREATE POLICY "Users can create own subscriptions" ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 구독만 수정 가능
DROP POLICY IF EXISTS "Users can update own subscriptions" ON subscriptions;
CREATE POLICY "Users can update own subscriptions" ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- 관리자는 모든 구독 조회 가능
DROP POLICY IF EXISTS "Admins can view all subscriptions" ON subscriptions;
CREATE POLICY "Admins can view all subscriptions" ON subscriptions
  FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- 4. updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER trigger_update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscriptions_updated_at();
