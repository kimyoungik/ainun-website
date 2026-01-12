import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
  const { currentUser } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiking, setIsLiking] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    loadPost();
  }, [id]);

  useEffect(() => {
    if (currentUser && post) {
      checkIfLiked();
    }
  }, [currentUser, post?.id]);

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

  const checkIfLiked = async () => {
    try {
      const liked = await boardService.checkIfLiked(id, currentUser.id);
      setIsLiked(liked);
    } catch (err) {
      console.error('좋아요 상태 확인 실패:', err);
    }
  };

  const handleLike = async () => {
    if (isLiking || !currentUser) return;

    setIsLiking(true);
    try {
      const result = await boardService.toggleLike(id, currentUser.id);
      setIsLiked(result.liked);

      // 좋아요 수만 업데이트 (화면 새로고침 없이)
      setPost(prevPost => ({
        ...prevPost,
        likeCount: result.liked ? prevPost.likeCount + 1 : prevPost.likeCount - 1
      }));
    } catch (err) {
      alert(err.message || '좋아요에 실패했습니다.');
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentAdded = async (content) => {
    try {
      await boardService.createComment(id, content, currentUser.id);
      // 게시글 다시 로드 (댓글 포함)
      await loadPost();
      alert('댓글이 작성되었습니다!');
    } catch (err) {
      throw err;
    }
  };

  const handleDeletePost = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await boardService.deletePost(id);
      alert('게시글이 삭제되었습니다.');
      navigate('/board');
    } catch (err) {
      alert(err.message || '삭제에 실패했습니다.');
    }
  };

  const handleEditPost = () => {
    setEditTitle(post.title);
    setEditContent(post.content);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle('');
    setEditContent('');
  };

  const handleSaveEdit = async () => {
    try {
      await boardService.updatePost(id, editTitle, editContent);
      alert('게시글이 수정되었습니다.');
      setIsEditing(false);
      await loadPost();
    } catch (err) {
      alert(err.message || '수정에 실패했습니다.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      await boardService.deleteComment(commentId);
      alert('댓글이 삭제되었습니다.');
      await loadPost();
    } catch (err) {
      alert(err.message || '삭제에 실패했습니다.');
    }
  };

  const handleEditComment = async (commentId, content) => {
    try {
      await boardService.updateComment(commentId, content);
      alert('댓글이 수정되었습니다.');
      await loadPost();
    } catch (err) {
      alert(err.message || '수정에 실패했습니다.');
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
            <div className="flex items-center gap-2">
              <div className="text-right text-sm text-gray-400 mr-2">
                <div>{formatDate(post.createdAt)}</div>
              </div>
              {/* 수정/삭제 버튼 (본인 게시글만) */}
              {currentUser && currentUser.id === post.userId && (
                <div className="flex gap-2">
                  <button
                    onClick={handleEditPost}
                    className="text-sm px-3 py-1 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDeletePost}
                    className="text-sm px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>

          {isEditing ? (
            /* 수정 모드 */
            <>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full font-jua text-3xl md:text-4xl text-gray-800 mb-6 leading-tight border-2 border-gray-300 rounded-xl p-3 focus:outline-none focus:border-sky-500"
                placeholder="제목을 입력하세요"
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full text-gray-700 leading-relaxed mb-8 text-lg border-2 border-gray-300 rounded-xl p-4 focus:outline-none focus:border-sky-500 min-h-[300px]"
                placeholder="내용을 입력하세요"
              />
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleSaveEdit}
                  className="px-6 py-2 bg-sky-500 text-white rounded-xl font-bold hover:bg-sky-600 transition-colors"
                >
                  저장
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-400 transition-colors"
                >
                  취소
                </button>
              </div>
            </>
          ) : (
            /* 일반 모드 */
            <>
              {/* 제목 */}
              <h1 className="font-jua text-3xl md:text-4xl text-gray-800 mb-6 leading-tight">
                {post.title}
              </h1>

              {/* 내용 */}
              <div className="text-gray-700 leading-relaxed mb-8 whitespace-pre-wrap text-lg">
                {post.content}
              </div>
            </>
          )}

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
                  : isLiked
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:shadow-xl hover:scale-105'
                  : 'bg-gradient-to-r from-pink-400 to-red-400 text-white shadow-lg hover:shadow-xl hover:scale-105'
              }`}
            >
              {isLiked ? '❤️' : '🤍'} 좋아요 {post.likeCount}
            </button>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="mb-8">
          <h2 className="font-jua text-2xl text-gray-800 mb-4">
            💬 댓글 <span className="text-sky-500">{post.comments.length}</span>
          </h2>
          <CommentList
            comments={post.comments}
            currentUser={currentUser}
            onDelete={handleDeleteComment}
            onEdit={handleEditComment}
          />
        </div>

        {/* 댓글 작성 폼 */}
        <CommentForm onCommentAdded={handleCommentAdded} />
      </div>

      <Footer />
    </div>
  );
}
