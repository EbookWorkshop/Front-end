import axios from 'axios';
// import qs from 'query-string';
// import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';

export interface Book {
  BookId: number;
  BookName: string;
  CoverImg: string;
}

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

export function queryBookList() {
  return axios.get('/library/booklist');
}

/**
 * 添加一本书入书库
 * @param book
 * @returns
 */
export function addABook(book: any) {
  return axios.post(`/library/book`, book);
}
