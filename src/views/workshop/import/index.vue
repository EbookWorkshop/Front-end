<template>
  <div class="container">
    <Breadcrumb :items="['menu.workshop', 'menu.workshop.import']" />
    <a-row :gutter="20" align="center" justify="start">
      <a-col :span="6"></a-col>
      <a-col :span="12">
        <a-row :gutter="20" align="center" justify="center">
          <a-col flex="auto" class="col-align-center">
            <BookClassical
              :title="''"
              :title-show="'网址导入'"
              @click="toWebImport"
            >
            </BookClassical>
          </a-col>
          <a-col flex="auto" class="col-align-center">
            <a-upload action="/ul">
              <template #upload-button>
                <BookClassical
                  :title="''"
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
                  :title="''"
                  :title-show="'PDF 导入'"
                  conver-color="#cb1f2f"
                >
                </BookClassical>
              </template>
            </a-upload>
          </a-col>

          <!-- <a-col flex="auto" class="col-align-center">
            <BookClassical :title="''" :title-show="'四十二章经'" conver-color="#212f30"> </BookClassical>
          </a-col>
          <a-col flex="auto" class="col-align-center">
            <BookClassical :title="''" :title-show="'四十二章经'" conver-color="#212f30"> </BookClassical>
          </a-col>
          <a-col flex="auto" class="col-align-center">
            <BookClassical :title="''" :title-show="'四十二章经'" conver-color="#212f30"> </BookClassical>
          </a-col> -->
        </a-row>
      </a-col>
    </a-row>
  </div>
  <WebImport
    :visible="webImportIsShow"
    @cancel="cancelWebImport"
    @ok="goWebImport"
  >
  </WebImport>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import BookClassical from '@/components/book-cover/components/book-classical.vue';
  import WebImport from './components/import-web.vue';

  const router = useRouter();

  const webImportIsShow = ref(false);
  const webForm = reactive({
    indexUrl: 'https://',
  });

  const toWebImport = () => {
    webImportIsShow.value = true;
  };
  const cancelWebImport = () => {
    webImportIsShow.value = false;
  };
  const goWebImport = () => {
    console.log('aa', webForm);
    webImportIsShow.value = false;
  };
  const checkForm = () => {
    console.log('check');
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
