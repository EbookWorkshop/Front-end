<template>
  <div class="container">
    <Breadcrumb :items="['menu.library', 'menu.workshop.webbook', bookData.BookName]" />
    <div class="wrapper">
      <a-spin :loading="loading" tip="加载中..." :size="64" style="width: 100%; height: 100%">
        <BookInfo :loading="loading" :bookId="bookId" :BookName="bookData.BookName" :convertImg="bookData.CoverImg"
          :Author="bookData.Author" :Introduction="bookData.Introduction">
          <template #toolbar>
            <Toolbar :bookid="bookData.BookId" :book-name="bookData.BookName" :ChapterStatus="hasCheckChapter"
              :Volumes="bookData.Volumes" :loading="loading || autoSyncSetting" :Chapters="bookData.Index" :-bookmark="bookData.Bookmark"
              v-model:AutoSyncEnabled="autoSyncEnabled" @toggle-check="onToggleToolbar"
              @update:AutoSyncEnabled="handleAutoSyncChange"
              @start-update-chapter="(rsl: any) => { isShowProcess = true; subscribeBook(bookId) }" />
          </template>
        </BookInfo>
        <a-divider />
        <ChapterList :loading="loading" :Chapters="chapterList" :Volumes="bookData.Volumes">
          <template #chapter="{ chapter }">
            <ChapterOpt :chapter="chapter as WebChapter" :checked="hasCheckChapter.get(chapter.IndexId) || false"
              :status="(chapter as any).status || (chapter.IsHasContent ? 'normal' : 'empty')" @toggle="OnToggleChapter"
              @hide="onHideChapter" />
          </template>
        </ChapterList>
        <div style="display: flex;justify-content: center;">
          <a-spin dot v-if="rendering" />
        </div>
      </a-spin>
    </div>
    <a-affix :offsetBottom="28" v-if="isShowProcess"><ProcessBar :status="processStatus"/></a-affix>
  </div>
</template>

<script lang="ts" setup>
//类型引入
import type { Book, WebChapter } from '@/types/book';
import { WebBookStatus } from './data'
import type { OneChapterStatus } from './data'
import { messageService } from '@/services/messageService';
import type { MessageRecord } from '@/types/Message';

import { ref, nextTick, onMounted, onUnmounted } from 'vue';
import useRequest from '@/hooks/request';
import useBookHelper from '@/hooks/book-helper';
import { useSocket } from '@/hooks/socket';

//控件
import BookInfo from '@/components/book-info/index.vue';
import Toolbar from './components/toolbar.vue';
import ChapterList from '@/components/chapter-list/index.vue';
import ChapterOpt from './components/chapter-opt.vue';
import ProcessBar from './components/processbar.vue';

import { queryWebBookById, setAutoSyncEnabled } from '@/api/book';


//变量定义
const isShowProcess = ref(false);
const processStatus = ref({ total: 0, done: 0, success: 0, fail: 0, percent: 0 })
const hasCheckChapter = ref(new Map<number, boolean>()); // 仅存储选中状态
const chapterList = ref<WebChapter[]>([]);//展示用的章节数据
const autoSyncEnabled = ref<boolean>(false);//自动更新相关
const autoSyncSetting = ref<boolean>(true);//自动更新状态
const rendering = ref(true);

//数据请求
const queryBook = () => {
  return queryWebBookById(bookId).then((result: any) => {
    // chapterList.value = result.data.Index;
    let { data: webbook } = result;
    webBookId.value = webbook.WebBookId;
    autoSyncEnabled.value = webbook.AutoSyncEnabled;
    // 每个章节对象扩展一个 status 字段（也可以单独维护，但直接添加属性更简单）
    const indexedChapters = webbook.Index.map((c: any) => {
      // 如果已有状态则保留，否则根据 IsHasContent 设置默认
      (c as any).status = (c as any).status || (c.IsHasContent ? 'normal' : 'empty');
      return c;
    });
    autoSyncSetting.value = false;

    const batnum = 60;
    let cur = 0;
    const batchInit = () => {
      const curBat = indexedChapters.slice(cur, cur + batnum);
      chapterList.value.push(...curBat);
      cur += batnum;
      if (indexedChapters.length >= cur) setTimeout(batchInit, 300);
      else rendering.value = false;
    }
    batchInit();

    return result;
  });
};

