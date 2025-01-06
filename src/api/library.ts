import axios from 'axios';
import { AxiosResponse } from 'axios';
import { HttpResponse } from '@/api/interceptor';

// import qs from 'query-string';
// import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';

export interface Book {
  BookId: number;
  BookName: string;
  CoverImg: string;
}

export type ListQueryApi = () => Promise<AxiosResponse<HttpResponse<Book[]>>>;

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

export function queryBookList() {
  return axios.get('/library/booklist');
}

export function queryWebBookList() {
  return axios.get('/library/webbook/list');
}

/**
 * 添加一本书入书库
 * @param book
 * @returns
 */
export function addABook(book: any) {
  return axios.post(`/library/book`, book);
}
