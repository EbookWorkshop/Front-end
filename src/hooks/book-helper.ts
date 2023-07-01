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

  const gotoChapter = (chapterid: number) => {
    router.push({ path: `/book/${bookId}/chapter/${chapterid}` });
  };

  return {
    bookId,
    chapterId,
    isEdit,
    gotoIndex,
    gotoChapter,
  };
}
