import React, { useState } from 'react';

export default function CommentForm({ postId, onCommentAdded }) {
  const [formData, setFormData] = useState({
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

    if (!formData.content.trim()) {
      newErrors.content = '댓글 내용을 입력해주세요.';
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
      await onCommentAdded(formData);
      // 폼 초기화
      setFormData({
        content: '',
        author: '',
        authorGrade: '',
        authorAvatar: ''
      });
      setErrors({});
    } catch (error) {
      alert(error.message || '댓글 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h3 className="font-jua text-xl text-gray-800 mb-4">💬 댓글 작성</h3>

      {/* 댓글 내용 */}
      <div className="mb-4">
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="댓글을 입력하세요..."
          rows={3}
          className={`w-full px-4 py-3 rounded-xl border-2 transition-colors resize-none ${
            errors.content ? 'border-red-400' : 'border-gray-200 focus:border-sky-400'
          } outline-none`}
        />
        {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
      </div>

      {/* 작성자 정보 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="이름"
            className={`w-full px-4 py-2 rounded-xl border-2 transition-colors ${
              errors.author ? 'border-red-400' : 'border-gray-200 focus:border-sky-400'
            } outline-none`}
            maxLength={20}
          />
          {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
        </div>

        <div>
          <select
            name="authorGrade"
            value={formData.authorGrade}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-xl border-2 transition-colors ${
              errors.authorGrade ? 'border-red-400' : 'border-gray-200 focus:border-sky-400'
            } outline-none`}
          >
            <option value="">학년 선택</option>
            {grades.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
          {errors.authorGrade && <p className="text-red-500 text-sm mt-1">{errors.authorGrade}</p>}
        </div>
      </div>

      {/* 아바타 선택 */}
      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          {avatars.map(avatar => (
            <button
              key={avatar}
              type="button"
              onClick={() => handleAvatarSelect(avatar)}
              className={`text-3xl p-3 rounded-xl border-2 transition-all ${
                formData.authorAvatar === avatar
                  ? 'border-sky-500 bg-sky-50 scale-110'
                  : 'border-gray-200 hover:border-sky-300 hover:bg-gray-50'
              }`}
            >
              {avatar}
            </button>
          ))}
        </div>
        {errors.authorAvatar && <p className="text-red-500 text-sm">{errors.authorAvatar}</p>}
      </div>

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-sky-400 to-sky-500 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isSubmitting ? '작성 중...' : '댓글 작성'}
      </button>
    </form>
  );
}
