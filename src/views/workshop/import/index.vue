<template>
  <div class="container">
    <Breadcrumb :items="['menu.workshop', 'menu.workshop.import']" />
    <div class="wrapper">
      <a-row justify="center">
        <a-spin :loading="processing" tip="正在处理中，这需要稍等...">
          <a-row align="center" justify="center">
            <a-col :span="8" flex="auto" class="col-align-center">
              <BookClassical :title-show="'网文导入'" @click="toImport"></BookClassical>
            </a-col>
            <a-col :span="8" flex="auto" class="col-align-center">
              <BookClassical :title-show="'ＴＸＴ 导入'" conver-color="#f2e3a4" @click="handleImportText">
              </BookClassical>
            </a-col>
            <a-col :span="8" flex="auto" class="col-align-center">
              <a-upload action="/upload/importBook/pdf">
                <template #upload-button>
                  <BookClassical :title-show="'不可编辑格式导入：PDF\'-EPUB等'" conver-color="#cb1f2f" />
                </template>
              </a-upload>
            </a-col>
            <a-col :span="8" flex="auto" class="col-align-center">
              <BookClassical :title-show="'直接录入'" :conver-color="'#212f30'" @click="showAdd = true" />
            </a-col>
          </a-row>
        </a-spin>
      </a-row>
      <ImportWeb :visible="isShow" @cancel="toImportClose" @ok="toImportClose" @check="handleBeforeOk">
      </ImportWeb>
      <ImportText ref="textImportModal" @ok="handleImportSubmit"></ImportText>
      <AddDirect :visible="showAdd" @close="showAdd = false"></AddDirect>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { Message } from '@arco-design/web-vue';
// import { useRouter, useRoute } from 'vue-router';
import BookClassical from '@/components/book-cover/components/book-classical.vue';
import { addANewWebBook } from '@/api/book';
import ImportWeb from './components/import-web.vue';
import ImportText from './components/import-text.vue';
import AddDirect from './components/add-direct.vue';

const isShow = ref(false);
const showAdd = ref(false);
const textImportModal = ref() as any; // 模窗的引用
const toImport = () => {
  isShow.value = true;
};
const toImportClose = () => {
  isShow.value = false;
};

const processing = ref(false); // 处理中窗口

// 提交按钮后，向后台发送请求
const handleBeforeOk = (url: string) => {
  processing.value = true;
  isShow.value = false;

  addANewWebBook(url)
    .then((result) => {
      Message.success(`${result.data}`);
    })
    .catch((err) => {
      Message.error(`添加书失败：${err.message}`);
    })
    .finally(() => {
      processing.value = false;
    });
};

/**
 * 处理文本导入
 */
const handleImportText = () => {
  // showTextImport.value = true;
  textImportModal?.value.show();
};
const handleImportSubmit = () => {
  // console.log('触发了确定-模窗');
  // showTextImport.value = false;
};
</script>

<style lang="less" scoped>
.showBord {
  border: 1px solid red;
}

.icon-translate {
  color: rgb(var(--gray-6));
  font-size: 1000px;
}

.col-align-center {
  display: flex;
  justify-content: center;

  :deep(.arco-upload-wrapper) {
    width: inherit;/* 修复PDF导入封面不居中的问题 */
  }
}
</style>
