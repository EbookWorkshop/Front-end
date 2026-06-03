<template>
  <a-modal fullscreen :visible="visible" title="按数字重排章节" @ok="submit" @cancel="$emit('update:visible', false)" unmount-on-close ok-text="保存">
    &nbsp;
    <a-row>
      <a-col>
        <a-form :model="formModel">
          <a-form-item label="数字表达式">
            <a-input v-model="formModel.numReg" placeholder="请输入正则表达式" />
          </a-form-item>
          <!-- <a-form-item label="跨卷处理">
            <a-switch v-model="formModel.isCrossVolume" />
          </a-form-item> -->
          <a-form-item>
            <a-button type="primary" @click="Refresh">预览</a-button>
            <a-button @click="">重置</a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
    <a-divider/>
    <a-row v-for="volume in volumes" :key="volume.VolumeId" style="margin-bottom: 20px;">
      <a-col :span="24" style="padding: 5px; background-color: var(--color-bg-4); border-radius: 4px; font-weight: bold;">
        {{ volume.Title }}
      </a-col>
      <a-col v-for="chapter in chapters.filter(c => c.VolumeId === volume.VolumeId)" :key="chapter.IndexId" :span="4" 
        :class="['titleBar', newOrderSet.find(item => item.chapterId === chapter.IndexId) ? 'change' : '']">
        {{ chapter.Title }}
      </a-col>
    </a-row>
    <a-row v-if="volumes.length === 0">
      <a-col v-for="chapter in chapters" :key="chapter.IndexId" :span="4"
        :class="['titleBar', newOrderSet.find(item => item.chapterId === chapter.IndexId) ? 'change' : '']">
        {{ chapter.Title }}
      </a-col>
    </a-row>
  </a-modal>
</template>

<script setup lang="ts">
import type { Volume, Chapter } from '@/types/book';
import { ref, reactive } from 'vue';
import { Message } from "@arco-design/web-vue";
import {
  restructureChapter,
} from '@/api/book';


const formModel = reactive({
  numReg: '',
});

const newOrderSet=ref<any[]>([]);

const props = defineProps<{
  visible: boolean;
  bookId: Number;
  volumes: Volume[];
  chapters: Chapter[];
}>();
const emiter = defineEmits(['update:visible', 'submit'])

const submit = async () => {
  if (newOrderSet.value.length === 0) {
    Message.error('没有修改的章节顺序');
    return;
  }

  try {
    const chaptersSetting = newOrderSet.value.map(item => ({
      chapterId: item.chapterId,
      orderNum: item.newOrder,
    }));

    await restructureChapter({
      bookId: props.bookId, operations: [{
        operationType: 'update',
        chapters: chaptersSetting,
      }]
    });
    Message.success('重新调整排序成功');

    emiter('update:visible', false);
  } catch (error) {
    Message.error(`重新调整排序失败：${error}`);
  }
}

function Refresh() {
  const reg = new RegExp(formModel.numReg);

  props.chapters.sort((a,b)=>{
    const aNum = a.Title.match(reg)?.[0] ?? '0';
    const bNum = b.Title.match(reg)?.[0] ?? '0';
    return Number(aNum) - Number(bNum);
  });
  newOrderSet.value=[];
  let preOrder=props.chapters[0].OrderNum;
  for(let i=1;i<props.chapters.length;i++){
    if(props.chapters[i].OrderNum<=preOrder){
      newOrderSet.value.push({chapterId:props.chapters[i].IndexId, newOrder: preOrder+1});
      preOrder+=1;
    }else{
      preOrder=props.chapters[i].OrderNum;
    }
  }
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

.titleBar{
  padding: 5px; border: 1px solid #f0f0f0; border-radius: 4px;
}
.change{
  border-color: rgb(var(--danger-6));
}
</style>