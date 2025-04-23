import axios from 'axios';
import type { Chapter, ChapterOrderSetting } from '@/types/book';
import { HttpResponse } from '@/types/global';

/**
 * 拿到书 目录
 * @param id
 * @returns
 */
export function queryBookById(id: number) {
  return axios.get(`/library/book?bookid=${id}`);
}

export function queryWebBookById(id: number) {
  return axios.get(`/library/webbook?bookid=${id}`);
}



/**
 * 拿到书的信息
 * @param id
 * @returns
 */
export function queryBookInfo(id: number) {
  return axios.get(`/library/book/metadata?bookid=${id}`);
}
export function patchBookInfo(metadata: any) {
  return axios.patch(`/library/book/metadata`, metadata, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}



/**
 * 拿到书的来源地址
 * @param id
 * @returns
 */
export function queryBookSourcesById(id: number) {
  return axios.get(`/library/webbook/sources?bookid=${id}`);
}
export function queryBookDefaultSourcesById(id: number) {
  return axios.get(`/library/webbook/defsources?bookid=${id}`);
}

/**
 * 拿到章节的来源地址
 * @param id 章节ID
 * @returns
 */
export function queryWebBookChapterSourcesById(id: number) {
  return axios.get(`/library/webbook/chapter/sources?chapterid=${id}`);
}
export function updateWebBookChapterSourcesById(setting: any) {
  return axios.post(`/library/webbook/chapter/sources`, setting);
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
  return axios.post('/library/book/chapter', chapter);
}

/**
 * 删除章节
 * @param chapterid 
 * @returns 
 */
export function deleteChapter(chapterid: number) {
  return axios.delete(`/library/book/chapter`, {
    params: { chapterid }
  })
}

/**
 * 修改章节信息
 * @param chapter 章节
 * @returns
 */
export function updateChapterOrder(chapterOrderList: Array<ChapterOrderSetting>) {
  return axios.patch('/library/book/chapterOrder', chapterOrderList);
}

/**
 * 修改章节信息
 * @param setting 章节
 * @returns
 */
export function restructureChapter(setting: any) {
  return axios.patch('/library/book/chapters/restructure', setting);
}

/**
 * 将指定章节设为书籍简介
 * @param chapterId - 需要转换的章节ID
 * @returns 包含操作结果的Promise
 */
export function chapter2Introduction(chapterId: number) {
  return axios.post<HttpResponse<boolean>>('/library/book/chapter/tointroduction', { chapterId });
}

/**
 * 隐藏/取消隐藏章节
 * @param chapterid 章节id
 * @param ishide 是否隐藏
 * @returns
 */
export function updateChapterVisibility(chapterid: number, ishide: boolean) {
  return axios.patch<HttpResponse<boolean>>('/library/book/chapter/toggleHide', { chapterId: chapterid, ishide });
}
/**
 * 列出已隐藏的章节
 * @param bookid 书ID
 * @returns 
 */
export function listHiddenChapters(bookid: number) {
  return axios.get<HttpResponse<any[]>>(`/library/book/chapter/listhidden?bookid=${bookid}`);
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
 * 找到重复的章节
 * @param bookId 书ID
 * @returns 
 */
export function queryDuplicatesChapter(bookId: number) {
  return axios.get(`/library/book/duplicates?bookid=${bookId}`);
}

/**
 * 创建一本书，新书入库
 * @param url 书目录地址
 * @returns
 */
export function addANewWebBook(url: string) {
  return axios.post<HttpResponse<string>>(`/library/webbook`, url, {
    headers: { 'Content-Type': 'text/plan' },
  });
}

/**
 * 合并方式更新当前书目录
 * @param id 书ID
 * @returns
 */
export function mergeWebBookIndex(id: number | Number) {
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
 * 制作pdf——可发到默认邮箱
 * @param bookid
 * @param chapterIds
 * @param isSendEmail 是否发到默认邮箱
 * @param fontFamily 创建PDF时的字体
 * @returns
 */
export function createPDF(
  bookid: number,
  chapterIds: number[],
  isSendEmail: boolean,
  fontFamily: string,
  embedTitle: boolean
) {
  return axios.post(`/export/pdf`, {
    bookId: bookid,
    chapterIds,
    sendByEmail: isSendEmail,
    fontFamily,
    embedTitle
  });
}

/**
 * 制作txt——可发到默认邮箱
 * @param bookid 
 * @param chapterIds 
 * @param isSendEmail 
 * @param fontFamily 没用，对齐API用
 * @param embedTitle 是否嵌入章节标题
 * @returns 
 */
export function createTXT(
  bookid: number,
  chapterIds: number[],
  isSendEmail: boolean,
  fontFamily: string,
  embedTitle: boolean
) {
  return axios.post(`/export/txt`, {
    bookId: bookid,
    chapterIds,
    sendByEmail: isSendEmail,
    embedTitle,
  });
}

/**
 * 制作epub——可发到默认邮箱
 * @param bookid 
 * @param chapterIds 
 * @param isSendEmail 
 * @param fontFamily 没用，对齐API用
 * @param embedTitle 是否嵌入章节标题
 * @returns 
 */
export function createEPUB(
  bookid: number,
  chapterIds: number[],
  isSendEmail: boolean,
  fontFamily: string,
  embedTitle: boolean
) {
  return axios.post(`/export/epub`, {
    bookId: bookid,
    chapterIds,
    sendByEmail: isSendEmail,
    fontFamily,
    embedTitle,
  });
}
