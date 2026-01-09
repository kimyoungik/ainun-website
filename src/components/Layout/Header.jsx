import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: '회사소개', href: '/#about' },
    { name: '신문소개', href: '/#newspaper' },
    { name: '독자후기', href: '/board' },
    { name: '구독하기', href: '/#subscribe' },
    { name: '고객센터', href: '/#support' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src="/KakaoTalk_20260108_105533703.png" alt="아이눈 어린이신문" className="h-10 md:h-12" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => (
              item.href.startsWith('/#') ? (
                <a key={item.name} href={item.href} className="text-gray-600 hover:text-sky-500 font-medium transition-colors relative group">
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-400 transition-all group-hover:w-full"></span>
                </a>
              ) : (
                <Link key={item.name} to={item.href} className="text-gray-600 hover:text-sky-500 font-medium transition-colors relative group">
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-400 transition-all group-hover:w-full"></span>
                </Link>
              )
            ))}
            <button className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-5 py-2 rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105">
              구독 신청 →
            </button>
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
                item.href.startsWith('/#') ? (
                  <a key={item.name} href={item.href} className="text-gray-600 hover:text-sky-500 font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                    {item.name}
                  </a>
                ) : (
                  <Link key={item.name} to={item.href} className="text-gray-600 hover:text-sky-500 font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                    {item.name}
                  </Link>
                )
              ))}
              <button className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-5 py-3 rounded-full font-bold mt-2">
                구독 신청 →
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
