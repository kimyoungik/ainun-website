import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import CommentList from '../../components/Board/CommentList';
import CommentForm from '../../components/Board/CommentForm';
import { boardService } from '../../services/boardService';

// 날짜 포맷 함수
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

export default function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await boardService.getPostById(id);
      setPost(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (isLiking) return;

    setIsLiking(true);
    try {
      const updatedPost = await boardService.likePost(id);
      setPost(updatedPost);
    } catch (err) {
      alert('좋아요에 실패했습니다.');
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentAdded = async (commentData) => {
    try {
      await boardService.createComment(id, commentData);
      // 게시글 다시 로드 (댓글 포함)
      await loadPost();
      alert('댓글이 작성되었습니다!');
    } catch (err) {
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sky-400 border-t-transparent"></div>
          <p className="text-gray-500 mt-4">게시글을 불러오는 중...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="font-jua text-2xl text-gray-800 mb-2">게시글을 찾을 수 없습니다</h2>
          <p className="text-gray-500 mb-6">{error || '존재하지 않는 게시글입니다.'}</p>
          <button
            onClick={() => navigate('/board')}
            className="bg-gradient-to-r from-sky-400 to-sky-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            목록으로 돌아가기
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&family=Jua&display=swap');
        .font-jua { font-family: 'Jua', sans-serif; }
      `}</style>

      <Header />

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* 목록으로 버튼 */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/board')}
            className="flex items-center gap-2 text-gray-600 hover:text-sky-500 font-medium transition-colors"
          >
            ← 목록으로
          </button>
        </div>

        {/* 게시글 상세 */}
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10 mb-8">
          {/* 작성자 정보 */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            <span className="text-5xl">{post.authorAvatar}</span>
            <div className="flex-1">
              <div className="font-bold text-lg text-gray-800">{post.author}</div>
              <div className="text-gray-500">{post.authorGrade}</div>
            </div>
            <div className="text-right text-sm text-gray-400">
              <div>{formatDate(post.createdAt)}</div>
            </div>
          </div>

          {/* 제목 */}
          <h1 className="font-jua text-3xl md:text-4xl text-gray-800 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* 내용 */}
          <div className="text-gray-700 leading-relaxed mb-8 whitespace-pre-wrap text-lg">
            {post.content}
          </div>

          {/* 통계 및 좋아요 */}
          <div className="flex items-center gap-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-4 text-gray-500">
              <span className="flex items-center gap-1">
                👁️ {post.viewCount}
              </span>
              <span className="flex items-center gap-1">
                💬 {post.comments.length}
              </span>
            </div>
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`ml-auto flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                isLiking
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-400 to-red-400 text-white shadow-lg hover:shadow-xl hover:scale-105'
              }`}
            >
              ❤️ 좋아요 {post.likeCount}
            </button>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="mb-8">
          <h2 className="font-jua text-2xl text-gray-800 mb-4">
            💬 댓글 <span className="text-sky-500">{post.comments.length}</span>
          </h2>
          <CommentList comments={post.comments} />
        </div>

        {/* 댓글 작성 폼 */}
        <CommentForm postId={post.id} onCommentAdded={handleCommentAdded} />
      </div>

      <Footer />
    </div>
  );
}
