<template>
  <a-modal fullscreen :visible="visible" title="格式化标题" @before-open="loadData()" @ok="submit"
    @cancel="$emit('update:visible', false)">
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
              <a-button>刷新预览</a-button>
              <a-button style="margin-left: 2px;">只看调整的</a-button>
              <a-button style="margin-left: 10px;" type="primary" status="success" @click="submit">应用</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </div>
    <a-card :bordered="false" :style="{ width: '100%', marginTop: '100px' }">
      <a-card-grid v-for="(item, index) in chapterTitles" :key="index" :hoverable="chapterTitles.length <= 100"
        :class="chapterTitles.length > 200 ? 'L' : (chapterTitles.length > 80 ? 'M' : 'S')">
        <a-card :bordered="false" :title="''">
          {{ item.OldTitle }}
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
  // restructureChapter,
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

const param = defineProps({
  visible: Boolean,
  bookId: Number,
  chapters: {
    type: Array as () => Chapter[],
  }
})
const emiter = defineEmits(['update:visible', 'submit'])



watch(() => param.chapters, (newChapters) => {
  if (!newChapters) return;

  chapterTitles.splice(0, chapterTitles.length, ...newChapters.map(chapter => ({
    Id: chapter.IndexId,
    OldTitle: chapter.Title,
    NewTitle: chapter.Title,
  })));
}, { immediate: true });

const submit = () => {

  emiter('update:visible', false);
}

const loadData = () => {

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