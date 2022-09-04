<template>
  <div class="container">
    <Breadcrumb :items="['menu.library', 'menu.library.list']" />
    <a-row :gutter="20" align="stretch" justify="center">
      <a-col :span="2"></a-col>
      <a-col :span="3">
        <BookCover
          :loading="loading"
          :book-name="renderData.BookName"
          :cover-img="renderData.CoverImg"
        ></BookCover>
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
        <a-row v-if="loading" :gutter="10">
          <a-col v-for="i in [1, 2, 3, 4, 5, 6]" :key="i" :span="4">
            <a-skeleton :animation="true">
              <a-skeleton-line :rows="4" :line-height="48" :line-spacing="10" />
            </a-skeleton>
          </a-col>
        </a-row>
        <a-row v-else :gutter="[10, 10]" align="stretch" justify="start">
          <a-col v-for="item in renderData.Index" :key="item.IndexId" :span="4">
            <a-button
              long
              :disabled="!item.IsHasContent"
              class="chapter"
              @click="goto(item.IndexId)"
              >{{ item.Title }}
            </a-button>
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
  import BookCover from '@/components/book-cover/index.vue';

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
