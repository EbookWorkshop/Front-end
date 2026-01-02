<template>
  <div class="container">
    <Breadcrumb :items="['menu.workplace', '统计']" />
    <div class="wrapper">
      <!-- 分析结果 -->
      <a-card title="统计结果" style="text-align: center;">
        <div v-if="loading" class="text-center py-10">
          <a-spin tip="正在查询中..." />
        </div>

        <div v-else-if="error" class="text-center py-10">
          <a-alert type="error" show-icon>{{ error }}</a-alert>
        </div>

        <div v-else-if="!analyticsData" class="text-center py-10">
          <a-empty description="没有符合情况的数据" />
        </div>

        <template v-else>
          <!-- 总体统计信息 -->
          <a-descriptions :column="2" class="mb-6">
            <a-descriptions-item label="总章节数">{{ analyticsData.totalChapters }}</a-descriptions-item>
            <a-descriptions-item label="空章节数">{{ analyticsData.emptyChapters }}</a-descriptions-item>
            <a-descriptions-item label="总字数">{{ analyticsData.totalWords }}</a-descriptions-item>
            <a-descriptions-item label="总段落数">{{ analyticsData.totalParagraphs }}</a-descriptions-item>
            <a-descriptions-item label="预计阅读时间">约{{ Math.ceil(Number(analyticsData.readingTime))
            }}分钟</a-descriptions-item>
            <a-descriptions-item label="阅读速度">约{{ analyticsData.wpm }}字/分钟</a-descriptions-item>
            <a-descriptions-item label="平均每章字数">{{ analyticsData.avgWordsPerChapter }}</a-descriptions-item>
            <a-descriptions-item label="平均每章段落数">{{ analyticsData.avgParagraphsPerChapter }}</a-descriptions-item>
          </a-descriptions>

          <!-- 章节详细列表 -->
          <a-divider>章节详情</a-divider>
          <a-table :data="analyticsData.chapters" row-key="chapterId" :pagination="false" style="text-align: left;">
            <template #columns>
              <a-table-column title="章节标题" data-index="chapterTitle">
                <template #cell="{ record }">
                  <div class="chapter-title">
                    {{ record.chapterTitle }}
                  </div>
                </template>
              </a-table-column>
              <a-table-column title="段落数" data-index="paragraphs" width="100" />
              <a-table-column title="字数" data-index="words" width="100" />
              <a-table-column title="阅读时间" data-index="readingTime" width="150">
                <template #cell="{ record }">
                  约{{ Math.ceil(Number(record.readingTime)) }}分钟
                </template>
              </a-table-column>
              <a-table-column title="操作" width="100">
                <template #cell="{ record }">
                  <a-button type="primary" size="small" @click="openChapterInNewTab(record.chapterId)">
                    阅读
                  </a-button>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </template>
      </a-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { queryBookAnalyticsText } from "@/api/workplace";
import useBookHelper from '@/hooks/book-helper';
import useRequest from '@/hooks/request';

// 定义数据结构类型
interface AnalyticsData {
  totalChapters: number;
  emptyChapters: number;
  totalWords: number;
  totalParagraphs: number;
  readingTime: string;
  wpm: number;
  avgWordsPerChapter: string;
  avgParagraphsPerChapter: string;
  chapters: ChapterAnalytics[];
}

interface ChapterAnalytics {
  chapterId: number;
  chapterTitle: string;
  paragraphs: number;
  words: number;
  readingTime: string;
}

// 响应式数据
const error = ref('');
const { bookId } = useBookHelper();

const { loading, response: analyticsData } = useRequest<AnalyticsData>(queryBookAnalyticsText.bind(null, bookId));

// 在新标签页打开章节阅读页面
const openChapterInNewTab = (chapterId: number) => {
  const url = `/book/${bookId}/chapter/${chapterId}`;
  window.open(url, '_blank');
};
</script>

<style scoped>
.container {
  padding: 20px;
}

.wrapper {
  margin: 0 auto;
}

.mb-4 {
  margin-bottom: 16px;
}

.mb-6 {
  margin-bottom: 24px;
}

.text-lg {
  font-size: 18px;
}

.font-medium {
  font-weight: 500;
}

.text-sm {
  font-size: 14px;
}

.text-gray-600 {
  color: #666;
}

.text-gray-50 {
  background-color: #f9f9f9;
}

.py-10 {
  padding: 40px 0;
}

.px-1 {
  padding: 0 4px;
}

.p-2 {
  padding: 8px;
}

.rounded {
  border-radius: 4px;
}

.flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}

.items-center {
  align-items: center;
}

.chapter-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
}
</style>