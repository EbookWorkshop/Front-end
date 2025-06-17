import axios, { AxiosResponse } from 'axios';

import { HttpResponse } from '@/types/global';
import { Book } from '@/types/book';

export type ListQueryApi = (
  tagId: number | undefined,
  notTag?: number[] | undefined
) => Promise<AxiosResponse<HttpResponse<Book[]>>>;

export function queryBookList(tagId?: number, notTag?: number[]) {
  let param = {};
  if (tagId) param = { params: { tagid: tagId } };
  if (notTag) param = { params: { nottag: notTag.join(',') } }
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
 * 搜索书库
 * @param setting 
 * @returns 
 */
export function searchBook(setting: any) {
  return axios.post(`/library/book/search`, setting);
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

/**
 * 删除一本书
 * @param bookId 书本id
 * @returns 
 */
export function deleteABook(bookId: number) {
  return axios.delete(`/library/book?bookid=${bookId}`)
}

/**
 * 为某书提升一点热度
 * @param bookId 书本id
 * @returns 
 */
export function HeatABook(bookId: number) {
  return axios.post(`/library/book/heat`, { bookId: bookId });
}