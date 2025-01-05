import { Chapter } from '@/types/book';
/**
 * 本控件用的章节类型
 */
export interface IChapter {
  txt: string;
  name: string;
}

/**
 * 本控件用 步骤二的表单
 */
export interface IForm {
  encoderType: string;
  oneChapterAFile: boolean;
  removeRule: string[],
  titleRule: string,
}

/**
 * 本控件用 步骤的结果
 */
export interface IStepResult {
  contents: IChapter[];
  setting: IForm;
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
/**
 * 切割文章内容
 * @param content 文章合计
 * @param rule 章节标题规则
 */
export function cutContent(content: IChapter[], rule: string) {
  let result: Chapter[] = [];    //用于收集替换后的内容
  let combinedContent = content.map(c => c.txt).join('\n');

  const titleReg = new RegExp(rule, 'g'); //  ((第\S+?回\s[^\n]+)|后记)\r?\n
  const matchs = Array.from(combinedContent.matchAll(titleReg) ?? []);

  let curEnd = combinedContent.length;//裁剪的结束位置
  for (let i = matchs.length - 1; i >= 0; i--) {  //从尾部开始逐章取出
    const m = matchs[i];
    const matchText = m[1];//第一个括号提取的内容
    result.unshift({    //倒叙切的章节，按栈顶插入
      Title: matchText.replace(/\r|\n/g, ''),
      Content: combinedContent.slice((m.index ?? 0) + m[0].length, curEnd),//全部匹配内容都为标题部分，舍去
      OrderNum: i + 1,
      IndexId: -1,
    });
    curEnd = m.index ?? 0;
  }

  return result;
}

