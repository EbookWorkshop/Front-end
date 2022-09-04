<template>
  <div class="container">
    <Breadcrumb :items="['menu.workshop', 'menu.workshop.import']" />
    <a-row :gutter="20" align="center" justify="start">
      <a-col :span="6"></a-col>
      <a-col :span="12">
        <a-row :gutter="20" align="center" justify="center">
          <a-col flex="auto" class="col-align-center">
            <BookClassical :title-show="'网文导入'"></BookClassical>
          </a-col>
          <a-col flex="auto" class="col-align-center">
            <a-upload action="/ul">
              <template #upload-button>
                <BookClassical :title-show="'TXT 导入'" conver-color="#f2e3a4">
                </BookClassical>
              </template>
            </a-upload>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter, useRoute } from 'vue-router';
  import BookClassical from '@/components/book-cover/components/book-classical.vue';
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
