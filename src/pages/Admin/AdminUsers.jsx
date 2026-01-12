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
  return `${year}.${month}.${day}`;
}

export default function AdminUsers() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    checkAdminAndLoadUsers();
  }, [currentUser, currentPage]);

  const checkAdminAndLoadUsers = async () => {
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

      const data = await adminService.getAllUsers(currentPage, 20);
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('회원 로딩 실패:', error);
      alert('회원 로딩에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, userName, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const action = newRole === 'admin' ? '관리자로 승격' : '일반 사용자로 변경';

    if (!confirm(`${userName}님을 ${action}하시겠습니까?`)) {
      return;
    }

    try {
      await adminService.updateUserRole(userId, newRole);
      alert(`${userName}님의 권한이 변경되었습니다.`);
      checkAdminAndLoadUsers();
    } catch (error) {
      console.error('권한 변경 실패:', error);
      alert('권한 변경에 실패했습니다.');
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
              👥 회원 관리
            </h1>
            <p className="text-gray-500">총 {users.length}명의 회원</p>
          </div>
          <Link
            to="/admin"
            className="bg-gray-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            ← 대시보드
          </Link>
        </div>

        {/* 회원 테이블 */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">회원 정보</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">이메일</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">연락처</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">주소</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">권한</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">가입일</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{user.avatar}</span>
                        <div>
                          <div className="font-medium text-gray-800">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.grade}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.phone || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{user.address || '-'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.role === 'admin'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role === 'admin' ? '🛡️ 관리자' : '👤 일반'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(user.createdAt)}</td>
                    <td className="px-6 py-4 text-center">
                      {user.id !== currentUser.id && (
                        <button
                          onClick={() => handleRoleChange(user.id, user.name, user.role)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            user.role === 'admin'
                              ? 'bg-gray-500 text-white hover:bg-gray-600'
                              : 'bg-amber-500 text-white hover:bg-amber-600'
                          }`}
                        >
                          {user.role === 'admin' ? '권한 해제' : '관리자 지정'}
                        </button>
                      )}
                      {user.id === currentUser.id && (
                        <span className="text-xs text-gray-400">본인</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-gray-500 text-lg">회원이 없습니다.</p>
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
