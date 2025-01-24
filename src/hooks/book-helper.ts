import { useRouter, useRoute } from 'vue-router';

/**
 *
 * @returns
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
