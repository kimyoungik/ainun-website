import { supabase } from '../lib/supabase';

class AdminService {
  // 관리자 권한 확인
  async isAdmin(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) return false;
    return data?.role === 'admin';
  }

  // 전체 통계 조회
  async getStats() {
    const { data, error } = await supabase.rpc('get_posts_stats');

    if (error) throw error;
    return data[0];
  }

  // 모든 게시글 조회 (관리자용)
  async getAllPosts(page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('posts')
      .select(`
        *,
        user:users(id, name, email, grade, avatar)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      posts: data.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        userId: post.user_id,
        author: post.user.name,
        authorEmail: post.user.email,
        authorGrade: post.user.grade,
        authorAvatar: post.user.avatar,
        createdAt: new Date(post.created_at),
        viewCount: post.view_count,
        likeCount: post.like_count
      })),
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    };
  }

  // 모든 댓글 조회 (관리자용)
  async getAllComments(page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('comments')
      .select(`
        *,
        user:users(id, name, email, grade, avatar),
        post:posts(id, title)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      comments: data.map(comment => ({
        id: comment.id,
        content: comment.content,
        postId: comment.post_id,
        postTitle: comment.post.title,
        userId: comment.user_id,
        author: comment.user.name,
        authorEmail: comment.user.email,
        authorGrade: comment.user.grade,
        authorAvatar: comment.user.avatar,
        createdAt: new Date(comment.created_at)
      })),
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    };
  }

  // 모든 사용자 조회 (관리자용)
  async getAllUsers(page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('users')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      users: data.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        grade: user.grade,
        avatar: user.avatar,
        phone: user.phone,
        address: user.address,
        role: user.role,
        createdAt: new Date(user.created_at)
      })),
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    };
  }

  // 게시글 삭제 (관리자)
  async deletePost(postId) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;
  }

  // 댓글 삭제 (관리자)
  async deleteComment(commentId) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
  }

  // 사용자 role 변경 (관리자 -> 일반, 일반 -> 관리자)
  async updateUserRole(userId, newRole) {
    const { error } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) throw error;
  }
}

export const adminService = new AdminService();
