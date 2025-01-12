import axios from 'axios';
import { Chapter } from "@/types/book";



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
 * 拿到书的来源地址
 * @param id
 * @returns
 */
export function queryBookSourcesById(id: number) {
  return axios.get(`/library/webbook/sources?bookid=${id}`);
}
/**
 * 拿到章节的来源地址
 * @param id 章节ID
 * @returns 
 */
export function queryWebBookChapterSourcesById(id: number) {
  return axios.get(`/library/webbook/chapter/sources?chapterid=${id}`);
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
 * 修改章节信息
 * @param chapter 章节
 * @returns 
 */
export function editChapter(chapter: Chapter) {
  return axios.post("/library/book/chapter", chapter);
}

/**
 * 找到相邻的章节
 * @param cid 当前章节ID
 * @returns
 */
export function queryAdjacentChapterInfo(cid: number) {
  return axios.get(`/library/book/adjacentchapter?chapterid=${cid}`);
}

/**
 * 创建一本书，新书入库
 * @param url 书目录地址
 * @returns
 */
export function addANewWebBook(url: string) {
  return axios.post(`/library/webbook`, url, {
    headers: { 'Content-Type': 'text/plan' },
  });
}

/**
 * 合并方式更新当前书目录
 * @param id 书ID
 * @returns
 */
export function mergeWebBookIndex(id: number) {
  return axios.patch(`/library/webbook/mergeindex`, { bookId: id });
}

/**
 * 更新指定的章节
 * @param bookid 需要更新的书
 * @param chapterIds 要更新的章节Id
 * @param isUpdate 强制更新
 * @returns
 */
export function updateChapter(
  bookid: number,
  chapterIds: number[],
  isUpdate = false
) {
  return axios.patch(`/library/webbook/updatechapter`, {
    bookId: bookid,
    chapterIds,
    isUpdate,
  });
}

/**
 * 制作pdf——并且发到默认邮箱
 * @param bookid
 * @param chapterIds
 * @returns
 */
export function createPDF(
  bookid: number,
  chapterIds: number[],
  isSendEmail: boolean
) {
  return axios.post(`/library/pdf`, {
    bookId: bookid,
    chapterIds,
    sendByEmail: isSendEmail,
  });
}