const { bookId, gotoChapter } = useBookHelper();
const { loading, response: bookData } = useRequest<Book>(queryBook);
const { io: socket, on: socketOn, off: socketOff } = useSocket();
const webBookId = ref<number>(-1);  //网文书ID，注意与bookId不同

function subscribeBook(bookId: number) { socket.emit('subscribe:book', bookId); }
function unsubscribeBook(bookId: number) { socket.emit('unsubscribe:book', bookId); }

//操作定义
/**
 * 操作按钮选中切换
 * ## 信号由 【章节按钮】 发送出
 * @param isChecked 是否选中
 * @param chapterId 章节id
 */
function OnToggleChapter(isChecked: boolean, chapterId: number) {
  hasCheckChapter.value.set(chapterId, isChecked);
}

function onHideChapter(chapterId: number) {
  //console.log(`隐藏章节：${chapterId}`);
  const index = chapterList.value.findIndex(chap => chap.IndexId === chapterId);
  if (index !== -1) {
    chapterList.value.splice(index, 1);
  }
}

/**
 * 接收章节选中信号的切换
 * 按信号设置章节按钮的选中状态
 * ## 信号由 【工具栏】 发送出
 * @param chapterId 章节ID
 * @param isChecked 是否已选中
 */
function onToggleToolbar(chapterId: number, isChecked: boolean) {
  hasCheckChapter.value.set(chapterId, isChecked);
}

function handleAutoSyncChange(newValue: boolean) {
  autoSyncSetting.value = true;
  setAutoSyncEnabled(bookId, newValue).finally(() => autoSyncSetting.value = false);
}


// 监听广播消息
const eventHandlers = {
  [WebBookStatus.Start]: ({ bookId, chapterId }: { bookId: number, chapterId: number }) => {
    // if (!isShowProcess.value) isShowProcess.value = true;
    const target = chapterList.value.find(c => c.IndexId === chapterId);
    if (target) (target as any).status = 'processing';
  },
  [WebBookStatus.Error]: ({   //章节更新错误
    bookId: _bookid,    //出错的书ID
    chapterId,          //出错的章节ID
    err,                //错误信息
    msgId
  }: OneChapterStatus) => {
    const target = chapterList.value.find(c => c.IndexId === chapterId);
    if (target) {
      (target as any).status = 'error';
    }

    // 使用消息服务添加错误消息
    const errInfo: MessageRecord = {
      id: msgId || (Date.now() * -1),
      type: "message",
      title: `《${bookData.value?.BookName}》获取章节出错：${err?.name || ""}`,
      subTitle: `章节-${target?.Title || ''}`,
      content: err?.message || "未知错误",
      time: new Date().toLocaleString(),
      status: 0,
      avatar: "error",
      error: err,
    };
    messageService.addMessage(errInfo);
  },
  [WebBookStatus.Success]: (chaptOne: OneChapterStatus) => {
    const target = chapterList.value.find(c => c.IndexId === chaptOne.chapterId);
    if (target) {
      target.IsHasContent = true;
      (target as any).status = 'success';
    }
  },
  [WebBookStatus.AllSuccess]: ({ batchId, bookId, bookName, chapterIds, doneNum, failNum, total, status }: any) => {
    nextTick(() => {
      isShowProcess.value = false;
    });
  },
  [WebBookStatus.Update]: ({ batchId, bookId, bookName, total, done, success, fail, percent, status }: any) => {
    if (!isShowProcess.value) isShowProcess.value = true;
    // console.log(batchId, bookId, bookName, total, done, success, fail, percent, status)
    // barPercent.value = percent / 100;
    processStatus.value = { total, done, success, fail, percent: percent / 100 }
  }
};

onMounted(() => {
  subscribeBook(bookId);
  Object.entries(eventHandlers).forEach(([event, handler]) => {
    socketOn(event, handler);
  });
});

onUnmounted(() => {
  unsubscribeBook(bookId);
  Object.entries(eventHandlers).forEach(([event, handler]) => {
    socketOff(event, handler);
  });

});

</script>

<style scoped lang="less"></style>