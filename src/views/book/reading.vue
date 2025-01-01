<template>
  <div class="container">
    <Breadcrumb :items="['menu.library', 'menu.library.list', renderData.BookName]" />
    <div class="wrapper">
      <a-spin :loading="loading" tip="加载中..." :size="64" style="width: 100%; height: 100%">
        <BookInfo :loading="loading" :bookId="bookId" :BookName="renderData.BookName" :convertImg="renderData.CoverImg"
          :Author="renderData.Author" />
        <ChapterList :loading="loading" :Chapters="renderData.Index">
          <template #content="{ item }">
            <a-button long @click="gotoChapter(item.IndexId)" :status="item.IsHasContent ? 'normal' : 'warning'" :disabled="!item.IsHasContent">
              {{ item.Title }}
            </a-button>
          </template>
        </ChapterList>
      </a-spin>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Book } from '@/types/book';

import BookInfo from "@/components/book-info/index.vue";
import ChapterList from '@/components/chapter-list/index.vue';

import useRequest from '@/hooks/request';
import useBookHelper from '@/hooks/book-helper';

import { queryBookById } from '@/api/book';

const { bookId, gotoChapter, gotoIndex } = useBookHelper();
const { loading, response: renderData } = useRequest<Book>(queryBookById.bind(null, bookId));

</script>
