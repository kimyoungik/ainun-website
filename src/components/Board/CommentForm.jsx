import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function CommentForm({ onCommentAdded }) {
  const { userProfile } = useAuth();
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setContent(e.target.value);
    if (error) {
      setError('');
    }
  };

  const validate = () => {
    if (!content.trim()) {
      setError('댓글 내용을 입력해주세요.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onCommentAdded(content);
      // 폼 초기화
      setContent('');
      setError('');
    } catch (error) {
      alert(error.message || '댓글 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h3 className="font-jua text-xl text-gray-800 mb-4">💬 댓글 작성</h3>

      {/* 작성자 정보 표시 */}
      <div className="mb-4 p-3 bg-sky-50 rounded-xl border-2 border-sky-200">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{userProfile?.avatar}</span>
          <div>
            <p className="font-bold text-gray-800 text-sm">{userProfile?.name}</p>
            <p className="text-xs text-gray-600">{userProfile?.grade}</p>
          </div>
        </div>
      </div>

      {/* 댓글 내용 */}
      <div className="mb-4">
        <textarea
          name="content"
          value={content}
          onChange={handleChange}
          placeholder="댓글을 입력하세요..."
          rows={3}
          className={`w-full px-4 py-3 rounded-xl border-2 transition-colors resize-none ${
            error ? 'border-red-400' : 'border-gray-200 focus:border-sky-400'
          } outline-none`}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
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
