<template>
  <div class="container">
    <Breadcrumb :items="['menu.workplace', 'menu.workplace.revise', renderData?.BookName]" />
    <div class="wrapper">
      <BookInfo :loading="loading" :bookId="bookId" :BookName="renderData?.BookName" :convertImg="renderData?.CoverImg"
        :Author="renderData?.Author" :Introduction="renderData?.Introduction">
        <template #toolbar>
          <Toolbar 
            @EditChapterOrdering="onChangeOrdering" 
            @reload="reloadBook"
            :bookid="bookId" 
            :chapters="renderData?.Index ?? []" 
            :volumes="renderData?.Volumes ?? []"
          >
          </Toolbar>
        </template>
      </BookInfo>
      <a-divider />
      <keep-alive>
        <ChapterList :loading="loading" :Chapters="renderData?.Index" :Volumes="renderData?.Volumes">
          <template #chapter="{ chapter }">
            <a-button-group v-if="!isOrdering" style="width: 100%;">
              <a-button long class="chapter" @click="onClickChapter(chapter.IndexId)" style="width: 100%;">
                {{ chapter.Title }}
              </a-button>
              <a-dropdown trigger="click" position="br" :popup-max-height="false">
                <a-button>
                  <template #icon>
                    <icon-down />
                  </template>
                </a-button>
                <template #content>
                  <a-dgroup title="---------重组---------">
                    <a-doption @click="onClickSplit(chapter.IndexId)">分割章节</a-doption>
                    <a-doption @click="onMargeChapter(chapter.IndexId)">合并当前和下一章</a-doption>
                  </a-dgroup>
                  <a-dgroup title="---------舍弃---------">
                    <a-doption @click="onDeleteChapter(chapter.IndexId)" style="color: red;">删除章节</a-doption>
                    <a-doption @click="onToggleHideChapter(chapter.IndexId)">隐藏章节</a-doption>
                  </a-dgroup>
                  <a-dgroup title="---------转换---------">
                    <a-doption @click="onSetChapter2Introduction(chapter.IndexId)">设为简介</a-doption>
                  </a-dgroup>
                  <a-dgroup title="---------☆---------">
                    <a-doption @click="onSuspiciousCharsAnalysis(chapter.IndexId)">特殊字符分析</a-doption>
                    <a-doption @click="gotoChapter(chapter.IndexId, true)">阅读</a-doption>
                  </a-dgroup>
                </template>
              </a-dropdown>
            </a-button-group>
            <a-dropdown v-else trigger="contextMenu" alignPoint :style="{ display: 'block' }">
              <a-button long class="chapter">{{ chapter.Title }}</a-button>
              <template #content>
                <a-doption @click="moveToTop(chapter)">移至开头</a-doption>
                <a-doption @click="moveToBottom(chapter)">移至结尾</a-doption>
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

      <ChapterEdit :isShow="isEdit" :bookId="bookId" :chapterId="curChapId" :toMergeChapterId="toMergeChapterId"
        @close="isEdit = false" @reload="reloadBook" />
      <SplitTool v-model:model-value="isSplit" :id="splitId" :bookId="bookId" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Book } from "@/types/book";
import type { HttpResponse } from "@/types/global";
import { ApiResultCode } from "@/types/global";
import Sortable from 'sortablejs';

import { ref, nextTick } from "vue";
import {
  queryBookById,
  updateChapterOrder,
  deleteChapter,
  chapter2Introduction,
} from '@/api/book';

//组件
import { Message, } from '@arco-design/web-vue';
import BookInfo from "@/components/book-info/index.vue";
import ChapterList from '@/components/chapter-list/index.vue';
import ChapterEdit from "@/components/chapter/edit.vue";
import Toolbar from "./components/toolbar.vue";
import SplitTool from "./components/SplitTool.vue";

import useBookHelper from '@/hooks/book-helper';
import useChapterHiddenHelper from "@/hooks/chapter-hidden";

