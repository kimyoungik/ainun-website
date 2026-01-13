import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-jua text-2xl text-sky-400">리틀타임즈</span>
              <span className="font-jua text-xl text-gray-400">어린이신문</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">세상을 보는 맑은 눈을 키워주는 리틀타임즈 어린이신문.<br />우리 아이의 건강한 성장을 함께합니다.</p>
          </div>
          <div>
            <div className="font-bold mb-4">바로가기</div>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">회사소개</a></li>
              <li><a href="#" className="hover:text-white transition-colors">이용약관</a></li>
              <li><a href="#" className="hover:text-white transition-colors">개인정보처리방침</a></li>
              <li><a href="#" className="hover:text-white transition-colors">제휴문의</a></li>
            </ul>
          </div>
          <div>
            <div className="font-bold mb-4">연락처</div>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>📞 1588-0000</li>
              <li>📧 help@ainun.kr</li>
              <li>🏢 서울시 강남구 어딘가로 123</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-500 text-sm">
          © 2026 리틀타임즈 어린이신문. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
