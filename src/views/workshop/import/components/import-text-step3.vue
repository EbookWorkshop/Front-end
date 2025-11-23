<template>
  <div>
    <a-split :style="{
      height: '75vh',
      width: '100%',
      minWidth: '500px',
      marginTop: '40px',
      // border: '1px solid var(--color-border)'
    }" min="80px" size="0.618" max="Infinity" disabled>
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
        <a-space>
          <a-button @click="setTitleVisible = true">重编标题</a-button>
          <a-button @click="showChapterStats">信息统计</a-button>
        </a-space>
        <a-list :size="chapterList.length > 30 ? 'small' : 'large'" scrollbar :virtualListProps="{ height: 858 }"
          :data="chapterList">
          <!-- TODO: 动态跟ContentDiv保持相同的高度 -->
          <template #item="{ item, index }">
            <a-list-item :key="index" @click="CurChapter = item.Content ?? ''">
              <a-list-item-meta>
                <template #title>
                  <a-input v-if="item.isEditing" :default-value="item.Title" @blur="item.isEditing = false"
                    @change="item.Title = $event as string" />
                  <span v-else @click="item.isEditing = true">{{ item.Title }}</span>
                </template>
                <template #avatar>
                  <a-avatar shape="circle">{{ item.OrderNum }}</a-avatar>
                </template>
              </a-list-item-meta>
              <template #actions>
                <icon-edit @click="item.isEditing = !item.isEditing" />
                <icon-delete @click="chapterList.splice(chapterList.indexOf(item), 1)" />
              </template>
            </a-list-item>
          </template>
        </a-list>
      </template>
    </a-split>

    <a-modal v-model:visible="setTitleVisible" title="格式化标题设置" draggable unmount-on-close>
      <a-form :model="form" ref="formRef">
        <a-form-item field="keepOldTitle" label="保留原标题">
          <a-switch v-model="form.keepOldTitle" />
        </a-form-item>
        <a-form-item field="format" label="标题格式" tooltip="使用 {n} 代表章节序号，{title} 代表章节原标题" required>
          <a-input v-model="form.format" type="text" placeholder="例如：第 {n} 章. {title}" />
        </a-form-item>
        <a-form-item field="numberType" label="章节序号类型" required>
          <a-select v-model="form.numberType" placeholder="请选择章节序号类型">
            <a-option value="1">数字：1、2、3、4、5、6、7、8、9、10</a-option>
            <a-option value="2">汉字：一、二、三、四、五、六、七、八、九、十</a-option>
            <a-option value="3" disabled>繁体：壹、贰、叁、肆、伍、陆、柒、捌、玖、拾</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="排除章节" field="exclude">
          <a-select v-model="form.exclude" placeholder="请选择要排除的章节" multiple allow-search>
            <a-option v-for="item in chapterList" :key="item.Title" :value="item.Title">{{ item.Title }}</a-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" status="success" @click="applyTitleFormat">应用格式化标题</a-button>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 章节统计模态框 -->
    <a-modal v-model:visible="statsVisible" title="章节统计信息" draggable unmount-on-close width="600px">
      <div style="font-size: 14px; line-height: 1.8;">
        <h3 style="margin-bottom: 10px; color: var(--color-text-primary);">整体统计</h3>
        <div
          style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid var(--color-border);display: flex; justify-content: space-between;">
          <div style="flex-grow: 2;">
            <div class="stats-row">
              <span class="stats-label">总章节数：</span>
              <span class="stats-value">{{ chapterStats.totalChapters }}</span>
            </div>
            <div class="stats-row">
              <span class="stats-label">总字数：</span>
              <span class="stats-value">{{ chapterStats.totalCharacters }}</span>
            </div>
            <div class="stats-row">
              <span class="stats-label">总段落数：</span>
              <span class="stats-value">{{ chapterStats.totalParagraphs }}</span>
            </div>
          </div>
          <div style="flex-grow: 1;">
          </div>
          <div style="flex-grow: 2;">
            <div class="stats-row">
              <span class="stats-label">平均每章字数：</span>
              <span class="stats-value">{{ chapterStats.avgCharactersPerChapter }}</span>
            </div>
            <div class="stats-row">
              <span class="stats-label">最长章节：</span>
              <span class="stats-value">{{ chapterStats.longestChapter.title || '-' }} ({{
                chapterStats.longestChapter.characters }}字)</span>
            </div>
            <div class="stats-row">
              <span class="stats-label">最短章节：</span>
              <span class="stats-value">{{ chapterStats.shortestChapter.title || '-' }} ({{
                chapterStats.shortestChapter.characters }}字)</span>
            </div>
          </div>
        </div>

        <div>
          <h3 style="margin-bottom: 10px; color: var(--color-text-primary);">章节详情</h3>
          <a-scrollbar style="max-height: 400px; overflow: auto;">
            <div class=""></div>
            <div v-for="(stats, index) in chapterStats.chapterDetails" :key="index" class="chapter-detail-item"
              :class="isTopFifth(sortedChapterDetails.indexOf(stats)) ? 'chapter-warning' : isBottomFifth(sortedChapterDetails.indexOf(stats)) ? 'chapter-danger' : ''">
              <div class="chapter-title">{{ chapterList[stats.originalIndex].Title }}</div>
              <div class="chapter-stats">
                <span>字数：{{ stats.characters }} <icon-drag-dot-vertical /> </span>
                <span>字数排序：{{ sortedChapterDetails.indexOf(stats) + 1 }} <icon-drag-dot-vertical /> </span>
                <span>段落数：{{ stats.paragraphs }} </span>
              </div>
            </div>
          </a-scrollbar>
        </div>
      </div>
      <template #footer>
        <a-button @click="statsVisible = false">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { Chapter } from '@/types/book';
