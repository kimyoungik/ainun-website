import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import { adminService } from '../../services/adminService';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    checkAdminAndLoadStats();
  }, [currentUser]);

  const checkAdminAndLoadStats = async () => {
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

      setIsAdmin(true);
      const statsData = await adminService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('관리자 확인 실패:', error);
      alert('관리자 확인에 실패했습니다.');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sky-400 border-t-transparent"></div>
          <p className="text-gray-500 mt-4">로딩 중...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&family=Jua&display=swap');
        .font-jua { font-family: 'Jua', sans-serif; }
        .stat-card {
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.15);
        }
      `}</style>

      <Header />

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* 페이지 헤더 */}
        <div className="text-center mb-12">
          <h1 className="font-jua text-4xl md:text-5xl text-gray-800 mb-4">
            👑<span className="text-amber-500">관리자</span> 대시보드
          </h1>
          <p className="text-gray-500 text-lg">사이트를 전체 관리할 수 있습니다.</p>
        </div>

        {/* 통계 카드 */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="stat-card bg-white rounded-3xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-2">📝</div>
              <div className="text-3xl font-bold text-sky-500 mb-1">{stats.total_posts}</div>
              <div className="text-gray-600">전체 게시글</div>
            </div>

            <div className="stat-card bg-white rounded-3xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-2">💬</div>
              <div className="text-3xl font-bold text-green-500 mb-1">{stats.total_comments}</div>
              <div className="text-gray-600">전체 댓글</div>
            </div>

            <div className="stat-card bg-white rounded-3xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-2">👤</div>
              <div className="text-3xl font-bold text-purple-500 mb-1">{stats.total_users}</div>
              <div className="text-gray-600">전체 회원</div>
            </div>

            <div className="stat-card bg-white rounded-3xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-2">👍</div>
              <div className="text-3xl font-bold text-red-500 mb-1">{stats.total_likes}</div>
              <div className="text-gray-600">전체 좋아요</div>
            </div>
          </div>
        )}

        {/* 관리 메뉴 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/admin/posts"
            className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-all hover:scale-105 text-center"
          >
            <div className="text-6xl mb-4">📝</div>
            <h2 className="font-jua text-2xl text-gray-800 mb-2">게시글 관리</h2>
            <p className="text-gray-500">모든 게시글을 확인하고 삭제할 수 있습니다.</p>
          </Link>

          <Link
            to="/admin/comments"
            className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-all hover:scale-105 text-center"
          >
            <div className="text-6xl mb-4">💬</div>
            <h2 className="font-jua text-2xl text-gray-800 mb-2">댓글 관리</h2>
            <p className="text-gray-500">모든 댓글을 확인하고 삭제할 수 있습니다.</p>
          </Link>

          <Link
            to="/admin/users"
            className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-all hover:scale-105 text-center"
          >
            <div className="text-6xl mb-4">👤</div>
            <h2 className="font-jua text-2xl text-gray-800 mb-2">회원 관리</h2>
            <p className="text-gray-500">회원 정보를 확인하고 관리할 수 있습니다.</p>
          </Link>

          <Link
            to="/admin/free-trials"
            className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-xl transition-all hover:scale-105 text-center"
          >
            <div className="text-6xl mb-4">🎁</div>
            <h2 className="font-jua text-2xl text-gray-800 mb-2">무료 체험 신청</h2>
            <p className="text-gray-500">무료 체험 신청 목록을 확인합니다.</p>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
