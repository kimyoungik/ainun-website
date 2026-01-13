import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import AddressInput from '../../components/AddressInput';
import { supabase } from '../../lib/supabase';

export default function MyPage() {
  const navigate = useNavigate();
  const { currentUser, userProfile, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'subscription'
  const [isEditing, setIsEditing] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    detailAddress: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        phone: userProfile.phone || '',
        address: userProfile.address || ''
      });
    }

    loadSubscriptions();
  }, [currentUser, userProfile, navigate]);

  const loadSubscriptions = async () => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (err) {
      console.error('Failed to load subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (addressData) => {
    setFormData(prev => ({
      ...prev,
      ...(addressData.address !== undefined && { address: addressData.address }),
      ...(addressData.detailAddress !== undefined && { detailAddress: addressData.detailAddress })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (!formData.name || formData.name.trim().length < 2) {
        throw new Error('이름은 2글자 이상 입력해주세요.');
      }

      if (!formData.phone || formData.phone.trim().length < 10) {
        throw new Error('올바른 연락처를 입력해주세요.');
      }

      const fullAddress = formData.detailAddress
        ? `${formData.address.trim()} ${formData.detailAddress.trim()}`
        : formData.address.trim();

      await updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: fullAddress
      });

      setSuccess('프로필이 성공적으로 업데이트되었습니다.');
      setIsEditing(false);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || '프로필 업데이트에 실패했습니다.');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: { text: '구독 중', color: 'bg-green-100 text-green-700' },
      pending: { text: '결제 대기', color: 'bg-yellow-100 text-yellow-700' },
      cancelled: { text: '구독 취소', color: 'bg-gray-100 text-gray-700' }
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  const formatPrice = (price) => {
    return price?.toLocaleString('ko-KR') || '0';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sky-400 border-t-transparent"></div>
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

      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* 페이지 헤더 */}
        <div className="text-center mb-12">
          <h1 className="font-jua text-4xl md:text-5xl text-gray-800 mb-4">
            <span className="text-sky-500">마이페이지</span>
          </h1>
          <p className="text-gray-500 text-lg">내 정보와 구독 내역을 관리하세요</p>
        </div>

        {/* 사용자 정보 카드 */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="text-6xl">{userProfile?.avatar}</div>
            <div>
              <h2 className="font-jua text-2xl text-gray-800">{userProfile?.name}님</h2>
              <p className="text-gray-500">{userProfile?.grade}</p>
              <p className="text-sm text-gray-400">{currentUser?.email}</p>
            </div>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-4 rounded-xl font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-sky-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            프로필 정보
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`flex-1 py-4 rounded-xl font-bold transition-all ${
              activeTab === 'subscription'
                ? 'bg-sky-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            구독 정보
          </button>
        </div>

        {/* 프로필 정보 탭 */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-jua text-2xl text-gray-800">프로필 정보</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-sky-500 text-white rounded-xl font-bold hover:bg-sky-600 transition-colors"
                >
                  수정하기
                </button>
              )}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">이름</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-colors ${
                      isEditing
                        ? 'border-gray-200 focus:border-sky-400'
                        : 'border-gray-100 bg-gray-50 text-gray-600'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">연락처</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="010-1234-5678"
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-colors ${
                      isEditing
                        ? 'border-gray-200 focus:border-sky-400'
                        : 'border-gray-100 bg-gray-50 text-gray-600'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">배송 주소</label>
                  <AddressInput
                    address={formData.address}
                    detailAddress={formData.detailAddress}
                    onAddressChange={handleAddressChange}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">이메일</label>
                  <input
                    type="email"
                    value={currentUser?.email || ''}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-600 outline-none"
                  />
                  <p className="text-sm text-gray-500 mt-1">이메일은 변경할 수 없습니다.</p>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4 mt-8">
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-sky-500 text-white rounded-xl font-bold hover:bg-sky-600 transition-colors"
                  >
                    저장하기
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: userProfile?.name || '',
                        phone: userProfile?.phone || '',
                        address: userProfile?.address || '',
                        detailAddress: ''
                      });
                      setError('');
                    }}
                    className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                  >
                    취소
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* 구독 정보 탭 */}
        {activeTab === 'subscription' && (
          <div className="space-y-6">
            {subscriptions.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">📰</div>
                <h3 className="font-jua text-2xl text-gray-800 mb-2">구독 내역이 없습니다</h3>
                <p className="text-gray-500 mb-6">리틀타임즈를 구독하고 매주 신문을 받아보세요!</p>
                <button
                  onClick={() => navigate('/subscribe')}
                  className="px-8 py-3 bg-sky-500 text-white rounded-xl font-bold hover:bg-sky-600 transition-colors"
                >
                  구독하러 가기
                </button>
              </div>
            ) : (
              subscriptions.map((subscription) => (
                <div key={subscription.id} className="bg-white rounded-3xl shadow-lg p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-jua text-xl text-gray-800 mb-2">{subscription.plan_name}</h3>
                      <p className="text-gray-500 text-sm">주문번호: {subscription.order_id}</p>
                    </div>
                    {getStatusBadge(subscription.status)}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-gray-700 mb-3">결제 정보</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">결제 금액</span>
                          <span className="font-bold">{formatPrice(subscription.amount)}원</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">결제 방법</span>
                          <span>{subscription.payment_method || '카드 결제'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">결제일</span>
                          <span>{formatDate(subscription.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-700 mb-3">배송 정보</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">받는 분</span>
                          <span>{subscription.delivery_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">연락처</span>
                          <span>{subscription.delivery_phone}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">주소</span>
                          <p className="text-gray-800 mt-1">{subscription.delivery_address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
