<template>
  <a-modal fullscreen :visible="visible" title="格式化标题" @ok="submit" @cancel="$emit('update:visible', false)" unmount-on-close>
    <div class="setPanel">
      <div style="display: flex; justify-content: center; align-items: center; height: 100%; width: 100%;">
        <a-form :model="formModel" layout="horizontal" label-align="right" label-col="{ span: 6 }"
          wrapper-col="{ span: 18 }">
          <a-row :gutter="16" align="center" justify="center">
            <a-col :span="8">
              <a-form-item label="替换规则">
                <a-input v-model="formModel.replaceReg" placeholder="输入替换规则，支持正则" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="替换字符串">
                <a-popover position="bl">
                  <a-input v-model="formModel.replaceStr" placeholder="输入替换字符串" />
                  <template #content>
                    <div>提示：</div>
                    <div>1. 捕获的分组，按顺序用<a-tag>$1</a-tag size="small">、<a-tag size="small">$2</a-tag>...替代；</div>
                  </template>
                </a-popover>
              </a-form-item>
            </a-col>
            <a-col :span="24" style="text-align: center; margin-top: 10px;">
              <a-button @click="Refresh">刷新预览</a-button>
              <a-button @click="ResetForm">重置</a-button>
              <a-button style="margin-left: 2px;" @click="isShowDiffOnly = !isShowDiffOnly">只看调整的</a-button>
              <a-button style="margin-left: 10px;" type="primary" status="success" @click="submit">应用</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </div>
    <a-card :bordered="false" :style="{ width: '100%', marginTop: '140px' }">
      <a-card-grid v-for="(item, index) in chapterTitles" :key="index" :hoverable="chapterTitles.length <= 100"
        :class="chapterTitles.length > 200 ? 'L' : (chapterTitles.length > 80 ? 'M' : 'S')">
        <a-card v-if="!isShowDiffOnly || (isShowDiffOnly && item.OldTitle != item.NewTitle)" :bordered="false"
          :title="''">
          <a-typography-paragraph @click="item.NewTitle = item.OldTitle" style="cursor: pointer;">
            <a-typography-text type="secondary">{{ item.OldTitle }}</a-typography-text>
          </a-typography-paragraph>
          <a-typography-text v-if="item.NewTitle != item.OldTitle" type="danger">
            {{ item.NewTitle }}
          </a-typography-text>
        </a-card>
      </a-card-grid>
    </a-card>
  </a-modal>
</template>

<script setup lang="ts">
import type { Chapter } from "@/types/book";
import { ref, reactive, watch } from 'vue';
// import { AxiosResponse } from 'axios';
import { Message } from "@arco-design/web-vue";
import {
  // queryChapterById,
  restructureChapter,
} from '@/api/book';

type ChapterTitle = {
  Id: number;
  OldTitle: string;
  NewTitle: string;
};

const formModel = reactive({
  replaceReg: '',
  replaceStr: '',
});

const chapterTitles = reactive<ChapterTitle[]>([]);

const props = defineProps({
  visible: Boolean,
  bookId: Number,
  chapters: {
    type: Array as () => Chapter[],
  }
})
const emiter = defineEmits(['update:visible', 'submit'])

const isShowDiffOnly = ref(false);

watch(() => props.chapters, (newChapters) => {
  if (!newChapters) return;

  chapterTitles.splice(0, chapterTitles.length, ...newChapters.map(chapter => ({
    Id: chapter.IndexId,
    OldTitle: chapter.Title,
    NewTitle: chapter.Title,
  })));
}, { immediate: true });

const submit = async () => {
  let isDone = false;
  const changeChapters = chapterTitles.filter(item => item.OldTitle !== item.NewTitle);
  if (changeChapters.length === 0) {
    Message.error('没有修改的标题');
    return;
  }

  try {
    const chaptersSetting = changeChapters.map(item => ({
      chapterId: item.Id,
      title: item.NewTitle,
    }));

    await restructureChapter({
      bookId: props.bookId, operations: [{
        operationType: 'update',
        chapters: chaptersSetting,
      }]
    });
    Message.success('格式化标题成功');

    emiter('update:visible', false);
  } catch (error) {
    Message.error(`格式化标题失败：${error}`);
  }
}

function Refresh() {
  const reg = new RegExp(formModel.replaceReg, 'g');
  chapterTitles.forEach((item) => {
    item.NewTitle = item.NewTitle.replace(reg, formModel.replaceStr);
  })
}

function ResetForm() {
  // formModel.replaceReg = '';
  // formModel.replaceStr = '';
  chapterTitles.forEach((item) => {
    item.NewTitle = item.OldTitle;
  });
}
</script>
<style lang="css">
.setPanel {
  width: 100%;
  height: 120px;
  position: fixed;
  top: 48px;
  left: 0px;
  z-index: 10;
  background-color: var(--color-bg-1);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.L {
  width: 10%
}

.M {
  width: 20%
}

.S {
  width: 25%;
}
</style>