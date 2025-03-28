
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