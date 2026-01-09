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

export default function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <div className="text-4xl mb-2">💬</div>
        <p>첫 번째 댓글을 작성해보세요!</p>
      </div>
    );
  }

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
            <div className="text-sm text-gray-400">
              {formatDate(comment.createdAt)}
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
        </div>
      ))}
    </div>
  );
}
