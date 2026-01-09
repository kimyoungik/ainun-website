import { mockPosts } from '../data/mockBoardData';

// Mock API 구현 (메모리 내 데이터)
class MockBoardAPI {
  constructor() {
    this.posts = [...mockPosts];
    this.nextId = this.posts.length + 1;
  }

  async getPosts(page = 1, limit = 10) {
    // 최신순 정렬
    const sortedPosts = [...this.posts].sort((a, b) => b.createdAt - a.createdAt);

    // 페이징 처리
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedPosts = sortedPosts.slice(start, end);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          posts: paginatedPosts,
          total: this.posts.length,
          page,
          limit,
          totalPages: Math.ceil(this.posts.length / limit)
        });
      }, 300); // 실제 API 호출처럼 약간의 지연
    });
  }

  async getPostById(id) {
    const post = this.posts.find(p => p.id === parseInt(id));

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (post) {
          // 조회수 증가
          post.viewCount += 1;
          resolve(post);
        } else {
          reject(new Error('게시글을 찾을 수 없습니다.'));
        }
      }, 200);
    });
  }

  async createPost(data) {
    const newPost = {
      id: this.nextId++,
      title: data.title,
      content: data.content,
      author: data.author,
      authorGrade: data.authorGrade,
      authorAvatar: data.authorAvatar,
      createdAt: new Date(),
      viewCount: 0,
      likeCount: 0,
      comments: []
    };

    return new Promise((resolve) => {
      setTimeout(() => {
        this.posts.unshift(newPost); // 최상단에 추가
        resolve(newPost);
      }, 300);
    });
  }

  async createComment(postId, data) {
    const post = this.posts.find(p => p.id === parseInt(postId));

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!post) {
          reject(new Error('게시글을 찾을 수 없습니다.'));
          return;
        }

        const newComment = {
          id: post.comments.length + 1,
          postId: post.id,
          content: data.content,
          author: data.author,
          authorGrade: data.authorGrade,
          authorAvatar: data.authorAvatar,
          createdAt: new Date()
        };

        post.comments.push(newComment);
        resolve(newComment);
      }, 200);
    });
  }

  async likePost(id) {
    const post = this.posts.find(p => p.id === parseInt(id));

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (post) {
          post.likeCount += 1;
          resolve(post);
        } else {
          reject(new Error('게시글을 찾을 수 없습니다.'));
        }
      }, 150);
    });
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

  async createPost(data) {
    // 유효성 검증
    if (!data.title || data.title.trim().length === 0) {
      throw new Error('제목을 입력해주세요.');
    }
    if (!data.content || data.content.trim().length < 10) {
      throw new Error('내용을 10자 이상 입력해주세요.');
    }
    if (!data.author || data.author.trim().length < 2) {
      throw new Error('이름을 2자 이상 입력해주세요.');
    }
    if (!data.authorGrade) {
      throw new Error('학년을 선택해주세요.');
    }
    if (!data.authorAvatar) {
      throw new Error('아바타를 선택해주세요.');
    }

    return this.apiClient.createPost(data);
  }

  async createComment(postId, data) {
    // 유효성 검증
    if (!data.content || data.content.trim().length === 0) {
      throw new Error('댓글 내용을 입력해주세요.');
    }
    if (!data.author || data.author.trim().length < 2) {
      throw new Error('이름을 2자 이상 입력해주세요.');
    }
    if (!data.authorGrade) {
      throw new Error('학년을 선택해주세요.');
    }
    if (!data.authorAvatar) {
      throw new Error('아바타를 선택해주세요.');
    }

    return this.apiClient.createComment(postId, data);
  }

  async likePost(id) {
    return this.apiClient.likePost(id);
  }
}

// Export: 현재는 Mock API 사용, 나중에 RestBoardAPI로 쉽게 교체 가능
export const boardService = new BoardService(new MockBoardAPI());
