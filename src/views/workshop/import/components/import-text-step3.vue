<template>
  <div>
    <a-split :style="{
      height: '75vh',
      width: '100%',
      minWidth: '500px',
      marginTop: '40px',
      // border: '1px solid var(--color-border)'
    }" min="80px" size="0.618" disabled>
      <template #first>
        <a-card hoverable :style="{
          overflow: 'hidden',
          marginBottom: '20px',
          height: '65vh',
          marginRight: '40px',
        }">
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
        <a-list :size="chapterList.length > 30 ? 'small' : 'large'" scrollbar :max-height="858">
          <!-- TODO: 动态跟ContentDiv保持相同的高度 -->
          <a-list-item v-for="c in chapterList" :key="c.OrderNum" @click="CurChapter = c.Content ?? ''">
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
import { Chapter } from '@/types/book';
import { reactive, ref } from 'vue';

import { IChapter, IStepResult, cleanContent, cutContent } from "./utils"

// 产出数据——章节列表
const chapterList = reactive<Chapter[]>([]);
const CurChapter = ref('');//预览窗口显示的文章

// 完成数据加载/初始化
const initData = (data: IStepResult) => {
  console.log(data);
  // 初始化
  chapterList.length = 0;
  CurChapter.value = '';

  // if (data?.setting?.oneChapterAFile || data?.setting?.titleRule === '')
  //   // 设置为单文件一章 或 没设置拆分规则时
  //   return initFileAsChapter(data.contents, data?.setting?.removeRule);

  let cleanResult = cleanContent(data.contents, data.setting?.removeRule);
  if (data?.setting?.oneChapterAFile || data?.setting?.titleRule === '') {
    cleanResult.result.forEach((c, i) => {
      chapterList.push({
        OrderNum: i + 1,
        Title: c.name,
        Content: c.txt,
        IndexId: -1,
      });
    });
  } else {
    let cutResult = cutContent(cleanResult.result, data.setting?.titleRule);
    chapterList.push(...cutResult);
  }

  //绑定到表单上
  CurChapter.value = chapterList[0]?.Content ?? '';
};


defineExpose({
  initData,
  getData: () => {
    console.log(chapterList);
    return [...chapterList];
  },
});
</script>