const { bookId, gotoChapter } = useBookHelper();
const { toggleChapterHidden } = useChapterHiddenHelper();

const loading = ref(true);
const renderData = ref<Book | null>(null);//完整的 - 书本信息
let maxOrderNum = 0;    //最大章节序号
let toMergeChapterId = ref(0);  //合并章节时用-合并删除的章节

nextTick(() => {
  loading.value = true;
  queryBookById(bookId).then((result: HttpResponse<Book>) => {
    renderData.value = result.data;
  }).finally(() => {
    loading.value = false;
  });
});

const curChapId = ref(0); //要修改的章节
const isEdit = ref(false);
const isSplit = ref(false);
const splitId = ref(0); // 新增响应式变量存储当前分割章节ID
const isOrdering = ref(false);
let sortChapterList = null as any;
const orderList = [] as Array<any>;

/**
 * 点击章节列表-打开修改章节
 * @param cid 修改的章节ID，如果是-1则为新增章节
 */
const onClickChapter = (cid: number) => {
  curChapId.value = cid;
  isEdit.value = true;
  toMergeChapterId.value = 0;
}

/**
 * 打开合并章节窗口
 * @param cid 被合并进的章节ID
 */
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
  toMergeChapterId.value = cidNext;
  curChapId.value = cid;
}

/**
 * 打开分割章节窗口
 * @param cid 被分割的章节ID
 */
const onClickSplit = (cid: number) => {
  isSplit.value = true;
  splitId.value = cid; // 设置当前要分割的章节ID
}

/**
 * 重载当前章节
 */
function reloadBook() {
  queryBookById(bookId).then((result: HttpResponse<Book>) => {
    renderData.value = result.data;
  });
}

/**
 * 删除章节
 * @param cid 章节ID
 */
function onDeleteChapter(cid: number) {
  deleteChapter(cid).then((result: HttpResponse<string>) => {
    if (result.code == ApiResultCode.Success) {
      Message.success("删除成功");
      const index = renderData.value?.Index.findIndex(chap => chap.IndexId === cid);
      if (index !== undefined && index !== -1) {
        renderData.value?.Index.splice(index, 1);
      }
    } else Message.error("删除失败：" + result.msg)
  }).catch(err => {
    Message.error("删除出错：" + err);
  })
}

/**
 * 设置隐藏/显示章节
 * @param cid 章节ID
 */
function onToggleHideChapter(cid: number) {
  toggleChapterHidden(cid, true).then((result: any) => {
    const index = renderData.value?.Index.findIndex(chap => chap.IndexId === cid);
    if (index !== undefined && index !== -1) {
      renderData.value?.Index.splice(index, 1);
    }
  })
}

/**
 * 把一个章节改为简介
 * @param cid 章节ID
 */
function onSetChapter2Introduction(cid: number) {
  chapter2Introduction(cid).then((result: HttpResponse<boolean>) => {
    if (result.code == ApiResultCode.Success) {
      Message.success("已设为简介");
      const index = renderData.value?.Index.findIndex(chap => chap.IndexId === cid);
      if (index !== undefined && index !== -1) {
        renderData.value?.Index.splice(index, 1);
      }
    } else Message.error("设为简介失败：" + result.msg)
  }).catch(err => {
    Message.error("设为简介出错：" + err);
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
      queryBookById(bookId).then((result: HttpResponse<Book>) => {
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

function onSuspiciousCharsAnalysis(chapterId?: number) {
  if (!bookId) {
    Message.error('未找到书籍信息');
    return;
  }
  
  // 构建URL参数
  const params = new URLSearchParams();
  params.append('bookId', bookId.toString());
  
  if (chapterId) {
    params.append('chapterIds', chapterId.toString());
  }
  
  // 在新标签页打开特殊字符分析页面
  window.open(`/workplace/suspiciouschars?${params.toString()}`, '_blank');
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