
/**
 * 规则类型选项
 */
export const rulesOptions = [
  {
    label: '目录',
    isGroup: true,
    options: [
      { value: 'BookCover', label: '目录-封面' },
      { value: 'BookName', label: '★目录-书名' },
      { value: 'ChapterList', label: '★目录-章节列表' },
      { value: 'IndexNextPage', label: '目录-下一页' },
      { value: 'Author', label: '目录-作者' },
      { value: 'Introduction', label: '目录-简介' },
    ],
  },
  {
    label: '文章',
    isGroup: true,
    options: [
      { value: 'CapterTitle', label: '文章-标题' },
      { value: 'Content', label: '★文章-正文' },
      { value: 'ContentNextPage', label: '文章-下一页' },
    ],
  },
];

export const UAChoose =[
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.7727.114 Mobile Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/148.0.7778.100 Mobile/15E148 Safari/604.1"
]