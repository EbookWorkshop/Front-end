<template>
  <div>
    <a-split
      :style="{
        height: '75vh',
        width: '100%',
        minWidth: '500px',
        marginTop: '40px',
        // border: '1px solid var(--color-border)'
      }"
      min="80px"
      size="0.618"
      disabled
    >
      <template #first>
        <a-card
          hoverable
          :style="{
            overflow: 'hidden',
            marginBottom: '20px',
            height: '65vh',
            marginRight: '40px',
          }"
        >
          <a-scrollbar style="height: 64vh; overflow: auto">
            <div ref="ContentDiv" style="min-height: 64vh; width: 100%">
              <!-- 预览正文的地方 -->
              <a-typography>
                <a-typography-paragraph style="white-space: pre-wrap">
                  {{ CurChapter }}
                </a-typography-paragraph>
              </a-typography>
            </div>
          </a-scrollbar>
        </a-card>
      </template>
      <template #second>
        <a-list
          :size="chapterList.length > 30 ? 'small' : 'large'"
          scrollbar
          :max-height="858"
        >
          <!-- TODO: 动态跟ContentDiv保持相同的高度 -->
          <a-list-item
            v-for="c in chapterList"
            :key="c.OrderNum"
            @click="CurChapter = c.Content ?? ''"
          >
            <a-list-item-meta :title="c.Title">
              <template #avatar>
                <a-avatar shape="circle">{{ c.OrderNum }}</a-avatar>
              </template>
            </a-list-item-meta>
            <template #actions>
              <icon-edit /><!-- TODO: 动态修改标题（改错字，删除广告等） -->
            </template>
          </a-list-item>
        </a-list>
      </template>
    </a-split>
  </div>
</template>

<script setup lang="ts">
  import { Chapter } from '@/api/book';
  import { reactive, ref } from 'vue';

  // 产出数据——章节列表
  const chapterList = reactive<Chapter[]>([]);
  const CurChapter = ref('');

  /**
   * 根据清除规则清理文章内容
   * @param content 文章原文
   * @param rule 清除规则
   */
  function cleanChapter(content: string, rule: string[] | undefined) {
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
  function initFileAsChapter(contents: any[], rule: string[] | undefined) {
    chapterList.length = 0;

    let i = 1;
    contents.forEach((file) => {
      chapterList.push({
        Title: file.name?.replace('.txt', ''),
        Content: cleanChapter(file.txt, rule),
        OrderNum: i++,
        IndexId: -1,
      });
    });
  }

  // 完成数据加载/初始化
  const initData = (data: any) => {
    if (data.setting.oneChapterAFile || data?.setting?.titleRule === '')
      // 设置为单文件一章 或 没设置拆分规则时
      return initFileAsChapter(data.contents, data?.setting?.removeRule);

    chapterList.length = 0;

    // 先合并成一个文本
    let content = '';
    data?.contents.forEach((c: any) => {
      content += c.txt;
    });

    // 删除内容
    content = cleanChapter(content, data?.setting?.removeRule);

    // 拆分章节
    const titleReg = new RegExp(data?.setting?.titleRule, 'g'); //  ((第\S+?回\s[^\n]+)|后记)\r?\n

    const matchs = Array.from(content.matchAll(titleReg) ?? []);

    let curEnd = content.length;
    for (let i = matchs.length - 1; i >= 0; i--) {
      const m = matchs[i];
      chapterList.unshift({
        Title: m[0].replace(/\r|\n/g, ''),
        Content: content.slice((m.index ?? 0) + m[0].length, curEnd),
        OrderNum: i + 1,
        IndexId: -1,
      });
      curEnd = m.index ?? 0;
    }

    // console.log(chapterList);
    CurChapter.value = chapterList[0]?.Content ?? '';

    return true;
  };

  defineExpose({
    initData,
    getData: () => {
      console.log(chapterList);
      return [...chapterList];
    },
  });
</script>
