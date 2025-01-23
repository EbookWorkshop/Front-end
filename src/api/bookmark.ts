import axios from 'axios';
import type { HttpResponse } from '@/types/global';

/**
 * 拿到书签列表
 * @param id 书的ID，为空则取所有书签
 * @returns
 */
export function queryBookmark(id?: number | undefined) {
  return axios.get(`/library/bookmark?bookid=${id}`);
}

/**
 * 给指定章节加入一个书签
 * @param chapterid 需要加书签的章节ID
 * @returns
 */
export function addBookmarkForChapter(chapterid: number) {
  return axios.post<HttpResponse<any>>(`/library/bookmark`, {
    chapterid,
  });
}
