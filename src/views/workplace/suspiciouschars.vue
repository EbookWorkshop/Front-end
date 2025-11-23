<template>
  <div class="container">
    <Breadcrumb :items="['menu.workplace', 'menu.workplace.suspiciouschars']" />
    <div class="wrapper">
      <!-- 查询条件 -->
      <a-card v-if="!route.query.bookId" class="mb-4">
        <a-form :model="form" layout="inline">
          <a-form-item field="bookId" label="书籍ID">
            <a-input v-model="form.bookId" placeholder="请输入书籍ID" />
          </a-form-item>
          <a-form-item field="chapterIds" label="章节ID">
            <a-input v-model="form.chapterIds" placeholder="多个章节ID用逗号分隔" />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="querySuspiciousChars" :loading="loading">
              查询可疑字符
            </a-button>
          </a-form-item>
        </a-form>
      </a-card>

      <!-- 分析结果 -->
      <a-card :title="`分析结果${allResultCount ? `，已检测${allResultCount}章` : ''}`" v-if="showResult"
        style="text-align: center;">
        <div v-if="loading" class="text-center py-10">
          <a-spin tip="正在查询中..." />
        </div>

        <div v-else-if="error" class="text-center py-10">
          <a-alert type="error" show-icon>{{ error }}</a-alert>
        </div>

        <div v-else-if="resultList.length === 0" class="text-center py-10">
          <a-empty description="没有符合情况的数据" />
        </div>

        <template v-else>
          <div v-for="chapter in resultList" :key="chapter.id" class="mb-6" style="text-align: left;">
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-lg font-medium">{{ chapter.title }}</h3>
              <a-button type="primary" size="small" @click="openChapterInNewTab(chapter.id)">
                阅读
              </a-button>
            </div>
            <a-table :data="chapter.suspiciousChars" row-key="index" :pagination="false" size="small">
              <template #columns>
                <a-table-column title="字符" data-index="character">
                  <template #cell="{ record }">
                    <a-tag :color="getSuspicionColor(record.suspicionLevel)">
                      {{ record.character }}
                    </a-tag>
                  </template>
                </a-table-column>
                <a-table-column title="Unicode" data-index="codePoint"></a-table-column>
                <a-table-column title="可疑等级" data-index="suspicionLevel">
                  <template #cell="{ record }">
                    <span style="color:yellow">{{ "★".repeat(record.suspicionLevel) }}</span>{{ "☆".repeat(5 -
                      record.suspicionLevel) }}
                  </template>
                </a-table-column>
                <a-table-column title="出现次数" data-index="frequency"></a-table-column>
                <a-table-column title="可疑原因" data-index="reasons">
                  <template #cell="{ record }">
                    <div v-for="(reason, index) in record.reasons" :key="index" class="text-sm text-gray-600">
                      {{ reason }}
                    </div>
                  </template>
                </a-table-column>
                <a-table-column title="上下文" data-index="context">
                  <template #cell="{ record }">
                    <div class="text-sm color-bg-3 p-2 rounded">
                      <span v-html="highlightContext(record)"></span>
                    </div>
                  </template>
                </a-table-column>
              </template>
            </a-table>
          </div>
        </template>
      </a-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { querySuspiciousChars as fetchSuspiciousChars } from '@/api/workplace';

// 定义数据结构类型
interface SuspiciousChar {
  index: number;
  character: string;
  codePoint: string;
  unicodeBlock: string;
  suspicionLevel: 1 | 2 | 3 | 4 | 5;
  frequency: number;
  frequencyPercent: string;
  reasons: string[];
  context: string[];
}

interface ChapterData {
  id: number;
  title: string;
  suspiciousChars: SuspiciousChar[];
}

// 响应式数据
const form = ref({
  bookId: '',
  chapterIds: ''
});
const loading = ref(false);
const error = ref('');
const resultList = ref<ChapterData[]>([]);
const allResultCount = ref(0);
const showResult = ref(false);
const route = useRoute();

// 初始化页面
onMounted(() => {
  // 从URL获取参数
  const bookId = route.query.bookId as string;
  const chapterIds = route.query.chapterIds as string;

  if (bookId) {
    form.value.bookId = bookId;
    if (chapterIds) {
      form.value.chapterIds = decodeURIComponent(chapterIds);
    }
    // 自动查询
    querySuspiciousChars();
  }
});

// 查询可疑字符
const querySuspiciousChars = async () => {
  if (!form.value.bookId) {
    error.value = '请输入书籍ID';
    return;
  }

  loading.value = true;
  error.value = '';
  showResult.value = true;

  try {
    // 解析章节ID
    let chapterIdArray: number[] = [];
    if (form.value.chapterIds) {
      chapterIdArray = form.value.chapterIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    }

    const response = await fetchSuspiciousChars(
      parseInt(form.value.bookId),
      chapterIdArray
    );

    if (response.code === 20000) {
      allResultCount.value = response.data.length;
      resultList.value = response.data.filter(chapter => chapter.suspiciousChars.length > 0);
    } else {
      error.value = response.msg || '查询失败';
    }
  } catch (err: any) {
    error.value = err.message || '查询出错';
  } finally {
    loading.value = false;
  }
};

// 在新标签页打开章节阅读页面
const openChapterInNewTab = (chapterId: number) => {
  const bookId = parseInt(form.value.bookId);
  const url = `/book/${bookId}/chapter/${chapterId}`;
  window.open(url, '_blank');
};

// 获取可疑等级的颜色
const getSuspicionColor = (level: number): string => {
  switch (level) {
    case 1:
      return 'green';      // 低风险 - 绿色
    case 2:
      return 'lime';       // 较低风险 - 浅绿色
    case 3:
      return 'gold';     // 中等风险 - 黄色
    case 4:
      return 'orange';     // 高风险 - 橙色
    case 5:
      return 'red';        // 极高风险 - 红色
    default:
      return 'default';    // 默认颜色
  }
};

// 高亮上下文中的可疑字符
const highlightContext = (record: SuspiciousChar): string => {
  if (!record.context || !record.character) return '';

  // 转义特殊字符
  const escapedChar = record.character.replace(/[.*+?^${}()|\[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedChar})`, 'g');

  // 处理字符串数组格式的 context
  return record.context
    .map(text => text.replace(regex, '<span class="font-bold bg-red-50 px-1 rounded" style="color: red;">$1</span>'))
    .join('<hr style="border:0.1px dotted rgba(0, 0, 0, 0.15);">');

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
</style>