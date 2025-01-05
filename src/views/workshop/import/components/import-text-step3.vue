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
            <a-list-item-meta>
              <template #title>
                <a-input v-if="c.isEditing" :default-value="c.Title" @blur="c.isEditing = false"
                  @change="c.Title = $event as string" />
                <span v-else @click="c.isEditing = true">{{ c.Title }}</span>
              </template>
              <template #avatar>
                <a-avatar shape="circle">{{ c.OrderNum }}</a-avatar>
              </template>
            </a-list-item-meta>
            <template #actions>
              <icon-edit @click="c.isEditing = !c.isEditing" />
              <icon-delete @click="chapterList.splice(chapterList.indexOf(c), 1)" />
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
import { IStepResult, cleanContent, cutContent } from "./utils"

interface ChapterOnBar extends Chapter {
  //是否在控件编辑中
  isEditing: boolean;
}


// 产出数据——章节列表
const chapterList = reactive<ChapterOnBar[]>([]);
const CurChapter = ref('');//预览窗口显示的文章

// 完成数据加载/初始化
const initData = (data: IStepResult) => {
  // 初始化
  chapterList.length = 0;
  CurChapter.value = '';

  // if (data?.setting?.oneChapterAFile || data?.setting?.titleRule === '')
  //   // 设置为单文件一章 或 没设置拆分规则时
  //   return initFileAsChapter(data.contents, data?.setting?.removeRule);

  let cleanResult = cleanContent(data.contents, data.setting?.removeRule);
  if (data?.setting?.oneChapterAFile || data?.setting?.titleRule === '') {
    cleanResult.result.forEach((c, i) => {
      let curTitle = c.name;
      if (data?.setting?.titleRule !== '') {
        let rule = new RegExp(data?.setting?.titleRule);
        let match = c.txt.match(rule);
        if (match) curTitle = match[1];
      }
      chapterList.push({
        OrderNum: i + 1,
        Title: curTitle,
        Content: c.txt,
        IndexId: -1,
        isEditing: false,
      });
    });
  } else {
    let cutResult = cutContent(cleanResult.result, data.setting?.titleRule);
    chapterList.push(...cutResult as ChapterOnBar[]);
  }

  //绑定到表单上
  CurChapter.value = chapterList[0]?.Content ?? '';
};


defineExpose({
  initData,
  getData: () => {
    return [...chapterList];
  },
});
</script>
