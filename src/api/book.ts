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
