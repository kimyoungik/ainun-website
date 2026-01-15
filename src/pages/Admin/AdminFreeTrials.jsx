import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import { adminService } from '../../services/adminService';

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

function statusClass(status) {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-700';
    case 'contacted':
      return 'bg-sky-100 text-sky-700';
    case 'cancelled':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-amber-100 text-amber-700';
  }
}

function statusLabel(status) {
  switch (status) {
    case 'completed':
      return '완료';
    case 'contacted':
      return '연락 완료';
    case 'cancelled':
      return '취소';
    default:
      return '대기';
  }
}

export default function AdminFreeTrials() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [freeTrials, setFreeTrials] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    checkAdminAndLoadFreeTrials();
  }, [currentUser, currentPage]);

  const checkAdminAndLoadFreeTrials = async () => {
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

      const data = await adminService.getFreeTrials(currentPage, 20);
      setFreeTrials(data.freeTrials);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('무료 체험 신청 목록 로딩 실패:', error);
      alert('무료 체험 신청 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-jua text-3xl md:text-4xl text-gray-800 mb-2">
              무료 체험 신청 목록
            </h1>
            <p className="text-gray-500">총 {freeTrials.length}건</p>
          </div>
          <Link
            to="/admin"
            className="bg-gray-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            대시보드로
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">이름</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">연락처</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">주소</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">상태</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">신청일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {freeTrials.map((trial) => (
                  <tr key={trial.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-800">{trial.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{trial.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{trial.address}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusClass(trial.status)}`}>
                        {statusLabel(trial.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(trial.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {freeTrials.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">무료 체험 신청이 아직 없습니다.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              이전
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
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
