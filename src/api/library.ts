import axios, { AxiosResponse } from 'axios';

import { HttpResponse } from '@/types/global';
import { Book } from '@/types/book';

export type ListQueryApi = (
  tagId: number | undefined
) => Promise<AxiosResponse<HttpResponse<Book[]>>>;

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

export function queryBookList(tagId?: number) {
  let param = {};
  if (tagId) param = { params: { tagid: tagId } };
  return axios.get('/library/booklist', param);
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

/**
 * 添加一本空书入书库
 * @param book
 * @returns
 */
export function addEmptyBook(book: {
  bookName: string;
  author: string;
  conver: string;
}) {
  return axios.post(`/library/emptybook`, book);
}
