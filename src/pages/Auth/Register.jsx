import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';

export default function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&family=Jua&display=swap');
        .font-jua { font-family: 'Jua', sans-serif; }
      `}</style>

      <Header />

      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl shadow-lg p-10">
          <h1 className="font-jua text-4xl text-gray-800 mb-3">회원가입</h1>
          <p className="text-gray-500 mb-8">회원가입 페이지를 준비 중입니다.</p>
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-sky-400 to-sky-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            로그인으로 이동
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
