import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import { boardService } from '../services/boardService';

export default function Home() {
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const fallbackTestimonials = [
    { name: "김지유 (초등 3학년)", text: "매주 리틀타임즈 신문이 오는 날이 제일 기다려져요! 어려운 뉴스도 쉽게 알려줘서 좋아요.", avatar: "🧒" },
    { name: "이준서 (초등 5학년)", text: "친구들한테 뉴스 이야기해주면 다들 신기해해요. 리틀타임즈 덕분이에요!", avatar: "👦" },
    { name: "박소율 (초등 2학년)", text: "그림이랑 만화가 많아서 재밌어요. 엄마아빠랑 같이 읽어요!", avatar: "👧" },
  ];

  const [testimonials, setTestimonials] = useState(fallbackTestimonials);

  useEffect(() => {
    let mounted = true;

    const loadTestimonials = async () => {
      try {
        const data = await boardService.getPosts(1, 3);
        const items = (data?.posts || []).slice(0, 3).map((post) => {
          const content = post?.content || '';
          const preview = content.length > 120 ? `${content.slice(0, 120)}...` : content;
          return {
            name: `${post.author} (${post.authorGrade})`,
            text: preview,
            avatar: post.authorAvatar,
          };
        });

        if (mounted) {
          setTestimonials(items.length ? items : fallbackTestimonials);
          setActiveTestimonial(0);
        }
      } catch (error) {
        console.error('Failed to load testimonials:', error);
        if (mounted) {
          setTestimonials(fallbackTestimonials);
          setActiveTestimonial(0);
        }
      }
    };

    loadTestimonials();

    return () => {
      mounted = false;
    };
  }, []);

  // 자동 슬라이드 효과
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000); // 4초마다 자동 전환

    return () => clearInterval(interval);
  }, [isPaused, testimonials.length]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&family=Jua&display=swap');

        .font-jua { font-family: 'Jua', sans-serif; }

        .logo-text {
          font-family: 'Jua', sans-serif;
          background: linear-gradient(135deg, #5BA3C0 0%, #7AC4E0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logo-sub {
          font-family: 'Jua', sans-serif;
          color: #6B8090;
        }

        .sparkle {
          animation: sparkle 1.5s ease-in-out infinite;
        }

        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }

        .float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .bounce-soft {
          animation: bounceSoft 2s ease-in-out infinite;
        }

        @keyframes bounceSoft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .hero-pattern {
          background-image:
            radial-gradient(circle at 20% 80%, rgba(251, 191, 36, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(96, 165, 250, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(74, 222, 128, 0.08) 0%, transparent 40%);
        }

        .card-hover {
          transition: all 0.3s ease;
        }

        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
      `}</style>

      <Header />

      {/* 히어로 섹션 */}
      <section className="hero-pattern relative overflow-hidden pb-24 md:pb-32">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20 lg:py-24">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16">
            <div className="flex-1 text-center md:text-left slide-up">
              <div className="inline-block bg-sky-100 text-sky-600 px-4 py-1 rounded-full text-sm font-medium mb-4">
                🎉 2026년 새해 특별 할인 중!
              </div>
              <h1 className="font-jua text-4xl md:text-5xl lg:text-6xl text-gray-800 leading-tight mb-6">
                아이의 눈으로<br />
                <span className="text-sky-500">세상</span>을 읽다!
              </h1>
              <p className="text-gray-600 text-lg md:text-xl mb-8 leading-relaxed">
                어린이 눈높이에 맞춘 쉽고 재미있는 뉴스!<br />
                <strong className="text-amber-500">매주 새로운 세상</strong>을 만나보세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-4 md:mb-0">
                <button className="bg-white text-gray-700 px-8 py-4 rounded-2xl font-bold text-lg shadow-md hover:shadow-lg transition-all border-2 border-gray-100 hover:border-sky-200">
                  📖 신문 미리보기
                </button>
              </div>
            </div>

            <div className="flex-1 relative float mt-8 md:mt-0">
              <div className="relative w-full max-w-lg mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl p-3 transform rotate-1 hover:rotate-0 transition-transform">
                  <img src="/newspaper.png" alt="리틀타임즈 신문" className="w-full h-auto rounded-lg" />
                </div>
                <div className="absolute -top-6 -right-6 text-4xl sparkle">⭐</div>
                <div className="absolute -bottom-4 -left-4 text-3xl sparkle" style={{ animationDelay: '0.5s' }}>✨</div>
                <div className="absolute top-1/2 -right-10 text-2xl sparkle" style={{ animationDelay: '1s' }}>💡</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* 신문 특징 섹션 */}
      <section id="newspaper" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-jua text-3xl md:text-4xl text-gray-800 mb-4">
              리틀타임즈 어린이신문은 <span className="text-amber-500">특별</span>해요!
            </h2>
            <p className="text-gray-500 text-lg">어린이 눈높이에 맞춘 알찬 콘텐츠</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-hover bg-gradient-to-br from-sky-50 to-white p-8 rounded-3xl border border-sky-100">
              <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center text-3xl mb-6">📚</div>
              <h3 className="font-jua text-xl text-gray-800 mb-3">쉬운 뉴스 설명</h3>
              <p className="text-gray-500 leading-relaxed">어려운 시사 뉴스도 쉽고 재미있게! 초등학생 눈높이에 딱 맞춘 설명으로 세상 돌아가는 이야기를 알려드려요.</p>
            </div>

            <div className="card-hover bg-gradient-to-br from-amber-50 to-white p-8 rounded-3xl border border-amber-100">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl mb-6">🎨</div>
              <h3 className="font-jua text-xl text-gray-800 mb-3">재미있는 만화</h3>
              <p className="text-gray-500 leading-relaxed">매주 연재되는 인기 만화와 퀴즈! 읽는 재미와 함께 생각하는 힘도 쑥쑥 자라나요.</p>
            </div>

            <div className="card-hover bg-gradient-to-br from-green-50 to-white p-8 rounded-3xl border border-green-100">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mb-6">🌱</div>
              <h3 className="font-jua text-xl text-gray-800 mb-3">NIE 학습자료</h3>
              <p className="text-gray-500 leading-relaxed">신문을 활용한 교육(NIE) 자료가 함께 제공돼요. 독서 논술, 토론 활동에 딱이에요!</p>
            </div>
          </div>
        </div>
      </section>

      {/* 구독 플랜 섹션 */}
      <section id="subscribe" className="py-16 bg-gradient-to-b from-white to-sky-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-jua text-3xl md:text-4xl text-gray-800 mb-4">
              구독 플랜을 <span className="text-sky-500">선택</span>하세요
            </h2>
            <p className="text-gray-500 text-lg">첫 달 50% 할인 이벤트 진행 중!</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card-hover bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="text-gray-400 font-medium mb-2">1개월</div>
                <div className="font-jua text-4xl text-gray-800 mb-1">15,000원</div>
                <div className="text-gray-400 text-sm mb-6">월 15,000원</div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-gray-600"><span className="text-green-500">✓</span> 주간 신문 4회 배송</li>
                  <li className="flex items-center gap-2 text-gray-600"><span className="text-green-500">✓</span> NIE 학습자료 제공</li>
                  <li className="flex items-center gap-2 text-gray-600"><span className="text-green-500">✓</span> 디지털 신문 열람</li>
                  <li className="flex items-center gap-2 text-gray-600"><span className="text-green-500">✓</span> 독자후기 작성</li>
                  <li className="flex items-center gap-2 text-transparent"><span>　</span>　</li>
                </ul>
                <button
                  onClick={() => navigate('/subscribe?plan=1month')}
                  className="w-full py-3 rounded-xl border-2 border-sky-400 text-sky-500 font-bold hover:bg-sky-50 transition-all hover:scale-105 cursor-pointer"
                >
                  구독하기
                </button>
              </div>
            </div>

            <div className="card-hover bg-gradient-to-b from-sky-500 to-sky-600 p-8 rounded-3xl shadow-xl relative transform md:scale-105">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-sm font-bold px-4 py-1 rounded-full">BEST 추천!</div>
              <div className="text-center">
                <div className="text-sky-200 font-medium mb-2">3개월</div>
                <div className="font-jua text-4xl text-white mb-1">40,000원</div>
                <div className="text-sky-200 text-sm mb-6">월 13,333원 <span className="line-through opacity-60">45,000원</span></div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-white"><span className="text-amber-300">✓</span> 주간 신문 12회 배송</li>
                  <li className="flex items-center gap-2 text-white"><span className="text-amber-300">✓</span> NIE 학습자료 제공</li>
                  <li className="flex items-center gap-2 text-white"><span className="text-amber-300">✓</span> 디지털 신문 열람</li>
                  <li className="flex items-center gap-2 text-white"><span className="text-amber-300">✓</span> 독자후기 작성</li>
                  <li className="flex items-center gap-2 text-white"><span className="text-amber-300">✓</span> 5,000원 할인!</li>
                </ul>
                <button
                  onClick={() => navigate('/subscribe?plan=3months')}
                  className="w-full py-3 rounded-xl border-2 border-white text-white font-bold hover:bg-white hover:text-sky-600 transition-all hover:scale-105 cursor-pointer"
                >
                  구독하기
                </button>
              </div>
            </div>

            <div className="card-hover bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="text-gray-400 font-medium mb-2">6개월</div>
                <div className="font-jua text-4xl text-gray-800 mb-1">75,000원</div>
                <div className="text-gray-400 text-sm mb-6">월 12,500원 <span className="line-through opacity-60">90,000원</span></div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-gray-600"><span className="text-green-500">✓</span> 주간 신문 24회 배송</li>
                  <li className="flex items-center gap-2 text-gray-600"><span className="text-green-500">✓</span> NIE 학습자료 제공</li>
                  <li className="flex items-center gap-2 text-gray-600"><span className="text-green-500">✓</span> 디지털 신문 열람</li>
                  <li className="flex items-center gap-2 text-gray-600"><span className="text-green-500">✓</span> 독자후기 작성</li>
                  <li className="flex items-center gap-2 text-gray-600"><span className="text-amber-500">🎁</span> 특별 선물 증정</li>
                </ul>
                <button
                  onClick={() => navigate('/subscribe?plan=6months')}
                  className="w-full py-3 rounded-xl border-2 border-sky-400 text-sky-500 font-bold hover:bg-sky-50 transition-all hover:scale-105 cursor-pointer"
                >
                  구독하기
                </button>
              </div>
            </div>

            <div className="card-hover bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="text-gray-400 font-medium mb-2">12개월</div>
                <div className="font-jua text-4xl text-gray-800 mb-1">140,000원</div>
                <div className="text-gray-400 text-sm mb-6">월 11,667원 <span className="line-through opacity-60">180,000원</span></div>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-gray-600"><span className="text-green-500">✓</span> 주간 신문 48회 배송</li>
                  <li className="flex items-center gap-2 text-gray-600"><span className="text-green-500">✓</span> NIE 학습자료 제공</li>
                  <li className="flex items-center gap-2 text-gray-600"><span className="text-green-500">✓</span> 디지털 신문 열람</li>
                  <li className="flex items-center gap-2 text-gray-600"><span className="text-green-500">✓</span> 40,000원 할인!</li>
                  <li className="flex items-center gap-2 text-gray-600"><span className="text-amber-500">🎁</span> 프리미엄 선물 증정</li>
                </ul>
                <button
                  onClick={() => navigate('/subscribe?plan=12months')}
                  className="w-full py-3 rounded-xl border-2 border-sky-400 text-sky-500 font-bold hover:bg-sky-50 transition-all hover:scale-105 cursor-pointer"
                >
                  구독하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 독자 후기 섹션 */}
      <section id="reviews" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-jua text-3xl md:text-4xl text-gray-800 mb-4">
              <span className="text-amber-500">독자</span>들의 이야기
            </h2>
            <p className="text-gray-500 text-lg">리틀타임즈과 함께하는 친구들의 후기</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div
              className="bg-gradient-to-br from-sky-50 to-amber-50 p-8 md:p-12 rounded-3xl relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="absolute top-4 left-6 text-6xl text-sky-200 font-serif">"</div>
              <div className="text-center pt-8">
                <div className="text-6xl mb-4">{testimonials[activeTestimonial].avatar}</div>
                <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-6">{testimonials[activeTestimonial].text}</p>
                <div className="font-medium text-gray-800">{testimonials[activeTestimonial].name}</div>
              </div>
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all ${index === activeTestimonial ? 'bg-sky-500 w-8' : 'bg-gray-300 hover:bg-gray-400'}`}
                  />
                ))}
              </div>
            </div>
            <div className="text-center mt-8">
              <button
                onClick={() => navigate('/board/write')}
                className="text-sky-500 font-medium hover:underline"
              >
                ✏️ 나도 후기 작성하기
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 회사 소개 섹션 */}
      <section id="about" className="py-16 bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-jua text-3xl md:text-4xl text-gray-800 mb-6">
                <span className="text-sky-500">리틀타임즈</span>을 소개합니다
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">리틀타임즈 어린이신문은 어린이들이 세상을 바라보는 맑고 건강한 시각을 키워주기 위해 탄생했습니다.</p>
              <p className="text-gray-600 leading-relaxed mb-6">전문 기자와 교육 전문가가 함께 만드는 양질의 콘텐츠로, 우리 아이들의 지적 호기심과 비판적 사고력을 길러줍니다.</p>
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center">
                  <div className="font-jua text-3xl text-sky-500">10,000+</div>
                  <div className="text-gray-500 text-sm">구독 가정</div>
                </div>
                <div className="text-center">
                  <div className="font-jua text-3xl text-amber-500">500+</div>
                  <div className="text-gray-500 text-sm">학교 구독</div>
                </div>
                <div className="text-center">
                  <div className="font-jua text-3xl text-green-500">98%</div>
                  <div className="text-gray-500 text-sm">만족도</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-sky-100 to-amber-100 rounded-3xl p-8 text-center">
                <div className="text-8xl mb-4">🏢</div>
                <div className="font-jua text-2xl text-gray-700 mb-2">리틀타임즈 미디어</div>
                <div className="text-gray-500">아이들의 꿈을 응원합니다</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 무료 체험 신청 섹션 */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-amber-400 to-orange-400 rounded-3xl shadow-xl p-8 md:p-12 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>

              <div className="relative z-10">
                <div className="text-5xl mb-4">🎁</div>
                <h2 className="font-jua text-3xl md:text-4xl mb-4">
                  무료 체험 신청하기
                </h2>
                <p className="text-lg md:text-xl mb-2 text-white/90">
                  리틀타임즈 어린이신문을 먼저 체험해보세요!
                </p>
                <p className="text-sm md:text-base mb-8 text-white/80">
                  첫 1회 무료 배송 후 구독 여부를 결정하실 수 있습니다.
                </p>

                <button
                  onClick={() => navigate('/free-trial')}
                  className="bg-white text-orange-500 px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all hover:scale-105 shadow-lg cursor-pointer"
                >
                  무료 체험 신청하기 →
                </button>

                <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-white/90">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">✓</span>
                    <span>신청 후 1주일 무료 체험</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">✓</span>
                    <span>구독 강제 없음</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">✓</span>
                    <span>빠른 배송</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 고객센터 섹션 */}
      <section id="support" className="py-16 bg-gradient-to-b from-sky-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-jua text-3xl md:text-4xl text-gray-800 mb-4"><span className="text-sky-500">고객센터</span></h2>
            <p className="text-gray-500 text-lg">궁금한 점이 있으시면 언제든 문의해주세요</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card-hover bg-gray-50 p-6 rounded-2xl text-center">
              <div className="text-4xl mb-4">📞</div>
              <div className="font-bold text-gray-800 mb-2">전화 상담</div>
              <div className="text-sky-500 font-bold text-lg">1588-0000</div>
              <div className="text-gray-400 text-sm mt-1">평일 9:00 - 18:00</div>
            </div>
            <div className="card-hover bg-gray-50 p-6 rounded-2xl text-center">
              <div className="text-4xl mb-4">💬</div>
              <div className="font-bold text-gray-800 mb-2">카카오톡 상담</div>
              <div className="text-sky-500 font-bold text-lg">@리틀타임즈</div>
              <div className="text-gray-400 text-sm mt-1">24시간 문의 가능</div>
            </div>
            <div className="card-hover bg-gray-50 p-6 rounded-2xl text-center">
              <div className="text-4xl mb-4">📧</div>
              <div className="font-bold text-gray-800 mb-2">이메일 문의</div>
              <div className="text-sky-500 font-bold text-lg">help@ainun.kr</div>
              <div className="text-gray-400 text-sm mt-1">24시간 내 답변</div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto mt-12">
            <h3 className="font-jua text-xl text-gray-800 mb-6 text-center">자주 묻는 질문</h3>
            <div className="space-y-3">
              {[
                { q: "배송은 언제 되나요?", a: "매주 월요일에 발송되어 화~수요일 수령 가능합니다." },
                { q: "구독 해지는 어떻게 하나요?", a: "마이페이지 또는 고객센터를 통해 언제든 해지 가능합니다." },
                { q: "환불 정책은 어떻게 되나요?", a: "미발송분에 대해 100% 환불해 드립니다." },
              ].map((faq, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-xl">
                  <div className="font-medium text-gray-800 mb-1">Q. {faq.q}</div>
                  <div className="text-gray-500 text-sm">A. {faq.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
