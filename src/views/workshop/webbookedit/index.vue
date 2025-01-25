<template>
  <div class="container">
    <Breadcrumb :items="['menu.library', 'menu.workshop.webbook', bookData.BookName]" />
    <div class="wrapper">
      <!-- <ProcessBar :bookid="bookId" :begin-percent="curDoingProcent" /> -->
      <a-spin :loading="loading" tip="加载中..." :size="64" style="width: 100%; height: 100%">
        <BookInfo :loading="loading" :bookId="bookId" :BookName="bookData.BookName" :convertImg="bookData.CoverImg"
          :Author="bookData.Author">
          <template #toolbar>
            <Toolbar :bookid="bookData.BookId" :ChapterStatus="hasCheckChapter" :Chapters="bookData.Index"
              :ChapterOptMap="chapterRefMap" @toggle-check="onToggleToolbar"></Toolbar>
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
import type { Book, BookSources, Chapter } from '@/types/book';
import { WebBookStatus } from './data'
import type { OneChapterStatus } from './data'

import { ref, reactive } from 'vue';
import useRequest from '@/hooks/request';
import useBookHelper from '@/hooks/book-helper';
import { useSocket } from '@/hooks/socket';

//控件
import BookInfo from '@/components/book-info/index.vue';
import Toolbar from './components/toolbar.vue';
import ChapterList from '@/components/chapter-list/index.vue';
import ChapterOpt from './components/chapter-opt.vue';
import { Notification } from '@arco-design/web-vue';

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
const { io: socket } = useSocket();

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

/**
 * 接收章节选中信号的切换
 * 按信号设置章节按钮的选中状态
 * @param chapterId 章节ID
 * @param isChecked 是否已选中
 */
function onToggleToolbar(chapterId: number, isChecked: boolean) { chapterRefMap.get(chapterId).value.handleCheckIt(isChecked); }

//接收信息
socket.on(WebBookStatus.Error, ({   //章节更新错误
  bookid: _bookid,    //出错的书ID
  chapterId,          //出错的章节ID
  err,                //错误信息
}: OneChapterStatus) => {
  if (bookId !== _bookid) return;   //不是这本书的
  const curChapter = chapterRefMap.get(chapterId);
  if (!curChapter) return;
  curChapter.status = "error";

  console.log(curChapter);

  Notification.error({
    title: err?.name,
    content: `${curChapter.Title}：${err?.message}`,
    showIcon: true,
  });
});
//单一章节更新成功
socket.on(WebBookStatus.Success, (chaptOne: OneChapterStatus) => {
  if (chaptOne.bookid != bookId) return;
  const curChapter = chapterRefMap.get(chaptOne.chapterId);
  if (!curChapter) return;
  curChapter.status = "success";

});
//全部任务完成
socket.on(WebBookStatus.AllSuccess, ({bookid: _bookid, chapterIndexArray, doneNum, failNum}):any => {
  if (bookId !== _bookid) return;
  Notification.success({
    title: `已尝试任务${chapterIndexArray.length}个`,
    content: `其中成功：${doneNum}，失败：${failNum}`,
    showIcon: true,
    duration: 0,
    closable: true,
  });
});

</script>

<style scoped lang="less"></style>