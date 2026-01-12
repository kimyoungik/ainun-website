import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

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
