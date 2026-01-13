import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';

export default function Register() {
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();

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

  const handleGoogleSignup = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      setErrors({ general: err.message || 'Google signup failed.' });
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
          <p className="text-gray-500">리틀타임즈 가족이 되어주세요!</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-lg p-8">
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full mb-4 flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-bold shadow-sm hover:bg-gray-50 transition-all hover:scale-105 cursor-pointer"
          >
            <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C34.1 32.7 29.6 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6 29.4 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"/>
              <path fill="#4CAF50" d="M24 44c5.3 0 10.2-2 13.9-5.3l-6.4-5.4C29.6 35.7 26.9 36 24 36c-5.6 0-10.1-3.3-11.9-7.9l-6.6 5.1C8.9 39.7 16 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.3 5.4-6.1 6.9l6.4 5.4C39.9 36.8 44 31 44 24c0-1.3-.1-2.7-.4-3.5z"/>
            </svg>
            Google로 회원가입하기
          </button>

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
