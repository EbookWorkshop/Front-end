import axios from 'axios';
// import qs from 'query-string';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';

export interface Chapter {
  Title: string;
  OrderNum: number;
  IndexId: number;
  Content?: string;
  IsHasContent?: boolean;
}
export interface Book {
  BookId: number;
  BookName: string;
  CoverImg: string;
  Index: Chapter[];
  data?: DescData[];
}

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

/**
 * 拿到书目
 * @param id
 * @returns
 */
export function queryBookById(id: number) {
  return axios.get(`/library/book?bookid=${id}`);
}

/**
 * 拿到某章内容
 * @param cid
 * @returns
 */
export function queryChapterById(cid: number) {
  return axios.get(`/library/book/chapter?chapterid=${cid}`);
}

/**
 * 创建一本书，新书入库
 * @param url 书目录地址
 * @returns
 */
export function addANewWebBook(url: string) {
  return axios.post(`/library/webbook`, url);
}

/**
 * 更新指定的章节
 * @param bookid 需要更新的书
 * @param chapterIds 要更新的章节Id
 * @returns
 */
export function updateChapter(bookid: number, chapterIds: number[]) {
  return axios.patch(`/library/webbook/updatechapter`, {
    bookId: bookid,
    chapterIds,
    isUpdate: false,
  });
}
