-- ============================================
-- Posts 테이블 RLS 정책
-- ============================================

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Users can view their own posts" ON posts;
DROP POLICY IF EXISTS "Users can view posts" ON posts;
DROP POLICY IF EXISTS "Enable read access for all users" ON posts;
DROP POLICY IF EXISTS "Authenticated users can view all posts" ON posts;

-- 새 정책: 모든 사용자(로그인 불필요)가 모든 게시글 조회 가능
CREATE POLICY "Anyone can view all posts" ON posts
  FOR SELECT
  USING (true);

-- 게시글 작성 정책
DROP POLICY IF EXISTS "Users can insert their own posts" ON posts;
DROP POLICY IF EXISTS "Users can create posts" ON posts;
CREATE POLICY "Users can create posts" ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 게시글 수정 정책 (본인만 가능)
DROP POLICY IF EXISTS "Users can update their own posts" ON posts;
DROP POLICY IF EXISTS "Users can update own posts" ON posts;
CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- 게시글 삭제 정책 (본인만 가능)
DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON posts;
CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


-- ============================================
-- Comments 테이블 RLS 정책
-- ============================================

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Users can view their own comments" ON comments;
DROP POLICY IF EXISTS "Users can view comments" ON comments;
DROP POLICY IF EXISTS "Enable read access for all users" ON comments;
DROP POLICY IF EXISTS "Authenticated users can view all comments" ON comments;

-- 새 정책: 모든 사용자(로그인 불필요)가 모든 댓글 조회 가능
CREATE POLICY "Anyone can view all comments" ON comments
  FOR SELECT
  USING (true);

-- 댓글 작성 정책 (모든 게시글에 댓글 작성 가능)
DROP POLICY IF EXISTS "Users can insert their own comments" ON comments;
DROP POLICY IF EXISTS "Users can create comments" ON comments;
CREATE POLICY "Users can create comments" ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 댓글 수정 정책 (본인만 가능)
DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- 댓글 삭제 정책 (본인만 가능)
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;
CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


-- ============================================
-- Likes 테이블 RLS 정책
-- ============================================

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Users can view their own likes" ON likes;
DROP POLICY IF EXISTS "Users can view likes" ON likes;
DROP POLICY IF EXISTS "Enable read access for all users" ON likes;
DROP POLICY IF EXISTS "Authenticated users can view all likes" ON likes;

-- 새 정책: 모든 사용자(로그인 불필요)가 모든 좋아요 조회 가능
CREATE POLICY "Anyone can view all likes" ON likes
  FOR SELECT
  USING (true);

-- 좋아요 생성 정책
DROP POLICY IF EXISTS "Users can insert their own likes" ON likes;
DROP POLICY IF EXISTS "Users can create likes" ON likes;
CREATE POLICY "Users can create likes" ON likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 좋아요 삭제 정책 (본인만 가능)
DROP POLICY IF EXISTS "Users can delete their own likes" ON likes;
DROP POLICY IF EXISTS "Users can delete own likes" ON likes;
CREATE POLICY "Users can delete own likes" ON likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


-- ============================================
-- Users 테이블 RLS 정책 (추가 확인)
-- ============================================

-- 모든 사용자(로그인 불필요)가 다른 사용자 프로필 조회 가능
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can view profiles" ON users;
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON users;
CREATE POLICY "Anyone can view all profiles" ON users
  FOR SELECT
  USING (true);

-- 본인 프로필만 수정 가능
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);
