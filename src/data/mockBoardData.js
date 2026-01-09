export const mockPosts = [
  {
    id: 1,
    title: "아이눈 신문 너무 재밌어요!",
    content: "매주 아이눈 신문이 오는 날이 제일 기다려져요! 어려운 뉴스도 쉽게 설명해주고, 만화도 있어서 정말 좋아요. 특히 과학 코너가 제일 재밌어요. 친구들한테도 추천했어요!",
    author: "김민준",
    authorGrade: "초등 4학년",
    authorAvatar: "👦",
    createdAt: new Date("2026-01-08"),
    viewCount: 45,
    likeCount: 12,
    comments: [
      {
        id: 1,
        postId: 1,
        content: "저도 과학 코너 좋아해요!",
        author: "이서연",
        authorGrade: "초등 3학년",
        authorAvatar: "👧",
        createdAt: new Date("2026-01-08T14:30:00")
      },
      {
        id: 2,
        postId: 1,
        content: "다음주 신문도 기대돼요 ㅎㅎ",
        author: "박지호",
        authorGrade: "초등 5학년",
        authorAvatar: "👦",
        createdAt: new Date("2026-01-09T09:15:00")
      }
    ]
  },
  {
    id: 2,
    title: "엄마랑 같이 읽어요",
    content: "엄마가 아이눈 신문을 같이 읽자고 하셔서 처음엔 싫었는데, 읽어보니까 정말 재밌어요. 특히 세계 여러 나라 이야기가 신기해요!",
    author: "최서윤",
    authorGrade: "초등 2학년",
    authorAvatar: "👧",
    createdAt: new Date("2026-01-07"),
    viewCount: 62,
    likeCount: 18,
    comments: [
      {
        id: 3,
        postId: 2,
        content: "저도 부모님이랑 같이 읽어요!",
        author: "정우진",
        authorGrade: "초등 3학년",
        authorAvatar: "🧒",
        createdAt: new Date("2026-01-07T16:20:00")
      }
    ]
  },
  {
    id: 3,
    title: "퀴즈 풀기 너무 좋아요",
    content: "매주 나오는 퀴즈 풀면서 상식도 늘고 재밌어요. 친구들이랑 누가 먼저 맞추나 시합도 해요!",
    author: "강하늘",
    authorGrade: "초등 5학년",
    authorAvatar: "👦",
    createdAt: new Date("2026-01-06"),
    viewCount: 38,
    likeCount: 9,
    comments: [
      {
        id: 4,
        postId: 3,
        content: "퀴즈 어려울 때도 있어요 ㅠㅠ",
        author: "윤지우",
        authorGrade: "초등 4학년",
        authorAvatar: "👧",
        createdAt: new Date("2026-01-06T18:45:00")
      },
      {
        id: 5,
        postId: 3,
        content: "그래도 재밌어요!",
        author: "강하늘",
        authorGrade: "초등 5학년",
        authorAvatar: "👦",
        createdAt: new Date("2026-01-06T19:00:00")
      }
    ]
  },
  {
    id: 4,
    title: "학교 숙제할 때 도움돼요",
    content: "사회 숙제할 때 아이눈 신문 보고 하면 더 쉬워요. 선생님도 칭찬해주셨어요!",
    author: "송민재",
    authorGrade: "초등 6학년",
    authorAvatar: "👦",
    createdAt: new Date("2026-01-05"),
    viewCount: 71,
    likeCount: 22,
    comments: [
      {
        id: 6,
        postId: 4,
        content: "저도 발표 준비할 때 많이 봐요!",
        author: "한예린",
        authorGrade: "초등 5학년",
        authorAvatar: "👧",
        createdAt: new Date("2026-01-05T15:30:00")
      }
    ]
  },
  {
    id: 5,
    title: "만화가 최고예요!",
    content: "매주 연재되는 만화 보는 게 제일 재밌어요. 다음 이야기가 궁금해서 일주일 내내 기다려요!",
    author: "임수아",
    authorGrade: "초등 3학년",
    authorAvatar: "👧",
    createdAt: new Date("2026-01-04"),
    viewCount: 54,
    likeCount: 15,
    comments: [
      {
        id: 7,
        postId: 5,
        content: "저도 만화 팬이에요!",
        author: "조현우",
        authorGrade: "초등 4학년",
        authorAvatar: "👦",
        createdAt: new Date("2026-01-04T17:00:00")
      },
      {
        id: 8,
        postId: 5,
        content: "이번주 만화 진짜 재밌었어요 ㅋㅋ",
        author: "김나영",
        authorGrade: "초등 3학년",
        authorAvatar: "👧",
        createdAt: new Date("2026-01-05T10:20:00")
      }
    ]
  },
  {
    id: 6,
    title: "동생이랑 같이 봐요",
    content: "1학년 동생이랑 같이 아이눈 신문 읽어요. 제가 어려운 단어는 설명해주고 있어요!",
    author: "오태양",
    authorGrade: "초등 4학년",
    authorAvatar: "👦",
    createdAt: new Date("2026-01-03"),
    viewCount: 42,
    likeCount: 11,
    comments: [
      {
        id: 9,
        postId: 6,
        content: "멋져요! 좋은 언니/오빠네요!",
        author: "배소율",
        authorGrade: "초등 5학년",
        authorAvatar: "👧",
        createdAt: new Date("2026-01-03T14:15:00")
      }
    ]
  },
  {
    id: 7,
    title: "역사 이야기가 신기해요",
    content: "이번주에 나온 독립운동가 이야기가 정말 감동적이었어요. 우리나라 역사를 더 알고 싶어졌어요!",
    author: "신채원",
    authorGrade: "초등 6학년",
    authorAvatar: "👧",
    createdAt: new Date("2026-01-02"),
    viewCount: 67,
    likeCount: 20,
    comments: [
      {
        id: 10,
        postId: 7,
        content: "저도 그 기사 읽고 감동받았어요",
        author: "황준서",
        authorGrade: "초등 6학년",
        authorAvatar: "👦",
        createdAt: new Date("2026-01-02T16:40:00")
      }
    ]
  },
  {
    id: 8,
    title: "사진이 예뻐요",
    content: "신문에 나오는 사진들이 다 예쁘고 신기해요. 특히 동물 사진이 좋아요!",
    author: "류다은",
    authorGrade: "초등 2학년",
    authorAvatar: "👧",
    createdAt: new Date("2026-01-01"),
    viewCount: 51,
    likeCount: 14,
    comments: [
      {
        id: 11,
        postId: 8,
        content: "저번주 판다 사진 귀여웠어요!",
        author: "전시우",
        authorGrade: "초등 3학년",
        authorAvatar: "👦",
        createdAt: new Date("2026-01-01T11:25:00")
      },
      {
        id: 12,
        postId: 8,
        content: "동물 코너 매주 기대돼요",
        author: "최아린",
        authorGrade: "초등 2학년",
        authorAvatar: "👧",
        createdAt: new Date("2026-01-01T15:50:00")
      }
    ]
  },
  {
    id: 9,
    title: "친구한테 신문 빌려줬어요",
    content: "친구가 아이눈 신문 너무 재밌다고 해서 같이 봤어요. 친구도 구독하고 싶대요!",
    author: "홍지안",
    authorGrade: "초등 5학년",
    authorAvatar: "👦",
    createdAt: new Date("2025-12-30"),
    viewCount: 35,
    likeCount: 8,
    comments: [
      {
        id: 13,
        postId: 9,
        content: "우정이 느껴져요!",
        author: "안서진",
        authorGrade: "초등 4학년",
        authorAvatar: "👧",
        createdAt: new Date("2025-12-30T13:10:00")
      }
    ]
  },
  {
    id: 10,
    title: "생일 선물로 받았어요",
    content: "엄마가 생일 선물로 아이눈 신문 1년 구독권을 주셨어요. 최고의 선물이에요!",
    author: "문재원",
    authorGrade: "초등 3학년",
    authorAvatar: "🧒",
    createdAt: new Date("2025-12-29"),
    viewCount: 58,
    likeCount: 16,
    comments: [
      {
        id: 14,
        postId: 10,
        content: "생일 축하해요!",
        author: "장하은",
        authorGrade: "초등 3학년",
        authorAvatar: "👧",
        createdAt: new Date("2025-12-29T14:35:00")
      },
      {
        id: 15,
        postId: 10,
        content: "좋은 선물이네요!",
        author: "남도윤",
        authorGrade: "초등 4학년",
        authorAvatar: "👦",
        createdAt: new Date("2025-12-29T18:20:00")
      }
    ]
  },
  {
    id: 11,
    title: "영어 단어도 배워요",
    content: "신문에 나오는 영어 단어 코너가 있어서 자연스럽게 영어도 배워요. 일석이조예요!",
    author: "서지훈",
    authorGrade: "초등 5학년",
    authorAvatar: "👦",
    createdAt: new Date("2025-12-28"),
    viewCount: 44,
    likeCount: 10,
    comments: [
      {
        id: 16,
        postId: 11,
        content: "영어 단어 코너 저도 좋아해요!",
        author: "권민서",
        authorGrade: "초등 4학년",
        authorAvatar: "👧",
        createdAt: new Date("2025-12-28T10:40:00")
      }
    ]
  },
  {
    id: 12,
    title: "환경 기사가 인상 깊었어요",
    content: "이번주 환경 보호 기사를 읽고 분리수거를 더 열심히 하게 됐어요. 지구를 지켜야겠어요!",
    author: "표수빈",
    authorGrade: "초등 6학년",
    authorAvatar: "👧",
    createdAt: new Date("2025-12-27"),
    viewCount: 73,
    likeCount: 25,
    comments: [
      {
        id: 17,
        postId: 12,
        content: "저도 그 기사 읽고 감동받았어요",
        author: "노준혁",
        authorGrade: "초등 6학년",
        authorAvatar: "👦",
        createdAt: new Date("2025-12-27T15:55:00")
      },
      {
        id: 18,
        postId: 12,
        content: "같이 환경 지켜요!",
        author: "고윤아",
        authorGrade: "초등 5학년",
        authorAvatar: "👧",
        createdAt: new Date("2025-12-28T09:30:00")
      }
    ]
  }
];
