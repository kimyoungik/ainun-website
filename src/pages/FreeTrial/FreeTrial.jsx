import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import { supabase } from '../../lib/supabase';

export default function FreeTrial() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // 입력 검증
      if (!formData.name || formData.name.trim().length < 2) {
        throw new Error('이름은 2글자 이상 입력해주세요.');
      }

      if (!formData.phone || formData.phone.trim().length < 10) {
        throw new Error('올바른 연락처를 입력해주세요.');
      }

      if (!formData.address || formData.address.trim().length < 5) {
        throw new Error('상세한 주소를 입력해주세요.');
      }

      // Supabase에 무료 체험 신청 저장
      const { error: insertError } = await supabase
        .from('free_trials')
        .insert([
          {
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            address: formData.address.trim(),
            status: 'pending'
          }
        ]);

      if (insertError) throw insertError;

      setSuccess(true);
      setFormData({ name: '', phone: '', address: '' });

      // 3초 후 홈으로 이동
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (err) {
      console.error('Free trial submission failed:', err);
      setError(err.message || '신청에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="font-jua text-3xl text-gray-800 mb-4">
              무료 체험 신청이 완료되었습니다!
            </h2>
            <p className="text-gray-600 mb-6">
              빠른 시일 내에 담당자가 연락드리겠습니다.
            </p>
            <p className="text-sm text-gray-500">
              3초 후 홈페이지로 이동합니다...
            </p>
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
        {/* 페이지 헤더 */}
        <div className="text-center mb-12">
          <h1 className="font-jua text-4xl md:text-5xl text-gray-800 mb-4">
            📰 <span className="text-sky-500">무료 체험</span> 신청
          </h1>
          <p className="text-gray-500 text-lg">리틀타임즈를 무료로 체험해보세요!</p>
          <p className="text-gray-400 text-sm mt-2">첫 1회 무료 배송 후 구독 여부를 결정하실 수 있습니다.</p>
        </div>

        {/* 신청 폼 */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="이름을 입력하세요"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  연락처 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="010-1234-5678"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-2">
                  배송 주소 <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="도로명 주소를 포함한 상세 주소를 입력해주세요"
                  required
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 outline-none transition-colors resize-none"
                />
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-sky-500 hover:bg-sky-600 hover:scale-105 cursor-pointer'
                }`}
              >
                {isSubmitting ? '신청 중...' : '무료 체험 신청하기'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
            </div>

            <div className="mt-6 p-4 bg-amber-50 rounded-xl">
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-bold text-amber-600">📢 안내사항</span><br />
                • 무료 체험은 1회(1주) 제공됩니다.<br />
                • 체험 후 구독 여부를 자유롭게 결정하실 수 있습니다.<br />
                • 담당자가 연락드려 배송일정을 안내해드립니다.
              </p>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
