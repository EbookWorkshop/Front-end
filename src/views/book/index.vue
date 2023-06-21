<template>
  <div class="container">
    <Breadcrumb :items="['menu.library', 'menu.library.list']" />
    <div class="wrapper">
      <a-spin
        :loading="loading"
        tip="加载中..."
        :size="64"
        style="width: 100%; height: 100%"
      >
        <a-row :gutter="20" align="stretch" justify="center">
          <a-col :span="2"></a-col>
          <a-col :span="3">
            <BookCover
              :loading="loading"
              :book-name="renderData.BookName"
              :cover-img="renderData.CoverImg"
            ></BookCover>
          </a-col>
          <a-col :span="14" :offset="1">
            <a-row :gutter="20" align="center" justify="center">
              <a-col :span="10" style="margin-top: 50px; text-align: center">
                <a-typography-title>
                  {{ renderData.BookName }}</a-typography-title
                >
              </a-col>
              <a-col :span="14"> </a-col>
            </a-row>
            <a-row>
              <!-- 书详情页面 -->
              <a-col :offset="2">
                <a-typography-text>作者：</a-typography-text>
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
                    <a-select
                      :style="{ width: '160px' }"
                      placeholder="指定其它数据来源"
                      :trigger-props="{ autoFitPopupMinWidth: true }"
                    >
                      <a-option>http://www.qidian.com</a-option>
                    </a-select>
                    <a-button type="primary" size="large" @click="mergeIndex">
                      <icon-loop />同步目录
                    </a-button>

                    <a-badge :max-count="20000" :count="chapterHasCheckedNum">
                      <a-dropdown-button
                        type="primary"
                        size="large"
                        status="warning"
                        style="align-items: stretch"
                      >
                        <a-checkbox
                          value="all-empty"
                          @change="checkEmptyChapter"
                          >选中空章节</a-checkbox
                        >
                        <template #icon>
                          <icon-down />
                        </template>
                        <template #content>
                          <a-doption>选中空章节</a-doption>
                          <a-doption>选中全部章节</a-doption>
                        </template>
                      </a-dropdown-button>
                    </a-badge>

                    <a-button
                      type="primary"
                      size="large"
                      status="success"
                      @click="goToGetAllChapter"
                    >
                      <icon-robot-add />获取选中章节内容
                    </a-button>
                    <a-button size="large">
                      <icon-ordered-list />章节排序
                    </a-button>
                  </a-space>
                </a-col>
              </a-row>
              <a-row justify="start">
                <a-col>
                  <a-button
                    type="outline"
                    size="large"
                    @click="goToSendSelectedChapter"
                  >
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
                  <a-skeleton-line
                    :rows="4"
                    :line-height="48"
                    :line-spacing="10"
                  />
                </a-skeleton>
              </a-col>
            </a-row>

            <a-grid
              :cols="{ xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
              :col-gap="12"
              :row-gap="16"
              class="grid-demo-grid"
            >
              <template v-if="!isEdit">
                <!-- 阅读视图 阅读时的章节列表 -->
                <a-grid-item
                  v-for="item in renderData.Index"
                  :key="item.IndexId"
                  class="reading-index"
                >
                  <a-button
                    long
                    :disabled="!item.IsHasContent"
                    class="chapter"
                    @click="goto(item.IndexId)"
                    >{{ item.Title }}
                  </a-button>
                </a-grid-item>
              </template>
              <template v-else>
                <!-- 编辑视图 编辑功能时的章节列表 -->
                <a-grid-item
                  v-for="item in renderData.Index"
                  :key="item.IndexId"
                  class="edit-index"
                >
                  <a-button-group
                    style="align-items: stretch; width: 100%"
                    :status="item.IsHasContent ? 'normal' : 'warning'"
                    :title="item.Title"
                  >
                    <a-button
                      long
                      type="dashed"
                      class="chapter"
                      @click="changeChapterIsCheck(item.IndexId)"
                    >
                      <a-checkbox
                        :model-value="indexOptionMap.get(item.IndexId)?.isCheck"
                      >
                        {{ item.Title }}
                      </a-checkbox>
                    </a-button>

                    <a-button
                      type="dashed"
                      size="large"
                      style="height: unset !important"
                      @click="showeditmenu(item.IndexId)"
                    >
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
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { Message, Modal } from '@arco-design/web-vue';
  import {
    queryBookById,
    updateChapter,
    createPDF,
    Book,
    Chapter,
    mergeWebBookIndex,
  } from '@/api/book';
  import useRequest from '@/hooks/request';
  import BookCover from '@/components/book-cover/index.vue';
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
  }

  const route = useRoute();
  const router = useRouter();

  // 已选中的章节数
  const chapterHasCheckedNum = ref(0);
  // 章节选项数据对象
  const indexOptionMap = reactive(new Map());

  // 是否编辑模式
  const isEdit = route.path.includes('/bookedit/');
  // 当前书的ID
  const bookid = Number(route.params.id);

  /**
   * 合并当前章节
   * @param bookid
   */
  function mergeIndex() {
    return mergeWebBookIndex(bookid)
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
      const temOption = {
        // indexId: i.IndexId,
        isCheck: false,
        isHasContent: i.IsHasContent,
      };
      indexOptionMap.set(i.IndexId, temOption);
      return i;
    });
  }

  /**
   * 实际爬章节
   * @param curBookId 当前书ID
   * @param chapterIds 需要爬的章节ID
   */
  function GetChapterContent(curBookId: number, chapterIds: number[]) {
    return updateChapter(curBookId, chapterIds)
      .then((result) => {
        Message.success('所有章节已处理完毕！');
        result.data.map((cid: number | any) => {
          const option = indexOptionMap.get(cid);
          option.isHasContent = true; // 不知道为何不生效，完成后不会切换样式
          option.isCheck = false;
          return cid;
        });
      })
      .catch((err) => {
        Message.error(`获取章节失败：${err}`);
      });
  }

  // 每一个章节是否选中时触发
  const changeChapterIsCheck = (cIndex: number) => {
    const cStatus = indexOptionMap.get(cIndex);
    chapterHasCheckedNum.value += !cStatus.isCheck ? 1 : -1;
    cStatus.isCheck = !cStatus.isCheck;
    return true;
  };

  const queryBook = () => {
    return queryBookById(bookid).then((rsl: any) => {
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

  const showeditmenu = (chapterId: number) => {};

  // 切换是否选中空章节
  const checkEmptyChapter = (
    isChecked: boolean | (string | number | boolean)[]
  ) => {
    let count = 0;
    indexOptionMap.forEach((i: any) => {
      if (i.isHasContent) return;
      i.isCheck = isChecked;
      count += 1;
    });
    chapterHasCheckedNum.value += isChecked ? count : -count;
  };

  // 开始爬选中的章节
  const goToGetAllChapter = () => {
    const chapterOnCheck: number[] = [];
    indexOptionMap.forEach((i: any, key: any) => {
      if (i.isCheck) chapterOnCheck.push(key);
    });
    if (chapterOnCheck.length !== 0)
      Message.loading(`已选中${chapterOnCheck.length}章，正在开始尝试获取。`);
    else
      Message.error(`没选中任何章节，请先勾选需要选获取的章节，然后再开始。`);

    GetChapterContent(bookid, chapterOnCheck);
  };

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
      await GetChapterContent(bookid, chapterOnCheck);
    }
    Message.loading(`开始生成PDF`);
    createPDF(bookid, chapterOnCheck, true)
      .then((result) => {
        Message.success(`已通过邮件发送：《${result.data.book.filename}》`);
      })
      .catch((err) => {
        Message.error(`生成PDF的时候出现错误：${err}`);
      });
  };

  // 只读模式下的打开章节
  const goto = (chapterId: number) => {
    router.push({ path: `/book/${bookid}/chapter/${chapterId}` });
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
