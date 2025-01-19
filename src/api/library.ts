import axios, { AxiosResponse } from 'axios';

import { HttpResponse } from '@/types/global';
import { Book } from '@/types/book';

export type ListQueryApi = (
  tagId: number | undefined
) => Promise<AxiosResponse<HttpResponse<Book[]>>>;

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

export function queryBookList(tagId: number | undefined) {
  return axios.get('/library/booklist', {
    params: { tagid: tagId },
  });
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
