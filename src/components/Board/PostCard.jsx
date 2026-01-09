import React from 'react';
import { Link } from 'react-router-dom';

// 날짜 포맷 함수
function formatDate(date) {
  const now = new Date();
  const diff = now - date;
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return '오늘';
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

export default function PostCard({ post }) {
  return (
    <Link to={`/board/${post.id}`} className="block">
      <div className="card-hover bg-white p-6 rounded-3xl border border-gray-100 h-full">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{post.authorAvatar}</span>
          <div className="flex-1">
            <div className="font-medium text-gray-800">{post.author}</div>
            <div className="text-sm text-gray-400">{post.authorGrade}</div>
          </div>
          <div className="text-sm text-gray-400">
            {formatDate(post.createdAt)}
          </div>
        </div>

        <h3 className="font-jua text-xl text-gray-800 mb-2 line-clamp-1">{post.title}</h3>
        <p className="text-gray-500 line-clamp-2 mb-4 leading-relaxed">{post.content}</p>

        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            👁️ {post.viewCount}
          </span>
          <span className="flex items-center gap-1">
            ❤️ {post.likeCount}
          </span>
          <span className="flex items-center gap-1">
            💬 {post.comments.length}
          </span>
        </div>
      </div>
    </Link>
  );
}
