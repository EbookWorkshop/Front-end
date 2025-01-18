import axios from 'axios';

// if (import.meta.env.VITE_API_BASE_URL) {
//   axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
// }

/**
 * 拿到书的标签
 * @param id
 * @returns
 */
export function queryTagByBookId(id: number) {
  return axios.get(`/library/ebooktag?bookid=${id}`);
}

/**
 * 给指定书加入一个标签
 * @param bookid 要加标签的书Id
 * @param text 标签文本
 * @returns
 */
export function addTagForBook(bookid: number, text: string) {
  return axios.post(`/library/tag`, {
    bookId: bookid,
    tagText: text,
  });
}

/**
 * 删除书的标签
 * @param bookId 对应的书Id
 * @param tagId 要删除的标签Id
 */
export function removeTagForBook(bookId: number, tagId: number) {
  return axios.delete('/library/tag', {
    params: { bookid: bookId, tagid: tagId },
  });
}
