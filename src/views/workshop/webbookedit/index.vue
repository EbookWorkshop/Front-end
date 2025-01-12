<template>
  <div class="container">
    <Breadcrumb :items="['menu.library', 'menu.workshop.webbook',bookData.BookName]" />
    <div class="wrapper">
      <!-- <ProcessBar :bookid="bookId" :begin-percent="curDoingProcent" /> -->
      <a-spin :loading="loading" tip="加载中..." :size="64" style="width: 100%; height: 100%">
        <BookInfo :loading="loading" :bookId="bookId" :BookName="bookData.BookName" :convertImg="bookData.CoverImg"
          :Author="bookData.Author">
          <template #toolbar>
            <Toolbar :bookid="bookData.BookId" :Chapters="bookData.Index" :has-checked-num="chapterHasCheckedNum" @check-all="onCheckAll"
              @check-empty="onCheckEmpty" @check-not-empty="onCheckNotEmpty" @set-chapter="onSetChapter"></Toolbar>
          </template>
        </BookInfo>

        <ChapterList :loading="loading" :Chapters="bookData.Index">
          <template #content="{ item }">
            <ChapterOpt :chapter="item" @toggle="OnToggle" :ref="chapterRefMap.get(item.IndexId)" />
          </template>
        </ChapterList>
      </a-spin>
    </div>
  </div>
</template>

<script lang="ts" setup>
//类型引入
import { Book, BookSources, Chapter } from '@/types/book';

import { ref } from 'vue';
import useRequest from '@/hooks/request';
import useBookHelper from '@/hooks/book-helper';

//控件
import BookInfo from '@/components/book-info/index.vue';
import Toolbar from './components/toolbar.vue';
import ChapterList from '@/components/chapter-list/index.vue';
import ChapterOpt from './components/chapter-opt.vue';

import { queryBookById, } from '@/api/book';
import { Message } from '@arco-design/web-vue';



//变量定义
const chapterHasCheckedNum = ref(0);    // 已选中的章节数
const curDoingProcent = ref(-1);        //进度条状态
const hasCheckChapter = new Map();      //已选中的章节
const chapterRefMap = new Map();        //所有章节控件的引用

//数据请求
const queryBook = () => {
  curDoingProcent.value = -1;
  return queryBookById(bookId).then((rsl: any) => {
    new Promise((ok: any) => {
      ok();
    }).then(() => {
      // InitEditModelOption(rsl.data);
      rsl.data.Index.forEach((iCpt: Chapter) => {
        chapterRefMap.set(iCpt.IndexId, ref(null));
      })
    });
    return rsl;
  });
};
const { bookId } = useBookHelper();
const { loading, response: bookData } = useRequest<Book>(queryBook);



//操作定义
/**
 * 操作按钮选中切换
 * @param isChecked 是否选中
 * @param chapterId 章节id
 */
function OnToggle(isChecked: boolean, chapterId: number) {
  chapterHasCheckedNum.value += (isChecked ? 1 : -1);
  Message.info(`已选中的章节数量：${chapterHasCheckedNum.value}`);
  hasCheckChapter.set(chapterId, isChecked);
}

/**
 * 全选
 */
function onCheckAll() {
  chapterHasCheckedNum.value = 0;
  bookData.value.Index.forEach(c => {
    hasCheckChapter.set(c.IndexId, true);
    chapterHasCheckedNum.value++;

    chapterRefMap.get(c.IndexId).value.handleCheckIt(true);
  });
}

/**
 * 选空章节
 */
function onCheckEmpty() {
  chapterHasCheckedNum.value = 0;
  bookData.value.Index.forEach(c => {
    let ctrl = chapterRefMap.get(c.IndexId);
    if (c.IsHasContent) {
      ctrl.value.handleCheckIt(false);
      return;
    }
    hasCheckChapter.set(c.IndexId, true);
    chapterHasCheckedNum.value++;

    ctrl.value.handleCheckIt(true);
  });
}
/**
 * 选非空章节
 */
function onCheckNotEmpty() {
  chapterHasCheckedNum.value = 0;
  bookData.value.Index.forEach(c => {
    let ctrl = chapterRefMap.get(c.IndexId);
    if (!c.IsHasContent) {
      ctrl.value.handleCheckIt(false);
      return;
    }
    hasCheckChapter.set(c.IndexId, true);
    chapterHasCheckedNum.value++;

    ctrl.value.handleCheckIt(true);
  });
}

/**
 * 设置范围内的章节为选中
 * @param setResult 需要选中的章节范围
 */
function onSetChapter(setResult: Number[]) {
  if(chapterHasCheckedNum.value != 0) console.warn("已有选中章节，这会导致最终选中章节统计结果有误。")
  chapterHasCheckedNum.value = 0;
  //如果已有选中章节在这个范围内，将会导致选中章节统计数据出错
  let chpUnfind = setResult.map(i => {
    let ctrl = chapterRefMap.get(i);
    if (!ctrl) return i;
    ctrl.value.handleCheckIt(true);
    chapterHasCheckedNum.value++;
  });
}

</script>

<style scoped lang="less"></style>