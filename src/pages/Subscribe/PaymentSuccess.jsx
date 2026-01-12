import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import { paymentService } from '../../services/paymentService';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    confirmPayment();
  }, []);

  const confirmPayment = async () => {
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    if (!paymentKey || !orderId || !amount) {
      setError('결제 정보가 올바르지 않습니다.');
      setLoading(false);
      return;
    }

    try {
      const result = await paymentService.confirmPayment(
        paymentKey,
        orderId,
        parseInt(amount)
      );

      setPaymentInfo(result);
    } catch (err) {
      console.error('결제 승인 실패:', err);
      setError(err.message || '결제 승인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-sky-400 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg">결제를 확인하고 있습니다...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&family=Jua&display=swap');
          .font-jua { font-family: 'Jua', sans-serif; }
        `}</style>
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="font-jua text-3xl text-gray-800 mb-4">결제 승인 실패</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <Link
              to="/subscribe"
              className="inline-block bg-gradient-to-r from-sky-400 to-sky-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              다시 시도하기
            </Link>
          </div>
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

      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
          {/* 성공 아이콘 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <span className="text-5xl">✓</span>
            </div>
            <h1 className="font-jua text-3xl text-gray-800 mb-2">
              {paymentInfo?.method === '가상계좌' ? '가상계좌 발급 완료' : '결제 완료'}
            </h1>
            <p className="text-gray-600">
              {paymentInfo?.method === '가상계좌'
                ? '아래 계좌로 입금하시면 구독이 시작됩니다.'
                : '아이눈 어린이신문 구독이 시작되었습니다!'}
            </p>
          </div>

          {/* 가상계좌 정보 (가상계좌인 경우만) */}
          {paymentInfo?.virtualAccount && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 mb-6">
              <h2 className="font-jua text-xl text-gray-800 mb-4">가상계좌 입금 정보</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">은행</span>
                  <span className="font-bold">{paymentInfo.virtualAccount.bank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">계좌번호</span>
                  <span className="font-bold text-sky-600">{paymentInfo.virtualAccount.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">예금주</span>
                  <span className="font-bold">{paymentInfo.virtualAccount.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">입금 금액</span>
                  <span className="font-bold text-red-600">{formatPrice(paymentInfo.totalAmount)}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">입금 기한</span>
                  <span className="font-bold">{formatDate(paymentInfo.virtualAccount.dueDate)}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                ⚠️ 입금 기한 내에 입금하지 않으면 자동으로 취소됩니다.
              </p>
            </div>
          )}

          {/* 결제 정보 */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="font-jua text-xl text-gray-800 mb-4">결제 정보</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">주문번호</span>
                <span className="font-mono text-sm">{paymentInfo?.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">상품명</span>
                <span className="font-bold">{paymentInfo?.orderName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">결제수단</span>
                <span>{paymentInfo?.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">결제금액</span>
                <span className="font-bold text-sky-600 text-xl">{formatPrice(paymentInfo?.totalAmount)}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">결제일시</span>
                <span>{paymentInfo?.approvedAt ? formatDate(paymentInfo.approvedAt) : formatDate(paymentInfo?.requestedAt)}</span>
              </div>
            </div>
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
            to="/board"
            className="flex-1 text-center bg-gradient-to-r from-sky-400 to-sky-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            독자후기 보기
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
