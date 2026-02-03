<template>
  <div class="container">
    <Breadcrumb :items="['menu.library', 'menu.workshop.webbook', bookData.BookName]" />
    <div class="wrapper">
      <ProcessBar :bookid="bookId" :begin-percent="curDoingProcent" />
      <a-spin :loading="loading" tip="加载中..." :size="64" style="width: 100%; height: 100%">
        <BookInfo :loading="loading" :bookId="bookId" :BookName="bookData.BookName" :convertImg="bookData.CoverImg"
          :Author="bookData.Author" :Introduction="bookData.Introduction">
          <template #toolbar>
            <Toolbar :bookid="bookData.BookId" :ChapterStatus="hasCheckChapter" :Volumes="bookData.Volumes" :Chapters="bookData.Index"
              :ChapterOptMap="chapterRefMap" @toggle-check="onToggleToolbar"
              @start-update-chapter="(rsl: any) => curDoingProcent = rsl" ref="toolbarRef"></Toolbar>
          </template>
        </BookInfo>
        <a-divider />
        <ChapterList :loading="loading" :Chapters="bookData.Index" :Volumes="bookData.Volumes">
          <template #chapter="{ chapter }">
            <ChapterOpt :chapter="chapter as WebChapter" @toggle="OnToggleChapter"
              :ref="chapterRefMap.get(chapter.IndexId)" @hide="onHideChapter(chapter.IndexId)" />
          </template>
        </ChapterList>
      </a-spin>
    </div>
  </div>
</template>

<script lang="ts" setup>
//类型引入
import type { Book, WebChapter } from '@/types/book';
import { WebBookStatus } from './data'
import type { OneChapterStatus } from './data'
import { useMessageService } from '@/services/messageService';
import type { MessageRecord } from '@/types/Message';

import { ref, reactive, nextTick } from 'vue';
import useRequest from '@/hooks/request';
import useBookHelper from '@/hooks/book-helper';
import { useSocket } from '@/hooks/socket';

//控件
import BookInfo from '@/components/book-info/index.vue';
import Toolbar from './components/toolbar.vue';
import ChapterList from '@/components/chapter-list/index.vue';
import ChapterOpt from './components/chapter-opt.vue';
import ProcessBar from './components/processbar.vue';
import { Notification } from '@arco-design/web-vue';

import { queryWebBookById, } from '@/api/book';


//变量定义
const curDoingProcent = ref(-1);        //进度条状态
const hasCheckChapter = reactive(new Map());      //已选中的章节
const chapterRefMap = reactive(new Map());        //所有章节控件的引用
const toolbarRef = ref<any>(null);       //工具栏对象

//数据请求
const queryBook = () => {
  curDoingProcent.value = -1;
  return queryWebBookById(bookId).then((rsl: any) => {
    new Promise((ok: any) => {
      ok();
    }).then(() => {
      rsl.data.Index.forEach((iCpt: WebChapter) => {
        // console.log(iCpt);
        chapterRefMap.set(iCpt.IndexId, ref(null));
      })
    });
    return rsl;
  });
};
const { bookId } = useBookHelper();
const { loading, response: bookData } = useRequest<Book>(queryBook);
const { io: socket, on: socketOn } = useSocket();
const messageService = useMessageService();

//操作定义
/**
 * 操作按钮选中切换
 * ## 信号由 【章节按钮】 发送出
 * @param isChecked 是否选中
 * @param chapterId 章节id
 */
function OnToggleChapter(isChecked: boolean, chapterId: number) {
  hasCheckChapter.set(chapterId, isChecked);
  toolbarRef.value.updateChecked();
}

function onHideChapter(chapterId: number) {
  //console.log(`隐藏章节：${chapterId}`);
  const index = bookData.value?.Index.findIndex(chap => chap.IndexId === chapterId);
  if (index !== undefined && index !== -1) {
    bookData.value?.Index.splice(index, 1);
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
  hasCheckChapter.set(chapterId, isChecked);
  chapterRefMap.get(chapterId).value.handleCheckIt(isChecked);
}


// 监听广播消息
if (socket.listeners(WebBookStatus.Error + `.${bookId}`).length === 0) {    //防止重复监听
  socketOn(WebBookStatus.Error + `.${bookId}`, ({   //章节更新错误
    bookid: _bookid,    //出错的书ID
    chapterId,          //出错的章节ID
    err,                //错误信息
  }: OneChapterStatus) => {
    const curChapter = chapterRefMap.get(chapterId);
    if (!curChapter) return;
    curChapter.value.handleChangeStatus("danger");

    Notification.error({
      title: `获取章节出错：${err?.name || ""}`,
      content: `章节-${curChapter.value.getTitle()}：${err?.message || "未知错误"}`,
      showIcon: true,
    });

    // 使用消息服务添加错误消息
    const errInfo: MessageRecord = {
      id: -1,
      type: "message",
      title: `《${bookData.value?.BookName}》获取章节出错：${err?.name || ""}`,
      subTitle: `章节-${curChapter.value.getTitle()}`,
      content: err?.message || "未知错误",
      time: new Date().toJSON().replace(/[A-Za-z]/g, ' '),
      status: 1,
      avatar: "error",
    };
    messageService.addMessage(errInfo);
  });

  // 单一章节更新成功
  socketOn(WebBookStatus.Success + `.${bookId}`, (chaptOne: OneChapterStatus) => {
    const curChapter = chapterRefMap.get(chaptOne.chapterId);
    if (!curChapter) return;
    let thisCpt = bookData.value.Index.filter(c => c.IndexId == chaptOne.chapterId);
    if (thisCpt.length > 0) thisCpt[0].IsHasContent = true;
    curChapter.value.handleChangeStatus("success");
  });

  // 全部任务完成 - 保留页面特定的处理逻辑
  socketOn(WebBookStatus.AllSuccess + `.${bookId}`, ({ bookid: _bookid, chapterIndexArray, doneNum, failNum }): any => {
    Notification.success({
      title: `已尝试任务${chapterIndexArray.length}个`,
      content: `其中成功：${doneNum}，失败：${failNum}`,
      showIcon: true,
      duration: 0,
      closable: true,
    });
    nextTick(() => {
      curDoingProcent.value = -1;
    });

    // 同时将完成消息添加到消息服务
    messageService.addMessage({
      id: -1,
      type: "message",
      title: `《${bookData.value?.BookName}》已尝试任务${chapterIndexArray.length}个`,
      subTitle: `成功：${doneNum}，失败：${failNum}`,
      content: `成功率：${Math.round(doneNum / chapterIndexArray.length * 10000) / 100}%`,
      time: new Date().toJSON().replace(/[A-Za-z]/g, ' '),
      status: 1,
      avatar: "info",
    });
  });
}
</script>

<style scoped lang="less"></style>