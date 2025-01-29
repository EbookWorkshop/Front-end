<template>
  <div class="container">
    <Breadcrumb :items="['menu.library', 'menu.workshop.export', 'menu.workshop.export.guide']" />
    <div class="wrapper">
      <div class="frame-bg">
        <div class="frame-body">
          <div class="frame-aside">
            <a-steps :current="current" direction="vertical">
              <a-step>选一本书</a-step>
              <a-step>选章节范围</a-step>
              <a-step>生成文件</a-step>
            </a-steps>
          </div>
          <div class="frame-main">
            <a-form :model="form" ref="formRef" auto-label-width>
              <div v-if="current == 1" class="main-content">
                <a-form-item label="选择书籍" required>
                  <SelectBook v-model="form.bookId" :rules="[{ required: true, message: '必须设置文本编码' }]" />
                </a-form-item>
              </div>
              <div v-if="current == 2" class="main-content">
                <a-form-item label="全部章节">
                  <a-switch :default-checked="true" v-model="form.isCheckAll" @change="getBookIndex" />
                </a-form-item>
                <a-form-item field="cBegin" label="开始章节:" required v-if="!form.isCheckAll">
                  <a-select v-model="form.cBegin" :options="Chapters"
                    :field-names="{ value: 'IndexId', label: 'Title' }" :virtual-list-props="{ height: 200 }"
                    allow-search />
                </a-form-item>
                <a-form-item field="cEnd" label="结束章节:" required v-if="!form.isCheckAll">
                  <a-select v-model="form.cEnd" :options="[...Chapters].reverse()"
                    :field-names="{ value: 'IndexId', label: 'Title' }" :virtual-list-props="{ height: 200 }"
                    allow-search />
                </a-form-item>
              </div>
              <div v-if="current == 3" class="main-content">
                <a-form-item label="文件类型" required>
                  <a-radio-group v-model="form.fileType">
                    <a-radio value="pdf">PDF</a-radio>
                    <a-radio value="txt">TXT</a-radio>
                  </a-radio-group>
                </a-form-item>
                <a-form-item label="发送到默认邮箱">
                  <a-switch v-model="form.isSendEmail" />
                </a-form-item>
              </div>
            </a-form>
            <div class="main-bottom">
              <a-button :disabled="current === 1" @click="onPrev">
                <icon-left />
                上一步
              </a-button>
              <a-button v-if="current < 3" @click="onNext">
                下一步
                <icon-right />
              </a-button>
              <a-button v-if="current === 3" @click="onSubmit" status="success" :loading="saving">
                <icon-save />
                导 出
              </a-button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { FormInstance } from '@arco-design/web-vue/es/form';
import SelectBook from '@/components/select-book/index.vue'
import { Message } from '@arco-design/web-vue';

import { queryBookById, createTXT, createPDF } from '@/api/book';
import { ApiResultCode, HttpResponse } from '@/types/global'

const saving = ref(false);
const formRef = ref<FormInstance>();
const form = ref({
  bookId: undefined as number | undefined,
  isCheckAll: true,
  chapterRange: '',
  cBegin: undefined as number | undefined,
  cEnd: undefined as number | undefined,
  fileType: undefined,
  isSendEmail: true,
});
const current = ref(1);
const Chapters = ref<Array<any>>([]);


function getBookIndex() {
  if (!form.value.bookId || form.value.isCheckAll) return;
  queryBookById(form.value.bookId).then(res => {
    if (res.code === ApiResultCode.Success) {
      Chapters.value = res.data.Index;
    }
  })
}

const onPrev = () => {
  current.value = Math.max(1, current.value - 1);
};

const onNext = async () => {
  if (current.value == 1 && !form.value.bookId) {
    formRef.value?.setFields({
      bookId: {
        status: 'error',
        message: '需要先选择书籍',
      }
    });
    return;
  }

  current.value = Math.min(3, current.value + 1);
};

const onSubmit = () => {
  let chapterIds = [] as any;
  if (form.value.isCheckAll) {
    chapterIds = null;
  } else {
    for (let i = 0; i < Chapters.value.length; i++) {
      if (Chapters.value[i].IndexId >= (form.value.cBegin ?? 0) && Chapters.value[i].IndexId <= (form.value.cEnd ?? 0)) chapterIds.push(i);
    }
  };

  let api = form.value.fileType === 'pdf' ? createPDF : createTXT;

  saving.value = true;
  
  api(form.value?.bookId ?? 0, chapterIds, form.value.isSendEmail).then((res: any) => {
    saving.value = false;
    if (res.code === ApiResultCode.Success) {
      if (form.value.isSendEmail) {
        Message.success('导出成功，已发送到邮箱');
      } else {
        //goto download page
        //Message.success('导出成功');
      }
    } else {
      Message.error('导出失败');
    }
  })
}
</script>


<style scoped lang="less">
.frame-bg {
  padding: 40px;
  background: var(--color-fill-2);
}

.frame-body {
  display: flex;
  background: var(--color-bg-2);
}

.frame-aside {
  padding: 24px;
  min-height: 400px;
  border-right: 1px solid var(--color-border);
}

.frame-main {
  width: 100%;
  padding: 24px 200px;
}

.main-content {
  margin-top: 40px;
  text-align: center;
  line-height: 200px;
  min-height: 220px;
  color: var(--color-text-2);
}

.main-bottom {
  display: flex;
  justify-content: center;

  button {
    margin: 0 20px;
  }
}
</style>
