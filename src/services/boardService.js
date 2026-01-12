import { supabase } from '../lib/supabase';

// Supabase API 구현
class SupabaseBoardAPI {
  async getPosts(page = 1, limit = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from('posts')
      .select(`
        *,
        user:users(name, grade, avatar),
        comments(id)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      posts: data.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        author: post.user.name,
        authorGrade: post.user.grade,
        authorAvatar: post.user.avatar,
        createdAt: new Date(post.created_at),
        viewCount: post.view_count,
        likeCount: post.like_count,
        comments: post.comments || []
      })),
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    };
  }

  async getPostById(id) {
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        user:users(name, grade, avatar),
        comments(
          *,
          user:users(name, grade, avatar)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw new Error('게시글을 찾을 수 없습니다.');

    // 조회수 증가
    await supabase.rpc('increment_view_count', { post_id: id });

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.user.name,
      authorGrade: post.user.grade,
      authorAvatar: post.user.avatar,
      createdAt: new Date(post.created_at),
      viewCount: post.view_count + 1,
      likeCount: post.like_count,
      comments: post.comments.map(comment => ({
        id: comment.id,
        postId: comment.post_id,
        content: comment.content,
        author: comment.user.name,
        authorGrade: comment.user.grade,
        authorAvatar: comment.user.avatar,
        createdAt: new Date(comment.created_at)
      }))
    };
  }

  async createPost(title, content, userId) {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        title,
        content,
        user_id: userId
      })
      .select(`
        *,
        user:users(name, grade, avatar)
      `)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      author: data.user.name,
      authorGrade: data.user.grade,
      authorAvatar: data.user.avatar,
      createdAt: new Date(data.created_at),
      viewCount: 0,
      likeCount: 0,
      comments: []
    };
  }

  async createComment(postId, content, userId) {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        content,
        user_id: userId
      })
      .select(`
        *,
        user:users(name, grade, avatar)
      `)
      .single();

    if (error) throw error;

    return {
      id: data.id,
      postId: data.post_id,
      content: data.content,
      author: data.user.name,
      authorGrade: data.user.grade,
      authorAvatar: data.user.avatar,
      createdAt: new Date(data.created_at)
    };
  }

  async toggleLike(postId, userId) {
    // 이미 좋아요 했는지 확인
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      // 좋아요 취소
      await supabase.from('likes').delete().eq('id', existingLike.id);
      await supabase.rpc('decrement_like_count', { post_id: postId });
      return { liked: false };
    } else {
      // 좋아요 추가
      await supabase.from('likes').insert({ post_id: postId, user_id: userId });
      await supabase.rpc('increment_like_count', { post_id: postId });
      return { liked: true };
    }
  }

  async checkIfLiked(postId, userId) {
    const { data } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    return !!data;
  }
}

// 서비스 레이어 (추상화)
class BoardService {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async getPosts(page = 1, limit = 10) {
    return this.apiClient.getPosts(page, limit);
  }

  async getPostById(id) {
    return this.apiClient.getPostById(id);
  }

  async createPost(title, content, userId) {
    // 유효성 검증
    if (!title || title.trim().length === 0) {
      throw new Error('제목을 입력해주세요.');
    }
    if (!content || content.trim().length < 10) {
      throw new Error('내용을 10자 이상 입력해주세요.');
    }
    if (!userId) {
      throw new Error('로그인이 필요합니다.');
    }

    return this.apiClient.createPost(title, content, userId);
  }

  async createComment(postId, content, userId) {
    // 유효성 검증
    if (!content || content.trim().length === 0) {
      throw new Error('댓글 내용을 입력해주세요.');
    }
    if (!userId) {
      throw new Error('로그인이 필요합니다.');
    }

    return this.apiClient.createComment(postId, content, userId);
  }

  async toggleLike(postId, userId) {
    if (!userId) {
      throw new Error('로그인이 필요합니다.');
    }
    return this.apiClient.toggleLike(postId, userId);
  }

  async checkIfLiked(postId, userId) {
    if (!userId) return false;
    return this.apiClient.checkIfLiked(postId, userId);
  }
}

// Export: Supabase API 사용
export const boardService = new BoardService(new SupabaseBoardAPI());
