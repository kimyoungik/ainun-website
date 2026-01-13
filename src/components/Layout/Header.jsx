import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { adminService } from '../../services/adminService';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { currentUser, userProfile, logout } = useAuth();

  useEffect(() => {
    checkAdmin();
  }, [currentUser]);

  const checkAdmin = async () => {
    if (currentUser) {
      const adminStatus = await adminService.isAdmin(currentUser.id);
      setIsAdmin(adminStatus);
    } else {
      setIsAdmin(false);
    }
  };

  const menuItems = [
    { name: '회사소개', href: '/#about', isAnchor: true },
    { name: '신문소개', href: '/#newspaper', isAnchor: true },
    { name: '독자후기', href: '/board', isAnchor: false },
    { name: '구독하기', href: '/subscribe', isAnchor: false },
    { name: '고객센터', href: '/#support', isAnchor: true },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const handleAnchorClick = (e, href) => {
    e.preventDefault();
    const anchor = href.split('#')[1];

    // 현재 홈페이지가 아니면 홈으로 이동
    if (window.location.pathname !== '/') {
      navigate('/');
      // 페이지 이동 후 스크롤
      setTimeout(() => {
        const element = document.getElementById(anchor);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // 이미 홈페이지면 바로 스크롤
      const element = document.getElementById(anchor);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    setIsMenuOpen(false);
  };

  const handleRouteClick = (href) => {
    navigate(href);
    setIsMenuOpen(false);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/KakaoTalk_20260111_084512489.jpg" alt="리틀타임즈" className="h-12 md:h-16" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => (
              item.isAnchor ? (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleAnchorClick(e, item.href)}
                  className="text-gray-600 hover:text-sky-500 font-medium transition-colors relative group cursor-pointer"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-400 transition-all group-hover:w-full"></span>
                </a>
              ) : (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => handleRouteClick(item.href)}
                  className="text-gray-600 hover:text-sky-500 font-medium transition-colors relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-400 transition-all group-hover:w-full"></span>
                </button>
              )
            ))}

            {currentUser ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1 bg-amber-100 text-amber-700 px-4 py-2 rounded-full font-bold hover:bg-amber-200 transition-colors"
                  >
                    🛡️ 관리자
                  </Link>
                )}
                <Link
                  to="/mypage"
                  className="flex items-center gap-2 text-gray-600 hover:text-sky-500 transition-colors"
                >
                  <span className="text-2xl">{userProfile?.avatar}</span>
                  <span className="font-medium">{userProfile?.name}님</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-500 font-medium transition-colors"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-sky-500 font-medium transition-colors"
                >
                  로그인
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-sky-400 to-sky-500 text-white px-5 py-2 rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  회원가입
                </Link>
              </div>
            )}
          </nav>

          <button className="md:hidden p-2 text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col gap-3">
              {menuItems.map((item) => (
                item.isAnchor ? (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleAnchorClick(e, item.href)}
                    className="text-gray-600 hover:text-sky-500 font-medium py-2 cursor-pointer"
                  >
                    {item.name}
                  </a>
                ) : (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleRouteClick(item.href)}
                    className="text-gray-600 hover:text-sky-500 font-medium py-2 text-left"
                  >
                    {item.name}
                  </button>
                )
              ))}

              {currentUser ? (
                <div className="flex flex-col gap-3 mt-2 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2 py-2">
                    <span className="text-2xl">{userProfile?.avatar}</span>
                    <span className="font-medium text-gray-700">{userProfile?.name}님</span>
                  </div>
                  <Link
                    to="/mypage"
                    className="text-center bg-sky-100 text-sky-700 px-4 py-3 rounded-full font-bold hover:bg-sky-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    마이페이지
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center justify-center gap-1 bg-amber-100 text-amber-700 px-4 py-3 rounded-full font-bold hover:bg-amber-200 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      🛡️ 관리자 페이지
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-gray-600 hover:text-red-500 font-medium py-2 transition-colors"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 mt-2 pt-3 border-t border-gray-200">
                  <Link
                    to="/login"
                    className="text-center text-gray-600 hover:text-sky-500 font-medium py-2 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    로그인
                  </Link>
                  <Link
                    to="/register"
                    className="text-center bg-gradient-to-r from-sky-400 to-sky-500 text-white px-5 py-3 rounded-full font-bold shadow-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    회원가입
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