import { reactive, ref, computed } from 'vue';
import { IStepResult, cleanContent, cutContent } from "./utils"
import { numberToChinese } from "@/utils/units";
import type { FormInstance } from '@arco-design/web-vue';

// 标题设置模态框控制
const setTitleVisible = ref(false);
const formRef = ref<FormInstance>();

// 统计模态框控制
const statsVisible = ref(false);

// 表单数据
const form = reactive({
  keepOldTitle: false,
  format: '',
  numberType: '1',
  exclude: [] as string[],
});

// 章节统计数据
const chapterStats = reactive({
  totalChapters: 0,
  totalCharacters: 0,
  totalParagraphs: 0,
  avgCharactersPerChapter: 0,
  longestChapter: {
    title: '',
    characters: 0,
    index: -1
  },
  shortestChapter: {
    title: '',
    characters: 0,
    index: -1
  },
  chapterDetails: [] as Array<{
    characters: number;
    paragraphs: number;
    originalIndex: number; // 添加原始索引以保持与chapterList的关联
  }>
});

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

  let cleanResult = cleanContent(data.contents, data.setting?.removeRule);
  if (data?.setting?.oneChapterAFile || data?.setting?.titleRule === '') {
    cleanResult.result.forEach((c, i) => {
      let curTitle = c.name.replace(".txt", "");
      if (data?.setting?.titleRule !== '') {
        let rule = new RegExp(data?.setting?.titleRule, "gm");
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

// 计算章节统计信息
const calculateChapterStats = () => {
  // 重置统计数据
  chapterStats.totalChapters = chapterList.length;
  chapterStats.totalCharacters = 0;
  chapterStats.totalParagraphs = 0;
  chapterStats.chapterDetails = [];
  chapterStats.longestChapter = { title: '', characters: 0, index: -1 };
  chapterStats.shortestChapter = { title: '', characters: Number.MAX_SAFE_INTEGER, index: -1 };

  // 遍历所有章节计算统计信息
  chapterList.forEach((chapter, index) => {
    const content = chapter.Content || '';

    // 统计字数（去除空白字符）
    const characters = content.replace(/\s/g, '').length;

    // 统计段落数（以换行符分隔，过滤空段落）
    const paragraphs = content.split(/[\r\n]+/).filter(p => p.trim().length > 5).length;//段落数至少为5个字符

    // 累加总字数和总段落数
    chapterStats.totalCharacters += characters;
    chapterStats.totalParagraphs += paragraphs;

    // 保存各章节详情，包括原始索引
    chapterStats.chapterDetails.push({
      characters,
      paragraphs,
      originalIndex: index
    });

    // 更新最长章节信息
    if (characters > chapterStats.longestChapter.characters) {
      chapterStats.longestChapter = {
        title: chapter.Title,
        characters,
        index
      };
    }

    // 更新最短章节信息
    if (characters < chapterStats.shortestChapter.characters) {
      chapterStats.shortestChapter = {
        title: chapter.Title,
        characters,
        index
      };
    }
  });

  // 计算平均每章字数
  chapterStats.avgCharactersPerChapter = chapterStats.totalChapters > 0
    ? Math.round(chapterStats.totalCharacters / chapterStats.totalChapters)
    : 0;

  // 处理没有内容的特殊情况
  if (chapterStats.shortestChapter.characters === Number.MAX_SAFE_INTEGER) {
    chapterStats.shortestChapter = { title: '', characters: 0, index: -1 };
  }
};

// 计算属性：按字数降序排序的章节详情
const sortedChapterDetails = computed(() => {
  return [...chapterStats.chapterDetails].sort((a, b) => b.characters - a.characters);
});

// 判断是否是前1/5的章节
const isTopFifth = (index: number) => {
  const fifthCount = Math.ceil(chapterStats.totalChapters / 5);
  return index < fifthCount;
};

// 判断是否是末1/5的章节
const isBottomFifth = (index: number) => {
  const fifthCount = Math.ceil(chapterStats.totalChapters / 5);
  return index >= chapterStats.totalChapters - fifthCount;
};

// 暴露给父组件的方法
defineExpose({
  initData,
  getData: () => {
    return [...chapterList];
  },
});

// 显示章节统计
const showChapterStats = () => {
  calculateChapterStats();
  statsVisible.value = true;
};

// 应用标题格式化
const applyTitleFormat = () => {
  if (!form.format) {
    alert('请填写标题格式');
    return;
  }
  if (form.keepOldTitle && !form.format.includes('{title}')) {
    alert('已选择保留原标题，标题格式中必须包含 {title} 占位符');
    return;
  }

  let orderNum = 1;

  // 遍历章节列表应用格式化
  chapterList.forEach((chapter: ChapterOnBar) => {
    if (form.exclude.includes(chapter.Title)) {    // 检查是否需要排除当前章节
      return;
    }

    // 根据序号类型获取格式化的序号
    let formattedNumber = '';
    if (form.numberType === '1') {
      formattedNumber = orderNum.toString();      // 数字类型
    } else {
      formattedNumber = numberToChinese(orderNum);      // 汉字类型
    }

    // 获取标题内容
    let titleContent = form.keepOldTitle ? chapter.Title : '';

    // 应用格式化模板
    let newTitle = form.format
      .replace(/{n}/g, formattedNumber)
      .replace(/{title}/g, titleContent);

    // 更新章节标题
    chapter.Title = newTitle;
    orderNum++;
  });

  // 关闭模态框
  setTitleVisible.value = false;
};

</script>

<style scoped>
.stats-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.stats-label {
  color: var(--color-text-secondary);
}

.stats-value {
  font-weight: 500;
  color: var(--color-text-primary);
}

.chapter-detail-item {
  padding: 12px;
  border-bottom: 1px solid var(--color-border-light);
  display: flex;
  justify-content: space-between;
}

.chapter-title {
  font-weight: 500;
  margin-bottom: 5px;
  color: var(--color-text-primary);
}

.chapter-stats {
  color: var(--color-text-secondary);
  font-size: 13px;
}

/* 前1/5章节的样式 - warning颜色 */
.chapter-warning .chapter-title,
.chapter-warning .chapter-stats {
  color: rgb(var(--orange-5));
}

/* 末1/5章节的样式 - danger颜色 */
.chapter-danger .chapter-title,
.chapter-danger .chapter-stats {
  color: rgb(var(--red-5));
}
</style>