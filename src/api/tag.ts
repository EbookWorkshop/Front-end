import axios from 'axios';

export interface Tag {
  id: number;
  Text: string;
  Color: string;
  Count: number;
}

/**
 * 拿到书的标签
 * @param id
 * @returns
 */
export function queryTagByBookId(id: number) {
  return axios.get(`/library/ebooktag?bookid=${id}`);
}

/**
 * 给指定书加入一个标签
 * @param bookid 要加标签的书Id
 * @param text 标签文本
 * @returns
 */
export function addTagForBook(bookid: number, text: string) {
  return axios.post(`/library/tag`, {
    bookId: bookid,
    tagText: text,
  });
}

/**
 * 删除书的标签
 * @param bookId 对应的书Id
 * @param tagId 要删除的标签Id
 */
export function removeTagForBook(bookId: number, tagId: number) {
  return axios.delete('/library/tagonbook', {
    params: { bookid: bookId, tagid: tagId },
  });
}

/**
 * 取得有书的标签
 */
export function getTagHasBook() {
  return axios.get('/library/tag/list?hasbook=1');
}

/**
 * 获取所有的标签
 * @returns
 */
export function getAllTag() {
  return axios.get('/library/tag/list');
}
/**
 * 删除标签
 * @param tagId
 * @returns
 */
export function deleteTag(tagId: number) {
  return axios.delete(`/library/tag?tagid=${tagId}`);
}
