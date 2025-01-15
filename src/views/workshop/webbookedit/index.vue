<template>
  <div class="container">
    <Breadcrumb :items="['menu.library', 'menu.workshop.webbook', bookData.BookName]" />
    <div class="wrapper">
      <!-- <ProcessBar :bookid="bookId" :begin-percent="curDoingProcent" /> -->
      <a-spin :loading="loading" tip="加载中..." :size="64" style="width: 100%; height: 100%">
        <BookInfo :loading="loading" :bookId="bookId" :BookName="bookData.BookName" :convertImg="bookData.CoverImg"
          :Author="bookData.Author">
          <template #toolbar>
            <Toolbar :bookid="bookData.BookId" :ChapterStatus="hasCheckChapter" :Chapters="bookData.Index" :ChapterOptMap="chapterRefMap"
              @toggle-check="onToggleToolbar"></Toolbar>
          </template>
        </BookInfo>

        <ChapterList :loading="loading" :Chapters="bookData.Index">
          <template #content="{ item }">
            <ChapterOpt :chapter="item" @toggle="OnToggleChapter" :ref="chapterRefMap.get(item.IndexId)" />
          </template>
        </ChapterList>
      </a-spin>
    </div>
  </div>
</template>

<script lang="ts" setup>
//类型引入
import { Book, BookSources, Chapter } from '@/types/book';

import { ref, reactive } from 'vue';
import useRequest from '@/hooks/request';
import useBookHelper from '@/hooks/book-helper';

//控件
import BookInfo from '@/components/book-info/index.vue';
import Toolbar from './components/toolbar.vue';
import ChapterList from '@/components/chapter-list/index.vue';
import ChapterOpt from './components/chapter-opt.vue';

import { queryBookById, } from '@/api/book';



//变量定义
const curDoingProcent = ref(-1);        //进度条状态
const hasCheckChapter = reactive(new Map());      //已选中的章节
const chapterRefMap = reactive(new Map());        //所有章节控件的引用

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
function OnToggleChapter(isChecked: boolean, chapterId: number) {
  // chapterHasCheckedNum.value += (isChecked ? 1 : -1);
  // Message.info(`已选中的章节数量：${chapterHasCheckedNum.value}`);
  hasCheckChapter.set(chapterId, isChecked);
}


function onToggleToolbar(chapterId: number, isChecked: boolean) { chapterRefMap.get(chapterId).value.handleCheckIt(isChecked); }

</script>

<style scoped lang="less"></style>