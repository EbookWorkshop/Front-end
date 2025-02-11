<template>
  <div class="container">
    <Breadcrumb :items="['menu.workplace', 'menu.workplace.revise', renderData?.BookName]" />
    <div class="wrapper">
      <BookInfo :loading="loading" :bookId="bookId" :BookName="renderData?.BookName" :convertImg="renderData?.CoverImg"
        :Author="renderData?.Author">
        <template #toolbar>
          <Toolbar @EditChapterOrdering="onChangeOrdering"></Toolbar>
        </template>
      </BookInfo>
      <a-divider />
      <keep-alive>
        <ChapterList :loading="loading" :Chapters="renderData?.Index">
          <template #content="{ item }">
            <a-button v-if="!isOrdering" long class="chapter" @click="onClickChapter(item.IndexId)">
              {{ item.Title }}
            </a-button>
            <a-button v-else long class="chapter">{{ item.Title }}</a-button>
          </template>
          <template #addChapterTool>
            <a-button v-if="!isOrdering" long class="chapter" type="outline" @click="onClickChapter(-1)">
              <template #icon>
                <icon-plus />
              </template>
              添加一章
            </a-button>
          </template>
        </ChapterList>
      </keep-alive>
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
import Sortable from 'sortablejs';

import { ref, reactive, nextTick } from "vue";
import {
  queryChapterById,
  queryBookById,
  updateChapterOrder,
  editChapter,
} from '@/api/book';
import { AxiosResponse } from 'axios';

//组件
import { Message, } from '@arco-design/web-vue';
import BookInfo from "@/components/book-info/index.vue";
import ChapterList from '@/components/chapter-list/index.vue';
import Toolbar from "./components/toolbar.vue";

// import useRequest from '@/hooks/request';
import useBookHelper from '@/hooks/book-helper';

const { bookId } = useBookHelper();

const loading = ref(true);
const renderData = ref<Book | null>(null);

nextTick(() => {
  loading.value = true;
  queryBookById(bookId).then((result: AxiosResponse<Book>) => {
    renderData.value = result.data;
  }).finally(() => {
    loading.value = false;
  });
});

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
let sortChapterList = null as any;
const orderList = [] as Array<any>;

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

/**
 * 切换章节排序
 * @param ordering 
 */
function onChangeOrdering(ordering: boolean) {
  console.log("onChangeOrdering::", ordering);
  isOrdering.value = ordering;
  if (ordering) {
    orderList.length = 0;
    if (renderData.value) {
      orderList.push(...renderData.value.Index.map((t) => { return { order: t.OrderNum, indexId: t.IndexId } }));
    }
    if (sortChapterList) {
      sortChapterList.option("disabled", false);
      return;
    }
    const el = document.querySelector('.chapter-list') as any;
    sortChapterList = new Sortable(el, {
      animation: 150,
      ghostClass: 'blue-background-class',
      onEnd: (event) => {
        const { oldIndex, newIndex } = event;
        // console.log("Sort End", oldIndex, newIndex, event);
        const [removed] = orderList.splice(oldIndex ?? 0, 1);
        orderList.splice(newIndex ?? 0, 0, removed);
      },
    });
  } else {
    if (sortChapterList) sortChapterList.option("disabled", true);
    for (var i = 0; i < orderList.length; i++) {
      orderList[i].newOrder = i + 1;
    }
    let edit = orderList.filter(t => t.order != t.newOrder);
    if (edit.length <= 0) {
      console.log("无需修改排序，新顺序结果：", edit);
      return;
    }

    loading.value = true;
    updateChapterOrder(edit).then(result => {
      console.log("修改排序结果", result);
      queryBookById(bookId).then((result: AxiosResponse<Book>) => {
        renderData.value = result.data;
      });
    }).catch(err => {
      console.log("修改排序出错", err);
    }).finally(() => {
      orderList.length = 0;
      loading.value = false;
    })
  }
}

function test() {
  const el = document.querySelector('.chapter-list') as any;
  sortChapterList = new Sortable(el, {
    animation: 150,
    ghostClass: 'blue-background-class',
    onEnd: (event) => {
      const { oldIndex, newIndex } = event;
      // console.log("Sort End", oldIndex, newIndex, event);
      const [removed] = orderList.splice(oldIndex ?? 0, 1);
      orderList.splice(newIndex ?? 0, 0, removed);
    },
  });
}

</script>

<style>
.chapter {
  overflow: hidden;
}

.drag-sortable-list {
  cursor: move;
}

.blue-background-class {
  background-color: lightblue !important;
  border: 1px solid red;
}
</style>