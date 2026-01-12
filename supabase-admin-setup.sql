-- ============================================
-- 관리자 시스템 설정
-- ============================================

-- 1. users 테이블에 role 컬럼 추가
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- 2. role에 체크 제약 추가 (user 또는 admin만 가능)
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin'));

-- 3. 기존 사용자들은 모두 'user' role로 설정
UPDATE users SET role = 'user' WHERE role IS NULL;

-- 4. 관리자 정책: 관리자는 모든 게시글 삭제 가능
DROP POLICY IF EXISTS "Admins can delete any post" ON posts;
CREATE POLICY "Admins can delete any post" ON posts
  FOR DELETE
  TO authenticated
  USING (
    public.is_admin(auth.uid())
  );

-- 5. 관리자 정책: 관리자는 모든 댓글 삭제 가능
DROP POLICY IF EXISTS "Admins can delete any comment" ON comments;
CREATE POLICY "Admins can delete any comment" ON comments
  FOR DELETE
  TO authenticated
  USING (
    public.is_admin(auth.uid())
  );

-- 6. 관리자 정책: 관리자는 모든 사용자 정보 조회 가능
DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR -- 본인 정보 조회
    public.is_admin(auth.uid()) -- 또는 관리자인 경우 모든 정보 조회
  );

-- 7. 관리자 함수: 사용자 role 확인 (RLS 재귀 방지용)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = user_id
      AND u.role = 'admin'
  );
$$;

-- 8. 관리자 함수: 게시글 통계
CREATE OR REPLACE FUNCTION get_posts_stats()
RETURNS TABLE (
  total_posts BIGINT,
  total_users BIGINT,
  total_comments BIGINT,
  total_likes BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM posts) as total_posts,
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM comments) as total_comments,
    (SELECT COUNT(*) FROM likes) as total_likes;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 관리자 계정 설정 안내
-- ============================================
-- 관리자로 설정하려면 아래 SQL을 실행하세요:
-- UPDATE users SET role = 'admin' WHERE email = '관리자이메일@example.com';
