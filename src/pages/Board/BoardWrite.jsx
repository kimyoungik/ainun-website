import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import { boardService } from '../../services/boardService';

export default function BoardWrite() {
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // 입력 시 에러 제거
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요.';
    } else if (formData.title.length > 100) {
      newErrors.title = '제목은 100자 이하로 입력해주세요.';
    }

    if (!formData.content.trim()) {
      newErrors.content = '내용을 입력해주세요.';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = '내용을 10자 이상 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await boardService.createPost(formData.title, formData.content, currentUser.id);
      alert('게시글이 작성되었습니다!');
      navigate('/board');
    } catch (error) {
      alert(error.message || '게시글 작성에 실패했습니다.');
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

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="font-jua text-4xl md:text-5xl text-gray-800 mb-4">
            <span className="text-sky-500">후기</span> 작성하기
          </h1>
          <p className="text-gray-500 text-lg">아이눈 신문에 대한 여러분의 생각을 들려주세요!</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-lg p-8 md:p-10">
          {/* 제목 */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">제목</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="제목을 입력하세요 (최대 100자)"
              className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                errors.title ? 'border-red-400' : 'border-gray-200 focus:border-sky-400'
              } outline-none`}
              maxLength={100}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* 내용 */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">내용</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="아이눈 신문에 대한 후기를 자유롭게 작성해주세요 (최소 10자)"
              rows={10}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-colors resize-none ${
                errors.content ? 'border-red-400' : 'border-gray-200 focus:border-sky-400'
              } outline-none`}
            />
            {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
          </div>

          {/* 작성자 정보 표시 */}
          <div className="mb-8 p-4 bg-sky-50 rounded-xl border-2 border-sky-200">
            <p className="text-sm text-gray-600 mb-2">작성자 정보</p>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{userProfile?.avatar}</span>
              <div>
                <p className="font-bold text-gray-800">{userProfile?.name}</p>
                <p className="text-sm text-gray-600">{userProfile?.grade}</p>
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/board')}
              className="flex-1 py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-sky-400 to-sky-500 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? '작성 중...' : '✏️ 작성 완료'}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
