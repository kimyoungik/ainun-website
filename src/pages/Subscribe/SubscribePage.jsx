import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import { paymentService } from '../../services/paymentService';

export default function SubscribePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser, userProfile } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const deliveryInfoRef = useRef(null);

  const plans = paymentService.getSubscriptionPlans();

  // URL 파라미터에서 플랜 읽어오기
  useEffect(() => {
    const planParam = searchParams.get('plan');
    if (planParam) {
      setSelectedPlan(planParam);
      // 플랜 선택 후 잠시 후 스크롤 (DOM 렌더링 대기)
      setTimeout(() => {
        deliveryInfoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [searchParams]);

  useEffect(() => {
    if (currentUser && userProfile) {
      setDeliveryInfo({
        name: userProfile.name || '',
        phone: userProfile.phone || '',
        address: userProfile.address || ''
      });
    }
  }, [currentUser, userProfile]);

  const handleDeliveryChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubscribe = async () => {
    if (!currentUser) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!selectedPlan) {
      alert('구독 플랜을 선택해주세요.');
      return;
    }

    if (!deliveryInfo.name || !deliveryInfo.phone || !deliveryInfo.address) {
      alert('배송 정보를 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // 1. 구독 정보 생성
      const { orderId, amount, planName } = await paymentService.createSubscription(
        currentUser.id,
        selectedPlan,
        deliveryInfo
      );

      // 2. 토스페이먼츠 결제 요청
      await paymentService.requestPayment(
        orderId,
        amount,
        planName,
        paymentMethod
      );

      // 결제창이 열리면 사용자가 결제 완료 후 successUrl로 리다이렉트됨
    } catch (err) {
      console.error('결제 요청 실패:', err);
      setError(err.message || '결제 요청에 실패했습니다.');
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&family=Jua&display=swap');
        .font-jua { font-family: 'Jua', sans-serif; }
        .plan-card {
          transition: all 0.3s ease;
          border: 3px solid transparent;
        }
        .plan-card:hover {
          transform: translateY(-10px);
        }
        .plan-card.selected {
          border-color: #0ea5e9 !important;
          background: linear-gradient(to bottom right, #f0f9ff, #e0f2fe) !important;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2), 0 10px 25px -5px rgba(14, 165, 233, 0.3);
        }
      `}</style>

      <Header />

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* 페이지 헤더 */}
        <div className="text-center mb-12">
          <h1 className="font-jua text-4xl md:text-5xl text-gray-800 mb-4">
            📰 <span className="text-sky-500">구독하기</span>
          </h1>
          <p className="text-gray-500 text-lg">아이눈 어린이신문과 함께 성장해요!</p>
        </div>

        {/* 구독 플랜 선택 */}
        <div className="mb-12">
          <h2 className="font-jua text-2xl text-gray-800 mb-6 text-center">구독 플랜 선택</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => {
                  setSelectedPlan(plan.id);
                  // 플랜 선택 후 배송 정보 섹션으로 스크롤
                  setTimeout(() => {
                    deliveryInfoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                className={`plan-card bg-white rounded-3xl shadow-lg p-6 cursor-pointer relative ${
                  selectedPlan === plan.id ? 'selected' : ''
                } ${plan.popular ? 'ring-2 ring-amber-400' : ''}`}
              >
                {selectedPlan === plan.id && (
                  <div className="absolute top-3 right-3 bg-sky-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">
                    ✓
                  </div>
                )}
                {plan.popular && (
                  <div className="bg-amber-400 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                    🔥 인기
                  </div>
                )}
                <h3 className="font-jua text-xl text-gray-800 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  {plan.originalPrice && (
                    <div className="text-gray-400 line-through text-sm">
                      {formatPrice(plan.originalPrice)}원
                    </div>
                  )}
                  <div className="text-3xl font-bold text-sky-500">
                    {formatPrice(plan.price)}원
                  </div>
                  {plan.discount && (
                    <div className="text-red-500 text-sm font-bold">
                      {formatPrice(plan.discount)}원 할인!
                    </div>
                  )}
                </div>
                <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {selectedPlan && (
          <div ref={deliveryInfoRef} className="max-w-2xl mx-auto">
            {/* 배송 정보 */}
            <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
              <h2 className="font-jua text-2xl text-gray-800 mb-6">배송 정보</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">받는 분</label>
                  <input
                    type="text"
                    name="name"
                    value={deliveryInfo.name}
                    onChange={handleDeliveryChange}
                    placeholder="이름을 입력하세요"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2">연락처</label>
                  <input
                    type="tel"
                    name="phone"
                    value={deliveryInfo.phone}
                    onChange={handleDeliveryChange}
                    placeholder="01012345678"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2">배송 주소</label>
                  <input
                    type="text"
                    name="address"
                    value={deliveryInfo.address}
                    onChange={handleDeliveryChange}
                    placeholder="주소를 입력하세요"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 결제 수단 선택 */}
            <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
              <h2 className="font-jua text-2xl text-gray-800 mb-6">결제 수단</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-sky-500 bg-sky-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">💳</div>
                  <div className="font-bold text-gray-800">카드 결제</div>
                  <div className="text-sm text-gray-500">즉시 결제</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('virtual_account')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'virtual_account'
                      ? 'border-sky-500 bg-sky-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">🏦</div>
                  <div className="font-bold text-gray-800">가상계좌</div>
                  <div className="text-sm text-gray-500">계좌 이체</div>
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                {error}
              </div>
            )}

            {/* 결제 버튼 */}
            <button
              onClick={handleSubscribe}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-sky-400 to-sky-500 text-white py-5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? '결제 진행 중...' : '결제하기'}
            </button>

            <p className="text-center text-gray-500 text-sm mt-4">
              결제 진행 시 이용약관 및 개인정보 처리방침에 동의한 것으로 간주됩니다.
            </p>
          </div>
        )}

        {!selectedPlan && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">구독 플랜을 선택해주세요</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
