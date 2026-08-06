import { useRouter, useRoute } from 'vue-router';

/**
 * 解释地址，取出其中的参数书籍ID和章节ID，判断是否为编辑模式
 * @returns 书籍ID、章节ID、是否为编辑模式、跳转到本书目录、跳转到某章（阅读模式）
 */
export default function useBookHelper() {
  const route = useRoute();
  const router = useRouter();

  const bookId = Number(route.params.id);
  const chapterId = Number(route.params.cid);
  const isEdit = route.path.includes('/bookedit/');

  const gotoIndex = () => {
    router.push({ path: `/book/${bookId}` });
  };

  const gotoChapter = (chapterid: number, isNewWin = false) => {
    if (!isNewWin) {
      router.push({
        path: `${bookId ? `/book/${bookId}` : ''}/chapter/${chapterid}`,
      });
    } else {
      // const targetData = router.resolve({name:`/book/${bookId}/chapter/${chapterid}`});
      window.open(
        `${bookId ? `/book/${bookId}` : ''}/chapter/${chapterid}`,
        '_blank'
      );
    }
  };

  return {
    bookId,
    chapterId,
    isEdit,
    /**
     * 打开本书目录
     */
    gotoIndex,
    /**
     * 打开某一章-阅读
     * @param chapterid
     */
    gotoChapter,
  };
}
