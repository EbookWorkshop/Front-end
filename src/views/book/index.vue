<template>
  <div class="container">
    <Breadcrumb :items="['menu.library', 'menu.library.list']" />
    <div id="baseWrap" class="wrapper">
      <ProcessBar :bookid="bookId" :begin-percent="curDoingProcent" />
      <a-spin :loading="loading" tip="加载中..." :size="64" style="width: 100%; height: 100%">
        <a-row :gutter="20" align="stretch" justify="center">
          <a-col :span="2"></a-col>
          <a-col :span="3">
            <BookCover :loading="loading" :book-name="renderData.BookName" :cover-img="renderData.CoverImg"></BookCover>
          </a-col>
          <a-col :span="14" :offset="1">
            <a-row :gutter="20" align="center" justify="center">
              <a-col :span="22" style="margin-top: 50px; text-align: left">
                <a-typography-title>
                  {{ renderData.BookName }}</a-typography-title>
              </a-col>
              <a-col :span="14"> </a-col>
            </a-row>
            <a-row>
              <!-- 书详情页面 -->
              <a-col :offset="2">
                <a-typography-text>作者：{{ renderData.Author }}</a-typography-text>
              </a-col>
              <a-col :offset="2">
                <a-typography-text>简介：</a-typography-text>
              </a-col>
              <a-col>&nbsp;</a-col>
            </a-row>
            <template v-if="isEdit">
              <!-- 管理按钮 -->
              <a-row justify="start">
                <a-col>
                  <a-space wrap>
                    <a-select :style="{ width: '160px' }" placeholder="数据来源"
                      :trigger-props="{ autoFitPopupMinWidth: true }">
                      <a-option v-for="s of bookSourcesData" :key="s.Path as string" @click="open(s.Path as string)">{{
                        s.Path }}</a-option>
                    </a-select>
                    <a-button type="primary" size="large" @click="mergeIndex">
                      <icon-loop />同步目录
                    </a-button>

                    <a-badge :max-count="20000" :count="chapterHasCheckedNum">
                      <a-dropdown-button type="primary" size="large" status="warning" style="align-items: stretch"
                        @click="checkEmptyChapter">
                        选中空章节
                        <template #icon>
                          <icon-down />
                        </template>
                        <template #content>
                          <a-doption @click="checkAllChapter">选中全部章节</a-doption>
                          <a-doption @click="cleanAllChapter">清空已选</a-doption>
                          <a-doption @click="checkAllChapterAfterFirstChecked">已选章节后续全选中</a-doption>
                          <a-doption @click="checkNextChapter(10,1)">选中已选章节后续10个</a-doption>
                          <a-doption @click="checkNextChapter(20,1)">选中已选章节后续20个</a-doption>
                          <a-doption @click="checkNextChapter(100,1)">选中已选章节后续100个</a-doption>
                          <a-doption @click="checkNextChapter(10,2)">选中空章节后续10个</a-doption>
                          <a-doption @click="checkNextChapter(20,2)">选中空章节后续20个</a-doption>
                        </template>
                      </a-dropdown-button>
                    </a-badge>

                    <a-dropdown trigger="hover">
                      <a-button type="primary" size="large" status="success" @click="goToGetAllChapter(false)">
                        <icon-robot-add />获取选中章节内容
                      </a-button>
                      <template #content>
                        <a-doption @click="goToGetAllChapter(true)">获取选中章节内容(强制更新)</a-doption>
                        <a-doption>删除选中章节TODO</a-doption>
                      </template>
                    </a-dropdown>

                    <a-button size="large">
                      <icon-ordered-list />章节排序
                    </a-button>
                  </a-space>
                </a-col>
              </a-row>
              <a-row justify="start">
                <a-col>
                  <a-button type="outline" size="large" @click="goToSendSelectedChapter">
                    <icon-mobile />发送到默认邮箱账户
                  </a-button>
                </a-col>
              </a-row>
            </template>
          </a-col>
        </a-row>
        <a-row class="grid-chapter" style="margin-bottom: 16px">
          <a-col :span="20" :offset="2">
            <!-- loading用的骨架页 -->
            <a-row v-if="loading" :gutter="10">
              <a-col v-for="i in [1, 2, 3, 4, 5, 6]" :key="i" :span="4">
                <a-skeleton :animation="loading">
                  <a-skeleton-line :rows="8" :line-height="48" :line-spacing="10" />
                </a-skeleton>
              </a-col>
            </a-row>

            <a-grid :cols="{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }" :col-gap="12" :row-gap="16"
              class="grid-demo-grid">
              <template v-if="!isEdit">
                <!-- 阅读视图 阅读时的章节列表 -->
                <a-grid-item v-for="item in renderData.Index" :key="item.IndexId" class="reading-index">
                  <a-tooltip :content="item.Title">
                    <a-button long :disabled="!item.IsHasContent" class="chapter" @click="gotoChapter(item.IndexId)">
                      {{ item.Title }}
                    </a-button>
                  </a-tooltip>
                </a-grid-item>
              </template>
              <template v-else>
                <!-- 编辑视图 编辑功能时的章节列表 -->
                <a-grid-item v-for="item in renderData.Index" :key="item.IndexId" class="edit-index">
                  <a-button-group style="align-items: stretch; width: 100%" :status="indexOptionMap.get(item.IndexId)?.isError
                      ? 'danger'
                      : item.IsHasContent ||
                        indexOptionMap.get(item.IndexId)?.isHasContent
                        ? 'normal'
                        : 'warning'
                    " :title="item.Title">
                    <a-button long type="dashed" class="chapter" @click="changeChapterIsCheck(item.IndexId)">
                      <a-checkbox :model-value="indexOptionMap.get(item.IndexId)?.isCheck">
                        {{ item.Title }}
                      </a-checkbox>
                    </a-button>

                    <a-button type="dashed" size="large" style="height: unset !important"
                      @click="showeditmenu(item.IndexId)">
                      <template #icon>
                        <icon-settings />
                      </template>
                    </a-button>
                  </a-button-group>
                </a-grid-item>
              </template>
            </a-grid>
          </a-col>
        </a-row>
      </a-spin>
      <a-back-top target-container="#baseWrap" :style="{ position: 'absolute' }" /><!-- TODO: 返回页面顶端 暂时没生效 -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { Message, Modal, Notification } from '@arco-design/web-vue';
