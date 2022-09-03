<template>
  <div class="container">
    <Breadcrumb :items="['menu.library', 'menu.library.list']" />
    <a-row :gutter="20" align="stretch" justify="center">
      <a-col :span="2"></a-col>
      <a-col :span="3">
        <BookWrap
          v-if="renderData.CoverImg !== null"
          :loading="loading"
          :title="renderData.BookName"
          :cover-img="renderData.CoverImg"
        >
          <a-descriptions
            style="margin-top: 16px"
            layout="inline-horizontal"
            :column="2"
          />
        </BookWrap>
        <BookClassical
          v-else
          :loading="loading"
          :title="renderData.BookName"
          :title-show="renderData.BookName.replace(/[\(（)].*$/, '')"
        >
          <a-descriptions
            style="margin-top: 16px"
            layout="inline-horizontal"
            :column="2"
          />
        </BookClassical>
      </a-col>
      <a-col :span="14">
        <a-row :gutter="20" align="center" justify="center">
          <a-col :span="10" style="margin-top: 50px; text-align: center">
            <a-typography-title> {{ renderData.BookName }}</a-typography-title>
          </a-col>
          <a-col :span="14"> </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row class="grid-chapter" style="margin-bottom: 16px">
      <a-col :span="2" style="height: 100%">
        <!-- 【章节列表】给左边预留一点空位 -->
      </a-col>
      <a-col :span="20">
        <a-row :gutter="[10, 10]" align="stretch" justify="start">
          <a-col v-for="item in renderData.Index" :key="item.IndexId" :span="4">
            <a-button
              long
              :loading="!item.IsHasContent"
              class="chapter"
              @click="goto(item.IndexId)"
              >{{ item.Title }}</a-button
            >
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter, useRoute } from 'vue-router';
  import { queryBookById, Book, Chapter } from '@/api/book';
  import useRequest from '@/hooks/request';
  import BookWrap from './components/book-wrap.vue'; // 带封面图书
  import BookClassical from './components/book-classical.vue'; // 古典线装书风格封面

  const route = useRoute();
  const bookid = Number(route.params.id);
  const queryBook = () => {
    return queryBookById(bookid);
  };

  const { loading, response: renderData } = useRequest<Book>(queryBook);

  const router = useRouter();
  const goto = (chapterId: number) => {
    router.push({ path: `/book/${bookid}/chapter/${chapterId}` });
  };
</script>

<style>
  .showBord {
    border: 1px solid red;
  }

  .chapter {
    height: 48px;
    overflow: hidden;
    font-size: 1.2rem;
    text-align: left;
  }
</style>
