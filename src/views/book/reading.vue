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
              <a-space direction="horizontal" wrap>
                <a-tag v-for="t of tagsData" :color="t.Color" :key="t.id" :style="{ cursor: 'pointer' }"
                  :closable="delTagAble" @close="handleCloseTag(t.id)">
                  {{ t.Text }}
                </a-tag>


                <!-- 添加标签工具 -->
                <a-input v-if="showInput" ref="inputRef" :style="{ width: '90px' }" size="mini" v-model.trim="inputVal"
                  @keyup.enter="handleAddTag" @blur="handleAddTag" />
                <span v-else>
                  <a-tag :style="{
                    backgroundColor: 'var(--color-fill-2)',
                    border: '1px dashed var(--color-fill-3)',
                    cursor: 'pointer',
                  }" @click="handleEdit">
                    <template #icon>
                      <icon-plus />
                    </template>
                  </a-tag>
                  <a-tag :style="{
                    backgroundColor: 'var(--color-fill-2)',
                    border: '1px dashed var(--color-fill-3)',
                    cursor: 'pointer',
                  }" @click="delTagAble = !delTagAble"> <template #icon><icon-delete /></template> </a-tag>
                </span>
                <!-- 添加标签工具 -->
              </a-space>
              </a-col>
            </a-row>
          </template>
        </BookInfo>
        <ChapterList :loading="loading" :Chapters="renderData.Index">
          <template #content="{ item }">
            <a-button long @click="gotoChapter(item.IndexId)" :type="item.IsHasContent ? 'secondary' : 'secondary'"
              :disabled="!item.IsHasContent" :size="renderData.Index.length < 50 ? 'large' : 'medium'">
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
import { queryTagByBookId, addTagForBook, removeTagForBook } from '@/api/tag';

import { ref, nextTick } from 'vue';

const { bookId, gotoChapter } = useBookHelper();
const { loading, response: renderData } = useRequest<Book>(queryBookById.bind(null, bookId));
const { response: tagsData } = useRequest<Array<{ id: number, Text: string, Color: string }>>(queryTagByBookId.bind(null, bookId));

const showInput = ref(false);
const delTagAble = ref(false);
const inputRef = ref<any>(null);
const inputVal = ref("");

function handleAddTag() {
  if (inputVal.value) {
    let exist = tagsData.value.filter(t => t.Text === inputVal.value);
    if (exist.length > 0) {
      showInput.value = false;
      inputVal.value = '';
      return;
    }
    addTagForBook(bookId, inputVal.value).then((result: any) => {
      if (result.code != 20000) return;
      tagsData.value.push(result.data);
    });
    inputVal.value = '';
  }
  showInput.value = false;
}
function handleEdit() {
  showInput.value = true;

  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus();
    }
  });
}
function handleCloseTag(tagId: number) {
  removeTagForBook(bookId, tagId);
}
</script>
