<template>
  <div class="container">
    <Breadcrumb :items="['menu.workshop', 'menu.workshop.import']" />
    <a-row :gutter="20" align="center" justify="start">
      <a-col :span="6"></a-col>
      <a-col :span="12">
        <a-spin :loading="processing" tip="正在处理中，这需要稍等...">
          <a-row :gutter="20" align="center" justify="center">
            <a-col flex="auto" class="col-align-center">
              <BookClassical
                :title-show="'网文导入'"
                @click="toImport"
              ></BookClassical>
            </a-col>
            <a-col flex="auto" class="col-align-center">
              <a-upload action="/ul">
                <template #upload-button>
                  <BookClassical
                    :title-show="'TXT 导入'"
                    conver-color="#f2e3a4"
                  >
                  </BookClassical>
                </template>
              </a-upload>
            </a-col>
            <a-col flex="auto" class="col-align-center">
              <a-upload action="/ul">
                <template #upload-button>
                  <BookClassical
                    :title-show="'不可编辑格式导入：PDF，Mobi、EPUB等'"
                    conver-color="#cb1f2f"
                  >
                  </BookClassical>
                </template>
              </a-upload>
            </a-col>
          </a-row>
        </a-spin>
      </a-col>
    </a-row>
    <ImportWeb
      :visible="isShow"
      @cancel="toImportClose"
      @ok="toImportClose"
      @check="handleBeforeOk"
    >
    </ImportWeb>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { Message, Modal } from '@arco-design/web-vue';
  // import { useRouter, useRoute } from 'vue-router';
  import BookClassical from '@/components/book-cover/components/book-classical.vue';
  import { addANewWebBook } from '@/api/book';
  import ImportWeb from './components/import-web.vue';

  const isShow = ref(false);
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
        Message.success(`添加成功！新书：《${result.data.BookName}》已入库！`);
      })
      .catch((err) => {
        Message.error(`添加书失败：${err.message}`);
      })
      .finally(() => {
        processing.value = false;
      });
  };
</script>

<style>
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
  }
</style>
