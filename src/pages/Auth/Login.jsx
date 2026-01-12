import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/board';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message || 'Google login failed.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || '로그인에 실패했습니다.');
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

      <div className="max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="font-jua text-4xl text-gray-800 mb-2">
            로그인
          </h1>
          <p className="text-gray-500">아이눈과 함께해요!</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-lg p-8">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full mb-4 flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-bold shadow-sm hover:bg-gray-50 transition-all hover:scale-105 cursor-pointer"
          >
            <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C34.1 32.7 29.6 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.2 6 29.4 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"/>
              <path fill="#4CAF50" d="M24 44c5.3 0 10.2-2 13.9-5.3l-6.4-5.4C29.6 35.7 26.9 36 24 36c-5.6 0-10.1-3.3-11.9-7.9l-6.6 5.1C8.9 39.7 16 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.3 5.4-6.1 6.9l6.4 5.4C39.9 36.8 44 31 44 24c0-1.3-.1-2.7-.4-3.5z"/>
            </svg>
            Google로 간편 로그인하기
          </button>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">이메일</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일을 입력하세요"
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 outline-none transition-colors"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">비밀번호</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              required
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-400 outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-sky-400 to-sky-500 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mb-4"
          >
            {isSubmitting ? '로그인 중...' : '로그인'}
          </button>

          <div className="text-center">
            <p className="text-gray-500 text-sm">
              아직 회원이 아니신가요?{' '}
              <Link to="/register" className="text-sky-500 font-bold hover:underline">
                회원가입
              </Link>
            </p>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