import { Book,BookSources } from '@/types/book';
import {
  queryBookById,
  updateChapter,
  createPDF,
  mergeWebBookIndex,
  queryBookSourcesById,
} from '@/api/book';
import useRequest from '@/hooks/request';
import useSocket from '@/hooks/socket';
import useBookHelper from '@/hooks/book-helper';

import BookCover from '@/components/book-cover/index.vue';
import ProcessBar from './components/processbar.vue';

/**
 * 章节状态
 */
interface ChapterStatus {
  /**
   * 是否已选
   */
  isCheck: boolean;
  /**
   * 是否已有正文
   */
  isHasContent: boolean;
  /**
   * 是否更新失败了
   */
  isError: boolean;
}

// 已选中的章节数
const chapterHasCheckedNum = ref(0);
// 是否显示进度条
const curDoingProcent = ref(-1);

// 章节选项数据对象
const indexOptionMap: Map<number, ChapterStatus> = reactive(new Map());

const { bookId, isEdit, gotoChapter, gotoIndex } = useBookHelper();

/**
 * 合并当前章节
 * @param bookid
 */
function mergeIndex() {
  return mergeWebBookIndex(bookId)
    .then((result) => {
      Message.success('已启动章节更新合并');
      console.log(result);
    })
    .catch((err) => Message.error(`合并、更新章节失败${err}`));
}

/**
 * 编辑模式下页面的细节选项
 * [TODO]: 这玩意加上之后渲染明显变慢了
 * @param data
 */
function InitEditModelOption(data: Book) {
  data.Index.map((i) => {
    const temOption: ChapterStatus = {
      // indexId: i.IndexId,
      isCheck: false,
      isHasContent: i.IsHasContent || false,
      isError: false,
    };
    indexOptionMap.set(i.IndexId, temOption);
    return i;
  });
}

/**
 * 实际爬章节
 * @param curBookId 当前书ID
 * @param chapterIds 需要爬的章节ID
 * @param isUpdate 启用强制更新
 */
function GetChapterContent(
  curBookId: number,
  chapterIds: number[],
  isUpdate = false
) {
  return updateChapter(curBookId, chapterIds, isUpdate)
    .then((result) => {
      curDoingProcent.value = 0; // 使进度条显示
      indexOptionMap.forEach((i: ChapterStatus) => {
        i.isError = false;
      });
    })
    .catch((err) => {
      Message.error(`获取章节失败：${err}`);
    });
}

// 每一个章节是否选中时触发
const changeChapterIsCheck = (cIndex: number) => {
  const cStatus = indexOptionMap.get(cIndex) || ({} as ChapterStatus);
  chapterHasCheckedNum.value += !cStatus.isCheck ? 1 : -1;
  cStatus.isCheck = !cStatus.isCheck;
  return true;
};

const queryBook = () => {
  return queryBookById(bookId).then((rsl: any) => {
    if (isEdit) {
      new Promise((ok: any) => {
        ok();
      }).then(() => {
        InitEditModelOption(rsl.data);
      });
    }
    return rsl;
  });
};

const { loading, response: renderData } = useRequest<Book>(queryBook);
const { response: bookSourcesData } = useRequest<BookSources[]>(() => {
  return queryBookSourcesById(bookId);
});

const showeditmenu = (chapterId: number) => { };

// 选中所有空章节
const checkEmptyChapter = (ev: PointerEvent) => {
  let count = 0;
  indexOptionMap.forEach((i: ChapterStatus) => {
    if (i.isHasContent) return;
    i.isCheck = true;
    count += 1;
  });
  chapterHasCheckedNum.value = count;
};

