<template>
  <div class="container">
    <Breadcrumb :items="['menu.workplace', '统计']" />
    <div class="wrapper">
      <!-- 分析结果 -->
      <a-card title="统计结果" style="text-align: center;">
        <div v-if="loading" class="text-center py-10">
          <a-spin tip="正在计算中..." />
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

          <!-- 章节详细列表（Card 布局） -->
          <a-divider>章节详情</a-divider>
          <a-row :gutter="16" style="margin-top: 12px;">
            <a-col v-for="chapter in chapters" :key="chapter.chapterId" :xs="24" :sm="12" :md="8" :lg="6" :xl="6" :xxl="4">
              <a-card size="small" :class="['chapter-card', chapter.bgClass]" :title="chapter.chapterTitle">
                <div class="card-body">
                  <div class="card-row">
                    <div class="card-key">段落数</div>
                    <div class="card-value">{{ chapter.paragraphs }}</div>
                  </div>
                  <div class="card-row">
                    <div class="card-key">字数</div>
                    <div class="card-value">{{ chapter.words }}</div>
                  </div>
                  <div class="card-row">
                    <div class="card-key">阅读时间</div>
                    <div class="card-value">约{{ Math.ceil(Number(chapter.readingTime)) }}分钟</div>
                  </div>
                </div>
                <template #footer>
                  <a-button type="primary" size="small" @click="openChapterInNewTab(chapter.chapterId)">阅读</a-button>
                </template>
              </a-card>
            </a-col>
          </a-row>
        </template>
      </a-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
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
const { bookId } = useBookHelper();

const { loading, response: analyticsData } = useRequest<AnalyticsData>(queryBookAnalyticsText.bind(null, bookId));

// 在新标签页打开章节阅读页面
const openChapterInNewTab = (chapterId: number) => {
  const url = `/book/${bookId}/chapter/${chapterId}`;
  window.open(url, '_blank');
};

// 基于正态分布（均值与标准差）标注过短（红色）或过长（黄色）的章节
const Z_THRESHOLD = 1; // z <= -1 视为过短，z >= 1 视为过长，可按需调整

const chapters = computed(() => {
  const data = analyticsData.value as AnalyticsData | null;
  if (!data || !data.chapters || data.chapters.length === 0) return [] as (ChapterAnalytics & { bgClass?: string })[];

  const arr = data.chapters.map(c => ({ ...c }));
  const wordsArr = arr.map(c => Number(c.words) || 0);
  const n = wordsArr.length;
  if (n === 0) return arr;
  const mean = wordsArr.reduce((s, v) => s + v, 0) / n;// 平均长度
  const variance = wordsArr.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / n;// 平均平方差、总体方差
  const std = Math.sqrt(variance);// 标准差

  if (std === 0) {
    return arr.map(c => ({ ...c, bgClass: '' }));
  }

  return arr.map(c => {
    const w = Number(c.words) || 0;
    const z = (w - mean) / std; //当前字数对比平均值的差，与标准差比
    let bgClass = '';
    if (z <= -Z_THRESHOLD) bgClass = 'chapter-short';
    else if (z >= Z_THRESHOLD) bgClass = 'chapter-long';
    return { ...c, bgClass };
  });
});
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
.py-10 {
  padding: 40px 0;
}

.chapter-card {
  margin-bottom: 12px;
}

.card-body {
  padding: 8px 0;
}

.card-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.card-key {
  color: #888;
  font-size: 13px;
}

.card-value {
  font-weight: 500;
}

/* 过短（红色）与过长（黄色）章节标记 */
.chapter-short {
  background: #fff1f0 !important;
  border-color: #ffa39e !important;
}
.chapter-long {
  background: #fffbe6 !important;
  border-color: #ffe58f !important;
}
</style>