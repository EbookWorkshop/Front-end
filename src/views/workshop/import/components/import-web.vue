<template>
  <a-modal :visible="visible" title="从网址导入" :on-before-ok="handleBeforeOk" width="auto" unmount-on-close
    @before-close="handleClose" @cancel="handleClose">
    <div style="min-width:35vw">
      <a-alert v-if="!form.isOneChapter" type="info">请输入要导入的书籍目录页的网址。</a-alert>
      <a-alert v-else type="info">请输入章节开始页面网址，抓取完成后，文件将存放在【库存】中。</a-alert>
      <a-form :model="form" ref="formRef" style="margin-top: 20px;">
        <a-form-item field="indexUrl" label="网址" :rules="[{ required: true, message: '请输入要导入的书籍目录页的网址。' }]">
          <a-input v-model="form.indexUrl" placeholder="例如: https://example.com/book/123" allow-clear />
        </a-form-item>
        <a-row :gutter="16" justify="center">
          <a-col :span="8" :offset="2">
            <a-form-item :label-col-props="{ span: 8 }" :wrapper-col-props="{ span: 8 }" field="isEmbedBookName"
              label="嵌入书名" title="封面是否嵌入书名，如果目标网站无图片封面，则这个设置将忽略。">
              <a-switch v-model="form.isEmbedBookName" :disabled="disableBookName"></a-switch>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="isOneChapter" label="单章">
              <a-switch v-model="form.isOneChapter" @change="onSwitchSingleCP"></a-switch>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

export interface ImportWebForm {
  indexUrl: string;
  isOneChapter: boolean;
  isEmbedBookName: boolean; // 封面是否嵌入标题
}
const emit = defineEmits(['check', 'cancel', 'ok']);
const props = defineProps<{
  visible: boolean;
}>();

const formRef = ref();
const form = reactive<ImportWebForm>({
  indexUrl: '',
  isOneChapter: false,
  isEmbedBookName: true,
});
const disableBookName = ref(false);

const handleBeforeOk = async (done: any) => {
  const checkRsl = await formRef.value.validate();
  if (checkRsl) return done(false);

  emit('check', form);
  done(true);
};
const handleClose = () => {
  emit('cancel');
};


function onSwitchSingleCP() {
  if (form.isOneChapter) form.isEmbedBookName = false;
  disableBookName.value = form.isOneChapter;
}
</script>
