/**
 * 本控件用的章节类型
 */
export interface IChapter {
  txt: string;
  name: string;
}

/**
 * 清理文章内容
 * @param content 章节
 * @param rule 清扫规则
 */
export function cleanContent(content: IChapter[], rule: string[]) {
  let litters: any = [];   //用于收集替换删除的内容
  let result: IChapter[] = [];    //用于收集替换后的内容
  content.forEach((c) => { result.push({ txt: c.txt, name: c.name }) });
  rule.forEach((r) => {
    const reg = new RegExp(r, 'g');
    result.forEach((c) => {
      let reg = new RegExp(r, 'g');
      litters[r] = [];
      let newTxt = c.txt.replace(reg, function (target, index, content) {
        litters[r].push(target);
        return "";
      });
      c.txt = newTxt;
    });
  });

  return { result, litters };
}

export function cutContent(content: IChapter[], rule: string[]) {
}

/**
 * 根据清除规则清理文章内容
 * @param content 文章原文
 * @param rule 清除规则
 */
export function cleanChapter(content: string, rule: string[] | undefined) {
  if (rule?.length === 0) return content;
  let tempContent = content;
  rule?.forEach((r) => {
    const reg = new RegExp(r, 'g');
    tempContent = tempContent.replace(reg, '');
  });
  return tempContent;
}


/**
* 一个文件一章的初始化
* @param contents 文章列表
* @param rule 清理内容用的规则
*/
export function initFileAsChapter(contents: any[], rule: string[] | undefined) {
  let chapterList = [] as Array<any>;

  let i = 1;
  contents.forEach((file) => {
    chapterList.push({
      Title: file.name?.replace('.txt', ''),
      Content: cleanChapter(file.txt, rule),
      OrderNum: i++,
      IndexId: -1,
    });
  });

  return chapterList;
}