// 选中所有章节
const checkAllChapter = () => {
  indexOptionMap.forEach((i: ChapterStatus) => {
    i.isCheck = true;
  });
  chapterHasCheckedNum.value = indexOptionMap.size;
};
// 清空所有章节
const cleanAllChapter = () => {
  indexOptionMap.forEach((i: ChapterStatus) => {
    i.isCheck = false;
  });
  chapterHasCheckedNum.value = 0;
};
// 从第一个选中的章节开始全部选中
const checkAllChapterAfterFirstChecked = () => {
  let hasMeet = false;
  let count = chapterHasCheckedNum.value;
  indexOptionMap.forEach((i: ChapterStatus) => {
    if (hasMeet) {
      i.isCheck = true;
      count++;
    } else if (i.isCheck === true) {
      hasMeet = true;
    }
  });
  if (!hasMeet) Message.warning('请先选择一个用于锚记开始的章节！');
  chapterHasCheckedNum.value = count;
};
/**
 * 
 * @param num 数量
 * @param type 选中模式/空章节模式
 */
const checkNextChapter = (num: number, type: number) => {
  let hasMeet = false;
  let count = 0;
  indexOptionMap.forEach((i: ChapterStatus) => {
    if (count >= num) return;
    if (hasMeet && i.isHasContent === false) {
      i.isCheck = true;
      count++;
    } else if ((i.isCheck === true && type === 1) || (i.isHasContent === false && type === 2)) {
      hasMeet = true;
      if (!i.isCheck) {
        i.isCheck = true;
        count++;
      }
    }
  });
  if (!hasMeet) Message.warning('没有合适的章节，请检查。');
  chapterHasCheckedNum.value = count;
};

// 开始爬选中的章节
const goToGetAllChapter = (isUpdate = false) => {
  curDoingProcent.value = 0;
  const chapterOnCheck: number[] = [];
  indexOptionMap.forEach((i: any, key: any) => {
    if (i.isCheck) chapterOnCheck.push(key);
  });
  if (chapterOnCheck.length !== 0)
    Message.loading(`已选中${chapterOnCheck.length}章，正在开始尝试获取。`);
  else
    Message.error(`没选中任何章节，请先勾选需要选获取的章节，然后再开始。`);

  GetChapterContent(bookId, chapterOnCheck, isUpdate);
};

// 通过socket更新进度
const { io: socket } = useSocket();
socket.on(
  'WebBook.UpdateOneChapter.Error',
  ({
    bookid: _bookid,
    chapterId,
    err,
  }: {
    bookid: number;
    chapterId: number;
    err: Error;
  }) => {
    if (bookId !== _bookid) return;
    const cStatus = indexOptionMap.get(chapterId) ?? ({} as ChapterStatus);
    cStatus.isError = true;
    const cInfo = renderData.value.Index.filter(
      (i) => i.IndexId === chapterId
    )[0] ?? { Title: '' };
    Notification.error({
      title: err.name,
      content: `${cInfo.Title}：${err.message}`,
      showIcon: true,
    });
  }
);
socket.on('WebBook.Chapter.Update', ({ bookid: _bookid, chapterId }) => {
  if (bookId !== _bookid) return;
  console.debug('WebBook.Chapter.Update', _bookid, chapterId);
  const cStatus = indexOptionMap.get(chapterId) ?? ({} as ChapterStatus);
  cStatus.isError = false;
  cStatus.isHasContent = true;
});
socket.on(
  'WebBook.UpdateChapter.Finish',
  ({ bookid: _bookid, chapterIndexArray, doneNum, failNum }) => {
    if (bookId !== _bookid) return;
    Notification.success({
      title: `已尝试任务${chapterIndexArray.length}个`,
      content: `其中成功：${doneNum}，失败：${failNum}`,
      showIcon: true,
      duration: 0,
      closable: true,
    });
    curDoingProcent.value = -1;
  }
);

// 爬=>打包=>发到邮箱
const goToSendSelectedChapter = async () => {
  const chapterIsEmpty: number[] = []; // 没内容的章节
  const chapterOnCheck: number[] = []; // 全部已选章节
  indexOptionMap.forEach((i: any, key: any) => {
    if (i.isCheck) {
      if (!i.isHasContent) chapterIsEmpty.push(key);
      chapterOnCheck.push(key);
    }
  });

  if (chapterIsEmpty.length > 0) {
    Message.warning(
      `共${chapterIsEmpty.length}章还没有正文，先尝试获取章节内容。`
    );
    await GetChapterContent(bookId, chapterOnCheck);
  }
  Message.loading(`开始生成PDF`);
  createPDF(bookId, chapterOnCheck, true)
    .then((result) => {
      Message.success(`已通过邮件发送：《${result.data.book.filename}》`);
    })
    .catch((err) => {
      Message.error(`生成PDF的时候出现错误：${err}`);
    });
};

const open = (url: string) => {
  window.open(url);
};
</script>

<style>
.showBord {
  border: 1px solid red;
}

.chapter {
  height: 48px;
  overflow: hidden;
  font-size: 1.2rem;
  text-align: left;
}
</style>
