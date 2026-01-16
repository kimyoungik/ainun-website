import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import PostCard from '../../components/Board/PostCard';
import { boardService } from '../../services/boardService';

export default function BoardList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 10;
  const latestRequestRef = useRef(0);

  useEffect(() => {
    loadPosts(currentPage);
  }, [currentPage, location.key]);

  const loadPosts = async (page) => {
    const requestId = Date.now();
    latestRequestRef.current = requestId;
    setLoading(true);
    setErrorMessage('');
    let timeoutId = null;
    let settled = false;

    try {
      const timeoutMs = 8000;
      timeoutId = setTimeout(() => {
        if (settled || latestRequestRef.current !== requestId) return;
        settled = true;
        setPosts([]);
        setTotalPages(1);
        setErrorMessage('게시글을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
        setLoading(false);
      }, timeoutMs);

      const data = await boardService.getPosts(page, postsPerPage);
      if (latestRequestRef.current !== requestId || settled) return;
      settled = true;
      setPosts(data.posts || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      if (latestRequestRef.current !== requestId || settled) return;
      settled = true;
      console.error('게시글 로딩 실패:', error);
      setPosts([]);
      setTotalPages(1);
      setErrorMessage('게시글을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (latestRequestRef.current === requestId) {
        setLoading(false);
      }
    }
  };

  const handleWriteClick = () => {
    if (!currentUser) {
      alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
      navigate('/login');
    } else {
      navigate('/board/write');
    }
  };

  const handlePostClick = (postId) => {
    if (!currentUser) {
      alert('로그인이 필요합니다. 로그인 페이지로 이동합니다.');
      navigate('/login');
    } else {
      navigate(`/board/${postId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-amber-50" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&family=Jua&display=swap');
        .font-jua { font-family: 'Jua', sans-serif; }
        .card-hover {
          transition: all 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
      `}</style>

      <Header />

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="font-jua text-4xl md:text-5xl text-gray-800 mb-4">
            <span className="text-amber-500">독자</span> 후기 게시판
          </h1>
          <p className="text-gray-500 text-lg">리틀타임즈와 함께하는 친구들의 생생한 후기를 확인해보세요!</p>
        </div>

        <div className="flex justify-end mb-8">
          <button
            onClick={handleWriteClick}
            className="bg-gradient-to-r from-sky-400 to-sky-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            글쓰기
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-sky-400 border-t-transparent"></div>
            <p className="text-gray-500 mt-4">게시글을 불러오는 중...</p>
          </div>
        ) : errorMessage ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">{errorMessage}</p>
            <button
              onClick={() => loadPosts(currentPage)}
              className="inline-block text-sky-500 font-medium hover:underline cursor-pointer"
            >
              다시 시도
            </button>
          </div>
        ) : (
          <>
            {posts.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} onClick={handlePostClick} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">아직 작성된 게시글이 없습니다.</p>
                <button
                  onClick={handleWriteClick}
                  className="inline-block mt-4 text-sky-500 font-medium hover:underline cursor-pointer"
                >
                  첫 번째 글을 작성해보세요!
                </button>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  이전
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      currentPage === page
                        ? 'bg-sky-500 text-white border-sky-500'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
