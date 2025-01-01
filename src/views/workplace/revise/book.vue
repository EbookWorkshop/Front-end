<template>
  <div class="container">
    <Breadcrumb :items="['menu.workplace', 'menu.workplace.revise', renderData.BookName]" />
    <div class="wrapper">
      <BookInfo :loading="loading" :bookId="bookId" :BookName="renderData.BookName" :convertImg="renderData.CoverImg"
        :Author="renderData.Author" />
      <ChapterList :loading="loading" :Chapters="renderData.Index">
        <template #content="{ item }">
          <a-button long class="chapter" @click="onClickChapter(item.IndexId)">
            {{ item.Title }}
          </a-button>
        </template>
      </ChapterList>

      <a-modal fullscreen :visible="isEdit" @cancel="() => isEdit = false" :title="form.chapTitle" @ok="onSubmit">
        <a-form :model="form" layout="vertical">
          <a-form-item field="chapTitle" label="章节标题">
            <a-input v-model="form.chapTitle" />
          </a-form-item>
          <a-form-item field="content" label="章节正文">
            <a-textarea v-model="form.content" auto-size />
          </a-form-item>
        </a-form>
      </a-modal>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Book, Chapter } from "@/types/book";

import { ref, reactive } from "vue";
import {
  queryChapterById,
  queryBookById,
  editChapter,
} from '@/api/book';
import { AxiosResponse } from 'axios';

//组件
import { Message, Modal } from '@arco-design/web-vue';
import BookInfo from "@/components/book-info/index.vue";
import ChapterList from '@/components/chapter-list/index.vue';

import useRequest from '@/hooks/request';
import useBookHelper from '@/hooks/book-helper';

const { bookId, gotoChapter, gotoIndex } = useBookHelper();
const { loading, response: renderData } = useRequest<Book>(queryBookById.bind(null, bookId));

const form = reactive({
  chapTitle: '',
  content: '',
});

const curChapId = ref(0);
let defTitle: String = ""
let defContent: String = "";

const isEdit = ref(false);

/**
 * 点击章节列表
 * @param cid 
 */
const onClickChapter = (cid: number) => {
  isEdit.value = true;
  curChapId.value = cid;

  // const { loading, response: renderData } = useRequest<Chapter>(queryChapterById.bind(null, curChapId.value));

  queryChapterById(cid).then((result: AxiosResponse<Chapter>) => {
    form.chapTitle = result.data.Title as any
    form.content = result.data.Content as any;
    defTitle = result.data.Title;
    defContent = result.data.Content ?? "";
  }).catch(result => {
    form.chapTitle = result.value;
  });
}

/**
 * 提交修改
 */
const onSubmit = () => {
  let result = {} as Chapter;
  let change = false;
  if (defTitle !== form.chapTitle) {
    change = true;
    result.Title = form.chapTitle;
  }
  if (defContent !== form.content) {
    change = true;
    result.Content = form.content;
  }

  if (change) {
    result.IndexId = curChapId.value;
    editChapter(result).then(rsl => {
      // console.log(rsl);
      Message.success("更新成功！");
      isEdit.value = false;
    });
    return;
  }


}


</script>
