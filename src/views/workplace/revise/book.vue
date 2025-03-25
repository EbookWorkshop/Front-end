<template>
  <div class="container">
    <Breadcrumb :items="['menu.workplace', 'menu.workplace.revise', renderData?.BookName]" />
    <div class="wrapper">
      <BookInfo :loading="loading" :bookId="bookId" :BookName="renderData?.BookName" :convertImg="renderData?.CoverImg"
        :Author="renderData?.Author">
        <template #toolbar>
          <Toolbar @EditChapterOrdering="onChangeOrdering" :bookid="bookId" :chapters="renderData?.Index ?? []"></Toolbar>
        </template>
      </BookInfo>
      <a-divider />
      <keep-alive>
        <ChapterList :loading="loading" :Chapters="renderData?.Index">
          <template #content="{ item }">
            <a-button-group v-if="!isOrdering" style="width: 100%;">
              <a-button long class="chapter" @click="onClickChapter(item.IndexId)" style="width: 100%;">
                {{ item.Title }}
              </a-button>
              <a-dropdown trigger="click" position="br">
                <a-button>
                  <template #icon>
                    <icon-down />
                  </template>
                </a-button>
                <template #content>
                  <a-doption @click="onClickSplit(item.IndexId)">分割章节</a-doption>
                  <a-doption @click="onMargeChapter(item.IndexId)">合并当前和下一章</a-doption>
                  <a-doption style="color: red;">删除章节</a-doption>
                </template>
              </a-dropdown>
            </a-button-group>
            <a-dropdown v-else trigger="contextMenu" alignPoint :style="{ display: 'block' }">
              <a-button long class="chapter">{{ item.Title }}</a-button>
              <template #content>
                <a-doption @click="moveToTop(item)">移至开头</a-doption>
                <a-doption @click="moveToBottom(item)">移至结尾</a-doption>
              </template>
            </a-dropdown>
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
        :title="curChapId == -1 ? '新增章节' : form.chapTitle"
        @ok="() => { return deleteChapter > 0 ? onSaveChapter() : onSubmit() }">
        <a-form :model="form" layout="vertical">
          <a-form-item field="chapTitle" label="章节标题">
            <a-input v-model="form.chapTitle" />
          </a-form-item>
          <a-form-item field="content" label="章节正文">
            <a-textarea v-model="form.content" :auto-size="{ minRows: 20 }" show-word-limit />
          </a-form-item>
        </a-form>
      </a-modal>

      <SplitTool v-model:model-value="isSplit" :id="splitId" :bookId="bookId" />
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
  restructureChapter,
} from '@/api/book';
import { AxiosResponse } from 'axios';

//组件
import { Message, } from '@arco-design/web-vue';
import BookInfo from "@/components/book-info/index.vue";
import ChapterList from '@/components/chapter-list/index.vue';
import Toolbar from "./components/toolbar.vue";
import SplitTool from "./components/SplitTool.vue";

// import useRequest from '@/hooks/request';
import useBookHelper from '@/hooks/book-helper';

const { bookId } = useBookHelper();

const loading = ref(true);
const renderData = ref<Book | null>(null);//完整的 - 书本信息
let maxOrderNum = 0;    //最大章节序号
let deleteChapter = 0;  //合并章节时用-合并删除的章节

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
const isSplit = ref(false);
const splitId = ref(0); // 新增响应式变量存储当前分割章节ID
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
  deleteChapter = 0;

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

const onMargeChapter = async (cid: number) => {
  isEdit.value = true;
  // 获取当前章节在列表中的位置
  const currentIndex = renderData.value?.Index?.findIndex(chap => chap.IndexId === cid) ?? -1;
  // 获取下一章节ID（当前章节位置+1）
  const cidNext = (currentIndex > -1 ? renderData.value?.Index?.[currentIndex + 1]?.IndexId : -1) ?? 0;
  if (cidNext === -1) {
    Message.error("没有找到可合并的下一章节");
    return;
  }
  deleteChapter = cidNext;

  try {
    let result = await queryChapterById(cid);
    form.chapTitle = result.data.Title as any
    form.content = result.data.Content as any;
    defTitle = result.data.Title;
    defContent = result.data.Content ?? "";

    result = await queryChapterById(cidNext);
    form.content = form.content + result.data.Title + result.data.Content as any;
  } catch (err: any) {
    form.chapTitle = err.message || err;
  }
}


const onClickSplit = (cid: number) => {
  isSplit.value = true;
  splitId.value = cid; // 设置当前要分割的章节ID
}

/**
 * 提交修改-单独修改单独章节标题/内容
 */
const onSubmit = () => {
  console.log("保存", deleteChapter)
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
 * 合并章节保存
 */
function onSaveChapter() {
  console.log("合并章节保存", deleteChapter)
  if (deleteChapter <= 0) return;
  restructureChapter({
    "bookId": bookId,
    "baseChapter": {
      "chapterId": curChapId.value,
      "content": form.content,
      "title": form.chapTitle
    },
    "operations": [{
      "operationType": "delete",
      "chapters": [deleteChapter]
    }]
  }).then(rsl => {
    Message.success("更新成功！");
    isEdit.value = false;
  })
}

/**
 * 切换章节排序
 * @param ordering 
 */
function onChangeOrdering(ordering: boolean) {
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
      // console.log("修改排序结果", result);
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

/**
 * 从目录中找到章节序号
 * @param id 章节ID
 */
function FindBookChepter(id: number) {
  let findIndex = -1;
  let IndexList = renderData.value?.Index || [];
  for (let i = 0; i < IndexList.length; i++) {
    if (IndexList[i].IndexId === id) {
      findIndex = i;
      break;
    }
  }
  return findIndex;
}

/**
 * 移动到章节列表开始
 * @param item 
 */
function moveToTop(item: any) {
  let findIndex = FindBookChepter(item.IndexId);
  let IndexList = renderData.value?.Index || [];
  let [newItem] = IndexList.splice(findIndex, 1);
  let maxOrder = IndexList[0].OrderNum - 1;
  updateChapterOrder([{ newOrder: maxOrder, indexId: newItem.IndexId }]).then(result => {
    orderList.length = 0;
    IndexList.unshift(newItem as any);
  }).catch(err => {
    console.log("修改排序出错", err);
  })
}
/**
 * 移动到底部
 */
function moveToBottom(item: any) {
  let findIndex = FindBookChepter(item.IndexId);
  let IndexList = renderData.value?.Index || [];
  let [newItem] = IndexList.splice(findIndex, 1);
  let maxOrder = IndexList[IndexList.length - 1].OrderNum + 1;

  maxOrderNum = Math.max(maxOrderNum + 1, maxOrder);

  // { order: t.OrderNum, indexId: t.IndexId }
  updateChapterOrder([{ newOrder: maxOrderNum, indexId: newItem.IndexId }]).then(result => {
    orderList.length = 0;
    IndexList.push(newItem as any);
  }).catch(err => {
    console.log("修改排序出错", err);
  })
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