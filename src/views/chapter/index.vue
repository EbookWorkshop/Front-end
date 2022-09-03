<template>
  <div class="container">
    <Breadcrumb :items="['menu.library', 'menu.library.list']" />
    <a-typography :style="{ marginTop: '-40px' }">
      <a-typography-title class="title"
        >{{ renderData.Title }}
      </a-typography-title>
      <a-row class="grid-chapter" style="margin-bottom: 16px">
        <a-col :span="2" style="height: 100%">
          <!-- 【阅读列表】给左边预留一点空位 -->
        </a-col>
        <a-col :span="20" class="content">
          <a-typography-paragraph
            v-for="p in renderData.Content?.split('\n')"
            :key="p"
          >
            {{ p }}
          </a-typography-paragraph>
        </a-col>
      </a-row>
    </a-typography>
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
