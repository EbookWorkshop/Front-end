<template>
  <div class="container">
    <Breadcrumb :items="['menu.library', 'menu.library.list', renderData.BookName]" />
    <div class="wrapper">
      <a-spin :loading="loading" tip="加载中..." :size="64" style="width: 100%; height: 100%">
        <BookInfo :loading="loading" :bookId="bookId" :BookName="renderData.BookName" :convertImg="renderData.CoverImg"
          :Author="renderData.Author">
          <template #toolbar>
            <a-row align="end" justify="start" style="height: 150px;">
              <a-col :span="24" :offset="2">
                <TagToolbar :book-id="bookId" />
              </a-col>
            </a-row>
          </template>
        </BookInfo>
        <a-divider />
        <ChapterList :loading="loading" :Chapters="renderData.Index">
          <template #content="{ item }">
            <a-button long @click="gotoChapter(item.IndexId)" :type="item.IsHasContent ? 'secondary' : 'secondary'"
              :disabled="!item.IsHasContent" :size="renderData.Index.length < 50 ? 'large' : 'medium'"
              class="chapterBar">
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
import TagToolbar from '@/components/tag-toolbar/index.vue';

import useRequest from '@/hooks/request';
import useBookHelper from '@/hooks/book-helper';

import { queryBookById } from '@/api/book';

import { ref, nextTick } from 'vue';

const { bookId, gotoChapter } = useBookHelper();
const { loading, response: renderData } = useRequest<Book>(queryBookById.bind(null, bookId));

</script>
<style lang="less">
.chapterBar {
  overflow: hidden;
}
</style>