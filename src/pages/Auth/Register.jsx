import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    grade: '',
    avatar: '',
    phone: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const grades = ['초등 1학년', '초등 2학년', '초등 3학년', '초등 4학년', '초등 5학년', '초등 6학년'];
  const avatars = ['👦', '👧', '🧒', '👶'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAvatarSelect = (avatar) => {
    setFormData(prev => ({ ...prev, avatar }));
    if (errors.avatar) {
      setErrors(prev => ({ ...prev, avatar: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const { email, password, confirmPassword, name, grade, avatar, phone, address } = formData;

      await register(email, password, confirmPassword, {
        name,
        grade,
        avatar,
        phone,
        address
      });

      alert('회원가입이 완료되었습니다!');
      navigate('/board');
    } catch (err) {
      setErrors({ general: err.message || '회원가입에 실패했습니다.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&family=Jua&display=swap');
        .font-jua { font-family: 'Jua', sans-serif; }
      `}</style>

      <Header />

      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="font-jua text-4xl text-gray-800 mb-2">
            회원가입
          </h1>
          <p className="text-gray-500">아이눈 가족이 되어주세요!</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-lg p-8">
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {errors.general}
            </div>
          )}

          {/* 필수 정보 */}
          <div className="mb-6">
            <h3 className="font-jua text-xl text-gray-800 mb-4">필수 정보</h3>

            {/* 이메일 */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">이메일</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 outline-none transition-colors"
              />
            </div>

            {/* 비밀번호 */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">비밀번호</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="6자 이상"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">비밀번호 확인</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="비밀번호 재입력"
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 outline-none transition-colors"
                />
              </div>
            </div>

            {/* 이름 & 학년 */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-bold mb-2">이름</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="이름을 입력하세요"
                  required
                  maxLength={20}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2">학년</label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 outline-none transition-colors"
                >
                  <option value="">학년을 선택하세요</option>
                  {grades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 아바타 선택 */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">아바타 선택</label>
              <div className="flex gap-3">
                {avatars.map(avatar => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => handleAvatarSelect(avatar)}
                    className={`text-4xl p-4 rounded-xl border-2 transition-all ${
                      formData.avatar === avatar
                        ? 'border-sky-500 bg-sky-50 scale-110'
                        : 'border-gray-200 hover:border-sky-300 hover:bg-gray-50'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 선택 정보 */}
          <div className="mb-6">
            <h3 className="font-jua text-xl text-gray-800 mb-4">선택 정보</h3>

            {/* 전화번호 */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">전화번호 (선택)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01012345678"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 outline-none transition-colors"
              />
            </div>

            {/* 주소 */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">주소 (선택)</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="주소를 입력하세요"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 outline-none transition-colors"
              />
            </div>
          </div>

          {/* 버튼 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-sky-400 to-sky-500 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mb-4"
          >
            {isSubmitting ? '회원가입 중...' : '회원가입'}
          </button>

          <div className="text-center">
            <p className="text-gray-500 text-sm">
              이미 회원이신가요?{' '}
              <Link to="/login" className="text-sky-500 font-bold hover:underline">
                로그인
              </Link>
            </p>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
