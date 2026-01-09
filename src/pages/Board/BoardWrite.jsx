import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import { boardService } from '../../services/boardService';

export default function BoardWrite() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    authorGrade: '',
    authorAvatar: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const grades = ['초등 1학년', '초등 2학년', '초등 3학년', '초등 4학년', '초등 5학년', '초등 6학년'];
  const avatars = ['👦', '👧', '🧒', '👶'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // 입력 시 에러 제거
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAvatarSelect = (avatar) => {
    setFormData(prev => ({ ...prev, authorAvatar: avatar }));
    if (errors.authorAvatar) {
      setErrors(prev => ({ ...prev, authorAvatar: '' }));
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

    if (!formData.author.trim()) {
      newErrors.author = '이름을 입력해주세요.';
    } else if (formData.author.trim().length < 2) {
      newErrors.author = '이름을 2자 이상 입력해주세요.';
    }

    if (!formData.authorGrade) {
      newErrors.authorGrade = '학년을 선택해주세요.';
    }

    if (!formData.authorAvatar) {
      newErrors.authorAvatar = '아바타를 선택해주세요.';
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
      await boardService.createPost(formData);
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

          {/* 작성자 정보 */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* 이름 */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">이름</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="이름을 입력하세요"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                  errors.author ? 'border-red-400' : 'border-gray-200 focus:border-sky-400'
                } outline-none`}
                maxLength={20}
              />
              {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
            </div>

            {/* 학년 */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">학년</label>
              <select
                name="authorGrade"
                value={formData.authorGrade}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                  errors.authorGrade ? 'border-red-400' : 'border-gray-200 focus:border-sky-400'
                } outline-none`}
              >
                <option value="">학년을 선택하세요</option>
                {grades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
              {errors.authorGrade && <p className="text-red-500 text-sm mt-1">{errors.authorGrade}</p>}
            </div>
          </div>

          {/* 아바타 선택 */}
          <div className="mb-8">
            <label className="block text-gray-700 font-bold mb-2">아바타 선택</label>
            <div className="flex gap-3">
              {avatars.map(avatar => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => handleAvatarSelect(avatar)}
                  className={`text-4xl p-4 rounded-xl border-2 transition-all ${
                    formData.authorAvatar === avatar
                      ? 'border-sky-500 bg-sky-50 scale-110'
                      : 'border-gray-200 hover:border-sky-300 hover:bg-gray-50'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
            {errors.authorAvatar && <p className="text-red-500 text-sm mt-1">{errors.authorAvatar}</p>}
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
