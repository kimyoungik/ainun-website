import React from 'react';

// 날짜 포맷 함수
function formatDate(date) {
  const now = new Date();
  const diff = now - date;
  const diffMinutes = Math.floor(diff / (1000 * 60));
  const diffHours = Math.floor(diff / (1000 * 60 * 60));
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return '방금 전';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  } else if (diffHours < 24) {
    return `${diffHours}시간 전`;
  } else if (diffDays === 1) {
    return '어제';
  } else if (diffDays < 7) {
    return `${diffDays}일 전`;
  } else {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  }
}

export default function CommentList({ comments, currentUser, onDelete, onEdit }) {
  const [editingId, setEditingId] = React.useState(null);
  const [editContent, setEditContent] = React.useState('');

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <div className="text-4xl mb-2">💬</div>
        <p>첫 번째 댓글을 작성해보세요!</p>
      </div>
    );
  }

  const handleEdit = (comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleSaveEdit = async (commentId) => {
    await onEdit(commentId, editContent);
    setEditingId(null);
    setEditContent('');
  };

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-gray-50 p-4 md:p-5 rounded-2xl">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{comment.authorAvatar}</span>
            <div className="flex-1">
              <div className="font-medium text-gray-800">{comment.author}</div>
              <div className="text-sm text-gray-400">{comment.authorGrade}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-400">
                {formatDate(comment.createdAt)}
              </div>
              {/* 수정/삭제 버튼 (본인 댓글만) */}
              {currentUser && currentUser.id === comment.userId && (
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => handleEdit(comment)}
                    className="text-xs px-2 py-1 bg-sky-500 text-white rounded hover:bg-sky-600 transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDelete(comment.id)}
                    className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>
          {editingId === comment.id ? (
            /* 수정 모드 */
            <div>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg p-3 mb-2 focus:outline-none focus:border-sky-500"
                rows="3"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleSaveEdit(comment.id)}
                  className="px-4 py-1 bg-sky-500 text-white rounded-lg text-sm hover:bg-sky-600 transition-colors"
                >
                  저장
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-1 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400 transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            /* 일반 모드 */
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
          )}
        </div>
      ))}
    </div>
  );
}
