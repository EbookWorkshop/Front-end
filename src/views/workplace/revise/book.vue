<template>
  <div class="container">
    <Breadcrumb :items="['menu.workplace', 'menu.workplace.revise', renderData.BookName]" />
    <div class="wrapper">
      <BookInfo :loading="loading" :bookId="bookId" :BookName="renderData.BookName" :convertImg="renderData.CoverImg"
        :Author="renderData.Author">
        <template #toolbar>
          <Toolbar @EditChapterOrdering="onChangeOrdering"></Toolbar>
        </template>
      </BookInfo>
      <ChapterList :loading="loading" :Chapters="renderData.Index">
        <template #content="{ item }">
          <a-button v-if="!isOrdering" long class="chapter" @click="onClickChapter(item.IndexId)">
            {{ item.Title }}
          </a-button>
          <a-button-group v-else style="width:100%;overflow:hidden;">
            <a-button>{{ item.OrderNum }}</a-button><a-button long>{{ item.Title }}</a-button>
          </a-button-group>
        </template>
        <template #addChapterTool>
          <a-button long class="chapter" type="outline" @click="onClickChapter(-1)">
            <template #icon>
              <icon-plus />
            </template>
            添加一章
          </a-button>
        </template>
      </ChapterList>

      <!-- 编辑章节内容的弹出窗口 -->
      <a-modal fullscreen :visible="isEdit" @cancel="() => isEdit = false"
        :title="curChapId == -1 ? '新增章节' : form.chapTitle" @ok="onSubmit">
        <a-form :model="form" layout="vertical">
          <a-form-item field="chapTitle" label="章节标题">
            <a-input v-model="form.chapTitle" />
          </a-form-item>
          <a-form-item field="content" label="章节正文">
            <a-textarea v-model="form.content" :auto-size="{ minRows: 20 }" show-word-limit />
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
import { Message, } from '@arco-design/web-vue';
import BookInfo from "@/components/book-info/index.vue";
import ChapterList from '@/components/chapter-list/index.vue';
import Toolbar from "./components/toolbar.vue";

import useRequest from '@/hooks/request';
import useBookHelper from '@/hooks/book-helper';

const { bookId, gotoChapter, gotoIndex } = useBookHelper();
const { loading, response: renderData } = useRequest<Book>(queryBookById.bind(null, bookId));

const form = reactive({
  chapTitle: '',
  content: '',
});

//状态区
const curChapId = ref(0);
let defTitle: String = ""
let defContent: String = "";
const isEdit = ref(false);
const isOrdering = ref(false);


/**
 * 点击章节列表
 * @param cid 修改的章节ID，如果是-1则为新增章节
 */
const onClickChapter = (cid: number) => {
  curChapId.value = cid;
  isEdit.value = true;

  if (cid == -1) {
    form.chapTitle = "";
    form.content = "";
    defTitle = "";
    defContent = "";
    return;
  }

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
  let reload = false;
  if (defTitle !== form.chapTitle) {
    change = true;
    result.Title = form.chapTitle;
    reload = true;
  }
  if (defContent !== form.content) {
    change = true;
    result.Content = form.content;
  }
  if (curChapId.value == -1) {
    result.BookId = bookId;
    reload = true;
  }

  if (change) {
    result.IndexId = curChapId.value;
    editChapter(result).then(rsl => {
      // console.log(rsl);
      Message.success("更新成功！");
      isEdit.value = false;

      if (reload) {
        queryBookById(bookId).then((result: AxiosResponse<Book>) => {
          renderData.value = result.data;
        });
      }
    });
    return;
  }
}

function onChangeOrdering(ordering: boolean) {
  isOrdering.value = ordering
}

</script>
