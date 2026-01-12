import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';

export default function PaymentFail() {
  const [searchParams] = useSearchParams();
  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&family=Jua&display=swap');
        .font-jua { font-family: 'Jua', sans-serif; }
      `}</style>

      <Header />

      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
          {/* 실패 아이콘 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
              <span className="text-5xl">✕</span>
            </div>
            <h1 className="font-jua text-3xl text-gray-800 mb-2">결제 실패</h1>
            <p className="text-gray-600">결제 처리 중 문제가 발생했습니다.</p>
          </div>

          {/* 오류 정보 */}
          {(errorCode || errorMessage) && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6">
              <h2 className="font-jua text-xl text-gray-800 mb-4">오류 정보</h2>
              {errorCode && (
                <div className="mb-2">
                  <span className="text-gray-600">오류 코드: </span>
                  <span className="font-bold text-red-600">{errorCode}</span>
                </div>
              )}
              {errorMessage && (
                <div>
                  <span className="text-gray-600">오류 메시지: </span>
                  <span className="font-bold">{decodeURIComponent(errorMessage)}</span>
                </div>
              )}
            </div>
          )}

          {/* 안내 메시지 */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-3">다음 사항을 확인해주세요:</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>카드 한도 및 잔액이 충분한지 확인해주세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>카드 정보를 정확하게 입력했는지 확인해주세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>인터넷 연결이 안정적인지 확인해주세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>문제가 계속되면 고객센터로 문의해주세요</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-4">
          <Link
            to="/"
            className="flex-1 text-center bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            홈으로
          </Link>
          <Link
            to="/subscribe"
            className="flex-1 text-center bg-gradient-to-r from-sky-400 to-sky-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            다시 시도하기
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
