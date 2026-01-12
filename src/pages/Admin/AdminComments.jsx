import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import { adminService } from '../../services/adminService';

// 날짜 포맷 함수
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

export default function AdminComments() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    checkAdminAndLoadComments();
  }, [currentUser, currentPage]);

  const checkAdminAndLoadComments = async () => {
    if (!currentUser) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      const adminStatus = await adminService.isAdmin(currentUser.id);

      if (!adminStatus) {
        alert('관리자 권한이 없습니다.');
        navigate('/');
        return;
      }

      const data = await adminService.getAllComments(currentPage, 20);
      setComments(data.comments);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('댓글 로딩 실패:', error);
      alert('댓글 로딩에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId, content) => {
    const previewContent = content.length > 50 ? content.substring(0, 50) + '...' : content;
    if (!confirm(`"${previewContent}" 댓글을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      await adminService.deleteComment(commentId);
      alert('댓글이 삭제되었습니다.');
      checkAdminAndLoadComments();
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sky-400 border-t-transparent"></div>
          <p className="text-gray-500 mt-4">로딩 중...</p>
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

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* 페이지 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-jua text-3xl md:text-4xl text-gray-800 mb-2">
              💬 댓글 관리
            </h1>
            <p className="text-gray-500">총 {comments.length}개의 댓글</p>
          </div>
          <Link
            to="/admin"
            className="bg-gray-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            ← 대시보드
          </Link>
        </div>

        {/* 댓글 테이블 */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">댓글 내용</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">게시글</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">작성자</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">이메일</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">작성일</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {comments.map((comment) => (
                  <tr key={comment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 max-w-md">
                      <p className="text-gray-700 line-clamp-2">{comment.content}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/board/${comment.postId}`}
                        className="text-sky-600 hover:text-sky-700 font-medium hover:underline line-clamp-1"
                      >
                        {comment.postTitle}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{comment.authorAvatar}</span>
                        <div>
                          <div className="font-medium text-gray-800">{comment.author}</div>
                          <div className="text-xs text-gray-500">{comment.authorGrade}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{comment.authorEmail}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(comment.createdAt)}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(comment.id, comment.content)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {comments.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-gray-500 text-lg">댓글이 없습니다.</p>
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              이전
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  currentPage === page
                    ? 'bg-sky-500 text-white border-sky-500'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              다음
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
