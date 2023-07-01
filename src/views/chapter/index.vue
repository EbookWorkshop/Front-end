<template>
  <div class="container">
    <Breadcrumb :items="['menu.library', 'menu.library.list']" />
    <div class="wrapper">
      <a-row class="grid-chapter" style="margin-bottom: 16px">
        <a-col :span="20" class="content" :offset="2">
          <a-typography :style="{ marginTop: '-40px' }">
            <a-typography-title class="title"
              >{{ renderData.Title }}
            </a-typography-title>
            <a-typography-paragraph
              v-for="(p, index) in renderData.Content?.split('\n')"
              :key="index"
            >
              {{ p }}
            </a-typography-paragraph>
          </a-typography>
        </a-col>
      </a-row>
      <a-row :gutter="8">
        <a-col :span="2" :offset="9"><a-button long>上一章</a-button></a-col>
        <a-col :span="2"><a-button long>目录</a-button></a-col>
        <a-col :span="2"><a-button long>下一章</a-button></a-col>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter, useRoute } from 'vue-router';
  import { queryChapterById, Book, Chapter } from '@/api/book';
  import useRequest from '@/hooks/request';

  const route = useRoute();
  const chapterid = Number(route.params.cid);
  const queryChapter = () => {
    return queryChapterById(chapterid);
  };

  const { loading, response: renderData } = useRequest<Chapter>(queryChapter);
</script>

<style>
  .title {
    color: var(--color-neutral-10);
    text-align: center;
  }

  .content {
    color: var(--color-neutral-10);
    font-size: var(--font-size-body-3);
  }

  .showBord {
    border: 1px solid red;
  }

  .chapter {
    height: 48px;
    font-size: 1.2rem;
    text-align: left;
  }
</style>
